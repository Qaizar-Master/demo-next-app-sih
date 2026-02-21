/**
 * /api/challenges/[id]/progress
 *
 * GET   — get current user's progress on a specific challenge
 * POST  — start a challenge (creates/updates ChallengeProgress to IN_PROGRESS)
 * PATCH — update progress value (increment step completed)
 */

import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

// GET /api/challenges/[id]/progress
export const GET = withAuth(async (req, { params }, userId) => {
    const { id } = await params;
    const progress = await prisma.challengeProgress.findUnique({
        where: { userId_challengeId: { userId, challengeId: id } },
    });
    return ok(progress ?? { challengeId: id, status: "NOT_STARTED", progress: 0 });
});

// POST /api/challenges/[id]/progress  — start challenge
export const POST = withAuth(async (req, { params }, userId) => {
    const { id } = await params;

    const challenge = await prisma.challenge.findUnique({ where: { id } });
    if (!challenge) return err("Challenge not found", 404);

    const progress = await prisma.challengeProgress.upsert({
        where: { userId_challengeId: { userId, challengeId: id } },
        update: { status: "IN_PROGRESS", startedAt: new Date() },
        create: {
            userId,
            challengeId: id,
            status: "IN_PROGRESS",
            startedAt: new Date(),
        },
    });

    // Also create a game session
    await prisma.gameSession.create({
        data: {
            userId,
            challengeId: id,
            type: "CHALLENGE",
            status: "ACTIVE",
        },
    });

    return ok(progress, 201);
});

// PATCH /api/challenges/[id]/progress  — increment progress
export const PATCH = withAuth(async (req, { params }, userId) => {
    const { id } = await params;
    const { increment = 1 } = await req.json();

    const challenge = await prisma.challenge.findUnique({ where: { id } });
    if (!challenge) return err("Challenge not found", 404);

    const existing = await prisma.challengeProgress.findUnique({
        where: { userId_challengeId: { userId, challengeId: id } },
    });

    if (!existing) return err("Start the challenge first", 400);

    const newProgress = Math.min(existing.progress + increment, challenge.maxProgress);
    const isComplete = newProgress >= challenge.maxProgress;

    const updated = await prisma.$transaction(async (tx) => {
        const prog = await tx.challengeProgress.update({
            where: { userId_challengeId: { userId, challengeId: id } },
            data: {
                progress: newProgress,
                status: isComplete ? "COMPLETED" : "IN_PROGRESS",
                completedAt: isComplete ? new Date() : null,
            },
        });

        if (isComplete) {
            // Award points
            await tx.profile.update({
                where: { id: userId },
                data: { totalPoints: { increment: challenge.points } },
            });

            // Update leaderboard
            await tx.leaderboardEntry.upsert({
                where: { userId_communityId_period: { userId, communityId: null, period: "global" } },
                update: { points: { increment: challenge.points } },
                create: { userId, period: "global", points: challenge.points },
            });

            // Update game session
            await tx.gameSession.updateMany({
                where: { userId, challengeId: id, status: "ACTIVE" },
                data: { status: "COMPLETED", completedAt: new Date() },
            });

            // Streak update
            await tx.userProgress.update({
                where: { userId },
                data: {
                    currentStreak: { increment: 1 },
                    longestStreak: { increment: 1 }, // simplified; real logic compares dates
                    lastActiveAt: new Date(),
                },
            });
        }

        return prog;
    });

    return ok(updated);
});

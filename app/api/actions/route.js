/**
 * /api/actions
 *
 * GET  — get actions for the current user (or all, for admin)
 * POST — submit a new eco-action (before/after image + location)
 */

import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

// GET /api/actions?status=PENDING
export const GET = withAuth(async (req, ctx, userId) => {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const profile = await prisma.profile.findUnique({ where: { id: userId } });

    const actions = await prisma.action.findMany({
        where: {
            ...(profile?.isAdmin ? {} : { userId }), // admin sees all
            ...(status ? { status } : {}),
        },
        include: {
            user: { select: { fullName: true, avatarUrl: true } },
            community: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return ok(actions);
});

// POST /api/actions — submit an eco-action
export const POST = withAuth(async (req, ctx, userId) => {
    const { beforeImage, afterImage, category, title, communityId, latitude, longitude } =
        await req.json();

    if (!beforeImage || !afterImage || !category) {
        return err("beforeImage, afterImage, and category are required");
    }

    // Simulate AI confidence score (replace with real AI call)
    const aiConfidence = Math.random() * 0.4 + 0.6; // 0.6–1.0 for demo
    const aiStatus = aiConfidence >= 0.8 ? "AI_APPROVED" : "PENDING";
    const pointsAwarded = aiStatus === "AI_APPROVED" ? 25 : 0;

    const action = await prisma.$transaction(async (tx) => {
        const act = await tx.action.create({
            data: {
                userId,
                communityId: communityId ?? null,
                title,
                category,
                beforeImage,
                afterImage,
                latitude: latitude ?? null,
                longitude: longitude ?? null,
                status: aiStatus,
                aiConfidence,
                pointsAwarded,
            },
        });

        if (aiStatus === "AI_APPROVED") {
            await tx.profile.update({
                where: { id: userId },
                data: { totalPoints: { increment: pointsAwarded } },
            });

            await tx.leaderboardEntry.upsert({
                where: { userId_communityId_period: { userId, communityId: null, period: "global" } },
                update: { points: { increment: pointsAwarded } },
                create: { userId, period: "global", points: pointsAwarded },
            });

            // Community points
            if (communityId) {
                await tx.community.update({
                    where: { id: communityId },
                    data: { totalPoints: { increment: pointsAwarded } },
                });
                await tx.leaderboardEntry.upsert({
                    where: { userId_communityId_period: { userId, communityId, period: "global" } },
                    update: { points: { increment: pointsAwarded } },
                    create: { userId, communityId, period: "global", points: pointsAwarded },
                });
            }
        }

        return act;
    });

    return ok(action, 201);
});

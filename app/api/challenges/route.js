/**
 * /api/challenges
 *
 * GET  — list all active challenges, enriched with current user's progress
 * POST — admin only: create a new challenge
 */

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

// GET /api/challenges
export const GET = withAuth(async (req, ctx, userId) => {
    const [challenges, userProgress] = await Promise.all([
        prisma.challenge.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "asc" },
        }),
        prisma.challengeProgress.findMany({
            where: { userId },
        }),
    ]);

    const progressMap = Object.fromEntries(
        userProgress.map((p) => [p.challengeId, p])
    );

    const enriched = challenges.map((c) => ({
        ...c,
        userProgress: progressMap[c.id] ?? null,
    }));

    return ok(enriched);
});

// POST /api/challenges  (admin only)
export const POST = withAuth(async (req, ctx, userId) => {
    const profile = await prisma.profile.findUnique({ where: { id: userId } });
    if (!profile?.isAdmin) return err("Forbidden", 403);

    const body = await req.json();
    const challenge = await prisma.challenge.create({ data: body });
    return ok(challenge, 201);
});

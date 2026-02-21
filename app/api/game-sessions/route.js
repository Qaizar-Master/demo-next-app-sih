/**
 * /api/game-sessions
 *
 * GET  — get recent game sessions for the current user
 * POST — create a new game session (for non-challenge games like quiz, eco-tree, etc.)
 */

import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

// GET /api/game-sessions?limit=10
export const GET = withAuth(async (req, ctx, userId) => {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const sessions = await prisma.gameSession.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { challenge: { select: { title: true, category: true } } },
    });

    return ok(sessions);
});

// POST /api/game-sessions
export const POST = withAuth(async (req, ctx, userId) => {
    const { type, challengeId } = await req.json();
    if (!type) return err("type is required");

    const session = await prisma.gameSession.create({
        data: { userId, type, challengeId: challengeId ?? null, status: "ACTIVE" },
    });

    return ok(session, 201);
});

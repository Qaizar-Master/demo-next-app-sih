/**
 * /api/game-sessions/[id]
 *
 * PATCH — complete or abandon a game session, optionally set score
 */

import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export const PATCH = withAuth(async (req, { params }, userId) => {
    const { id } = await params;
    const { status, score, progress } = await req.json();

    const session = await prisma.gameSession.findUnique({ where: { id } });
    if (!session) return err("Session not found", 404);
    if (session.userId !== userId) return err("Forbidden", 403);

    const updated = await prisma.$transaction(async (tx) => {
        const u = await tx.gameSession.update({
            where: { id },
            data: {
                status: status ?? session.status,
                score: score ?? session.score,
                progress: progress ?? session.progress,
                completedAt: (status === "COMPLETED" || (status === undefined && session.status === "COMPLETED")) ? new Date() : session.completedAt,
            },
        });

        // If newly completed with a score, or score updated on a completed session
        if (status === "COMPLETED" && score > 0) {
            await tx.profile.update({
                where: { id: userId },
                data: { totalPoints: { increment: score } }
            });
        }

        return u;
    });

    return ok(updated);
});

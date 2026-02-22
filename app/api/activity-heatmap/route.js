/**
 * GET /api/activity-heatmap
 * Returns daily point totals for the last 12 months (or a given year).
 * Shape: { "2025-02-14": 120, "2025-02-15": 45, ... }
 */

import prisma from "@/lib/prisma";
import { withAuth, ok } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export const GET = withAuth(async (req, ctx, userId) => {
    const { searchParams } = new URL(req.url);
    const months = parseInt(searchParams.get("months") ?? "12");

    const since = new Date();
    since.setMonth(since.getMonth() - months);
    since.setHours(0, 0, 0, 0);

    // Pull all game sessions (score = points) and approved eco-actions (pointsAwarded)
    const [sessions, actions] = await Promise.all([
        prisma.gameSession.findMany({
            where: { userId, createdAt: { gte: since } },
            select: { createdAt: true, score: true },
        }),
        prisma.action.findMany({
            where: {
                userId,
                status: { in: ["APPROVED", "AI_APPROVED"] },
                reviewedAt: { gte: since },
            },
            select: { reviewedAt: true, pointsAwarded: true },
        }),
    ]);

    const map = {};

    sessions.forEach((s) => {
        const date = new Date(s.createdAt);
        // Use local date format YYYY-MM-DD instead of UTC to match frontend
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        map[key] = (map[key] ?? 0) + (s.score ?? 0);
    });

    actions.forEach((a) => {
        if (!a.reviewedAt) return;
        const date = new Date(a.reviewedAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        map[key] = (map[key] ?? 0) + (a.pointsAwarded ?? 0);
    });

    return ok({ data: map });
});

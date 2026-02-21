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

    // Aggregate into { "YYYY-MM-DD": totalPoints }
    const map = {};

    const addToDay = (date, pts) => {
        if (!pts || pts <= 0) return;
        const key = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
        map[key] = (map[key] ?? 0) + pts;
    };

    sessions.forEach((s) => addToDay(new Date(s.createdAt), s.score ?? 0));
    actions.forEach((a) => a.reviewedAt && addToDay(new Date(a.reviewedAt), a.pointsAwarded ?? 0));

    return ok(map);
});

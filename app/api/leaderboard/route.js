/**
 * /api/leaderboard
 *
 * GET — returns the top-N leaderboard entries for a given period
 *       query params: period=global|monthly|weekly|allTime, limit=20, communityId=...
 *
 * Special period "allTime" → reads directly from Profile.totalPoints so
 * it always reflects current points regardless of LeaderboardEntry rows.
 */

import prisma from "@/lib/prisma";
import { withAuth, ok } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export const GET = withAuth(async (req, ctx, userId) => {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") ?? "global";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const communityId = searchParams.get("communityId") ?? undefined;

    // ── All-Time: pull directly from Profile.totalPoints ──────────────────
    if (period === "allTime") {
        const profiles = await prisma.profile.findMany({
            orderBy: { totalPoints: "desc" },
            take: limit,
            select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                role: true,
                totalPoints: true,
            },
        });

        const ranked = profiles.map((p, i) => ({
            id: p.id,
            userId: p.id,
            rank: i + 1,
            points: p.totalPoints,
            user: { id: p.id, fullName: p.fullName, avatarUrl: p.avatarUrl, role: p.role },
        }));

        const myEntry = ranked.find((e) => e.userId === userId) ?? null;
        return ok({ entries: ranked, myEntry });
    }

    // ── Period-based: use LeaderboardEntry ────────────────────────────────
    const entries = await prisma.leaderboardEntry.findMany({
        where: {
            period,
            ...(communityId ? { communityId } : { communityId: null }),
        },
        include: {
            user: { select: { id: true, fullName: true, avatarUrl: true, role: true } },
        },
        orderBy: { points: "desc" },
        take: limit,
    });

    const ranked = entries.map((e, i) => ({ ...e, rank: i + 1 }));
    const myEntry = ranked.find((e) => e.userId === userId) ?? null;

    return ok({ entries: ranked, myEntry });
});

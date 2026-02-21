/**
 * /api/badges
 *
 * GET  — list all badges (with whether the current user has earned each one)
 * POST — admin only: create a new badge definition
 */

import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export const GET = withAuth(async (req, ctx, userId) => {
    const [badges, earned] = await Promise.all([
        prisma.badge.findMany({ orderBy: { createdAt: "asc" } }),
        prisma.userBadge.findMany({ where: { userId } }),
    ]);

    const earnedSet = new Set(earned.map((b) => b.badgeId));

    return ok(
        badges.map((b) => ({
            ...b,
            earned: earnedSet.has(b.id),
            awardedAt: earned.find((e) => e.badgeId === b.id)?.awardedAt ?? null,
        }))
    );
});

export const POST = withAuth(async (req, ctx, userId) => {
    const profile = await prisma.profile.findUnique({ where: { id: userId } });
    if (!profile?.isAdmin) return err("Forbidden", 403);

    const { name, description, iconUrl, condition } = await req.json();
    if (!name || !description || !condition) {
        return err("name, description, and condition are required");
    }

    const badge = await prisma.badge.create({
        data: { name, description, iconUrl, condition },
    });
    return ok(badge, 201);
});

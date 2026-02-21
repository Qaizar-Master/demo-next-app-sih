/**
 * /api/badges/award
 *
 * POST — award a badge to the current user (called internally after milestone checks)
 *        body: { badgeId }
 */

import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

export const POST = withAuth(async (req, ctx, userId) => {
    const { badgeId } = await req.json();
    if (!badgeId) return err("badgeId is required");

    const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
    if (!badge) return err("Badge not found", 404);

    // Idempotent — won't throw if already earned
    const userBadge = await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId, badgeId } },
        update: {},
        create: { userId, badgeId },
    });

    return ok(userBadge, 201);
});

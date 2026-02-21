/**
 * /api/actions/[id]/review
 *
 * PATCH — admin approves or rejects an eco-action manually
 *         if approved → award points to user (and community)
 */

import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

export const PATCH = withAuth(async (req, { params }, userId) => {
    const { id } = await params;
    const { status, adminNote, pointsAwarded: customPoints } = await req.json();

    const admin = await prisma.profile.findUnique({ where: { id: userId } });
    if (!admin?.isAdmin) return err("Forbidden", 403);

    if (!["APPROVED", "REJECTED"].includes(status)) {
        return err("status must be APPROVED or REJECTED");
    }

    const action = await prisma.action.findUnique({ where: { id } });
    if (!action) return err("Action not found", 404);

    const pointsToAward = status === "APPROVED" ? (customPoints ?? 25) : 0;

    const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.action.update({
            where: { id },
            data: {
                status,
                adminNote,
                pointsAwarded: pointsToAward,
                reviewedAt: new Date(),
            },
        });

        if (status === "APPROVED" && pointsToAward > 0) {
            await tx.profile.update({
                where: { id: action.userId },
                data: { totalPoints: { increment: pointsToAward } },
            });

            await tx.leaderboardEntry.upsert({
                where: { userId_communityId_period: { userId: action.userId, communityId: null, period: "global" } },
                update: { points: { increment: pointsToAward } },
                create: { userId: action.userId, period: "global", points: pointsToAward },
            });

            if (action.communityId) {
                await tx.community.update({
                    where: { id: action.communityId },
                    data: { totalPoints: { increment: pointsToAward } },
                });
            }
        }

        return updated;
    });

    return ok(result);
});

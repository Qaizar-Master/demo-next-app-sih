/**
 * /api/eco-tree/complete-task
 *
 * POST — Increment user points and log activity for the heatmap.
 */

import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export const POST = withAuth(async (req, ctx, userId) => {
    try {
        const { taskId, points } = await req.json();

        if (!taskId || !points) {
            return err("taskId and points are required", 400);
        }

        // Use a transaction to ensure both updates happen or none
        const result = await prisma.$transaction(async (tx) => {
            // 1. Update Profile totalPoints
            const updatedProfile = await tx.profile.update({
                where: { id: userId },
                data: {
                    totalPoints: {
                        increment: points
                    }
                },
                select: {
                    totalPoints: true
                }
            });

            // 2. Log GameSession for activity feed/heatmap
            const session = await tx.gameSession.create({
                data: {
                    userId,
                    type: "ECO_TREE", // Map to ECO_TREE in GameType enum
                    status: "COMPLETED",
                    score: points,
                    completedAt: new Date(),
                }
            });

            // 3. Update level in UserProgress (simple level calculation: points / 100 + 1)
            const newLevel = Math.floor(updatedProfile.totalPoints / 100) + 1;
            const updatedProgress = await tx.userProgress.update({
                where: { userId },
                data: {
                    level: newLevel,
                    lastActiveAt: new Date()
                }
            });

            return {
                points: updatedProfile.totalPoints,
                level: updatedProgress.level,
                sessionId: session.id
            };
        });

        return ok(result);
    } catch (e) {
        console.error("[POST /api/eco-tree/complete-task] Error:", e);
        return err(e.message, 500);
    }
});

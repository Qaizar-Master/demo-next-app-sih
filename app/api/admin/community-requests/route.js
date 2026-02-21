/**
 * /api/admin/community-requests
 *
 * GET — list all community requests (admin only)
 *       query: status=PENDING|APPROVED|REJECTED
 */

import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

export const GET = withAuth(async (req, ctx, userId) => {
    const admin = await prisma.profile.findUnique({ where: { id: userId } });
    if (!admin?.isAdmin) return err("Forbidden", 403);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? undefined;

    const requests = await prisma.communityRequest.findMany({
        where: status ? { status } : {},
        include: {
            user: { select: { id: true, fullName: true, email: true, totalPoints: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return ok(requests);
});

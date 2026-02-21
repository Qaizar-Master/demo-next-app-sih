/**
 * /api/communities/[id]
 *
 * GET   — get a single community with member list
 * PATCH — community leader updates community info
 * DELETE — community leader/admin deletes the community
 */

import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export const GET = withAuth(async (req, { params }, userId) => {
    const { id } = await params;

    const community = await prisma.community.findUnique({
        where: { id },
        include: {
            creator: { select: { id: true, fullName: true, avatarUrl: true } },
            members: {
                where: { active: true },
                include: { user: { select: { id: true, fullName: true, avatarUrl: true, totalPoints: true } } },
                orderBy: { joinedAt: "asc" },
            },
            _count: { select: { actions: true } },
        },
    });

    if (!community) return err("Community not found", 404);
    return ok(community);
});

export const PATCH = withAuth(async (req, { params }, userId) => {
    const { id } = await params;
    const community = await prisma.community.findUnique({ where: { id } });
    if (!community) return err("Community not found", 404);
    if (community.createdById !== userId) return err("Forbidden", 403);

    const { name, description, imageUrl } = await req.json();
    const updated = await prisma.community.update({
        where: { id },
        data: { name, description, imageUrl },
    });

    return ok(updated);
});

export const DELETE = withAuth(async (req, { params }, userId) => {
    const { id } = await params;
    const profile = await prisma.profile.findUnique({ where: { id: userId } });
    const community = await prisma.community.findUnique({ where: { id } });
    if (!community) return err("Community not found", 404);

    const isOwner = community.createdById === userId;
    const isAdmin = profile?.isAdmin;
    if (!isOwner && !isAdmin) return err("Forbidden", 403);

    await prisma.community.delete({ where: { id } });
    return ok({ message: "Community deleted" });
});

/**
 * /api/communities/[id]/join
 *
 * POST — join a community via joinCode or community id
 * DELETE — leave a community
 */

import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

// POST /api/communities/[id]/join  (body: { joinCode })
export const POST = withAuth(async (req, { params }, userId) => {
    const { joinCode } = await req.json();
    const { id } = await params;

    const community = await prisma.community.findFirst({
        where: { id, joinCode, status: "APPROVED" },
    });
    if (!community) return err("Community not found or invalid code", 404);

    const already = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId, communityId: id } },
    });
    if (already?.active) return err("Already a member", 409);

    const member = await prisma.communityMember.upsert({
        where: { userId_communityId: { userId, communityId: id } },
        update: { active: true },
        create: { userId, communityId: id, role: "MEMBER" },
    });

    return ok(member, 201);
});

// DELETE /api/communities/[id]/join  — leave
export const DELETE = withAuth(async (req, { params }, userId) => {
    const { id } = await params;

    const member = await prisma.communityMember.findUnique({
        where: { userId_communityId: { userId, communityId: id } },
    });
    if (!member) return err("Not a member", 404);

    await prisma.communityMember.update({
        where: { userId_communityId: { userId, communityId: id } },
        data: { active: false },
    });

    return ok({ message: "Left community" });
});

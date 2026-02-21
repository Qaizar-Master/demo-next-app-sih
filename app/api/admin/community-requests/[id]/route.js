/**
 * /api/admin/community-requests/[id]
 *
 * PATCH — approve or reject a community request
 *
 * On APPROVED:
 *  1. Creates the Community record with a random join code
 *  2. Adds the user as the LEADER member
 *  3. Upgrades Profile.role to COMMUNITY_LEADER
 */

import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export const PATCH = withAuth(async (req, { params }, userId) => {
    const { id } = await params;
    const { status, adminNote } = await req.json();

    const admin = await prisma.profile.findUnique({ where: { id: userId } });
    if (!admin?.isAdmin) return err("Forbidden", 403);

    if (!["APPROVED", "REJECTED"].includes(status)) {
        return err("status must be APPROVED or REJECTED");
    }

    const request = await prisma.communityRequest.findUnique({
        where: { id },
        include: { user: true },
    });
    if (!request) return err("Request not found", 404);
    if (request.status !== "PENDING") return err("Request already reviewed", 409);

    if (status === "REJECTED") {
        const updated = await prisma.communityRequest.update({
            where: { id },
            data: { status: "REJECTED", adminNote, reviewedAt: new Date() },
        });
        return ok(updated);
    }

    // --- APPROVED path ---
    const joinCode = randomBytes(4).toString("hex").toUpperCase(); // e.g. "A3F9B2C1"

    const result = await prisma.$transaction(async (tx) => {
        // 1. Update the request
        const updatedRequest = await tx.communityRequest.update({
            where: { id },
            data: { status: "APPROVED", adminNote, reviewedAt: new Date() },
        });

        // 2. Create the community
        const community = await tx.community.create({
            data: {
                name: request.communityName,
                description: request.description,
                joinCode,
                status: "APPROVED",
                createdById: request.userId,
                reviewedAt: new Date(),
            },
        });

        // 3. Add user as LEADER member
        await tx.communityMember.create({
            data: {
                userId: request.userId,
                communityId: community.id,
                role: "LEADER",
                active: true,
            },
        });

        // 4. Upgrade user role
        await tx.profile.update({
            where: { id: request.userId },
            data: { role: "COMMUNITY_LEADER" },
        });

        return { updatedRequest, community };
    });

    return ok(result);
});

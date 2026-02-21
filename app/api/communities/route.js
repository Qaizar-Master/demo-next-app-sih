/**
 * /api/communities
 *
 * GET  — list all approved communities (with optional search)
 * POST — request to create a new community (requires 500 eco-points minimum)
 */

import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

const MIN_POINTS_REQUIRED = 500;

// GET /api/communities?search=...
export const GET = withAuth(async (req, ctx, userId) => {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";

    const communities = await prisma.community.findMany({
        where: {
            status: "APPROVED",
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }),
        },
        include: {
            creator: { select: { fullName: true, avatarUrl: true } },
            _count: { select: { members: true } },
        },
        orderBy: { totalPoints: "desc" },
    });

    return ok(communities);
});

// POST /api/communities — submit a request to create a community
export const POST = withAuth(async (req, ctx, userId) => {
    const { name, description } = await req.json();
    if (!name?.trim()) return err("Community name is required");

    // Check point threshold
    const profile = await prisma.profile.findUnique({ where: { id: userId } });
    if (!profile) return err("Profile not found", 404);

    if (profile.totalPoints < MIN_POINTS_REQUIRED) {
        return err(
            `You need at least ${MIN_POINTS_REQUIRED} eco-points to create a community. You currently have ${profile.totalPoints}.`,
            403
        );
    }

    // Check for pending request already
    const existing = await prisma.communityRequest.findFirst({
        where: { userId, status: "PENDING" },
    });
    if (existing) return err("You already have a pending community request", 409);

    // Check name not taken
    const nameTaken = await prisma.community.findFirst({ where: { name } });
    if (nameTaken) return err("A community with this name already exists", 409);

    const request = await prisma.communityRequest.create({
        data: {
            userId,
            communityName: name,
            description,
            minPoints: MIN_POINTS_REQUIRED,
            status: "PENDING",
        },
    });

    return ok(
        { request, message: "Request submitted! Awaiting admin approval." },
        201
    );
});

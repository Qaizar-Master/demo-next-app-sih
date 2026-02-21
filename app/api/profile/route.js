/**
 * /api/profile
 *
 * GET  — get the current user's full profile (including progress & badges)
 * POST — upsert profile from Clerk user data (called on first login / sign-up)
 */

import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, ok, err } from "@/lib/api-helpers";

// GET /api/profile
export const GET = withAuth(async (req, ctx, userId) => {
    const profile = await prisma.profile.findUnique({
        where: { id: userId },
        include: {
            progress: true,
            badges: { include: { badge: true } },
            memberships: { include: { community: true } },
        },
    });

    if (!profile) return err("Profile not found", 404);
    return ok(profile);
});

// POST /api/profile  — upsert on login
export async function POST() {
    const user = await currentUser();
    if (!user) return err("Unauthorized", 401);

    const email = user.emailAddresses[0]?.emailAddress ?? "";

    const profile = await prisma.profile.upsert({
        where: { id: user.id },
        update: {
            fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
            avatarUrl: user.imageUrl,
            email,
        },
        create: {
            id: user.id,
            email,
            fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
            avatarUrl: user.imageUrl,
            progress: {
                create: {}, // seed UserProgress with defaults
            },
        },
        include: { progress: true },
    });

    return ok(profile, 201);
}

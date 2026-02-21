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

export const dynamic = "force-dynamic";

// GET /api/profile
export const GET = withAuth(async (req, ctx, userId) => {
    try {
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
    } catch (e) {
        console.error("[GET /api/profile] Error:", e);
        return NextResponse.json({ error: "Internal server error", detail: e.message }, { status: 500 });
    }
});

// POST /api/profile  — upsert on login
export async function POST() {
    try {
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
                    create: {},
                },
            },
            include: { progress: true },
        });

        return ok(profile, 201);
    } catch (e) {
        console.error("[POST /api/profile] Error:", e);
        return NextResponse.json({ error: "Internal server error", detail: e.message }, { status: 500 });
    }
}

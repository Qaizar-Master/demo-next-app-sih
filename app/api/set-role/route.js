/**
 * /api/set-role
 *
 * POST — set the current user's role in Clerk public metadata.
 *         Valid roles: INDIVIDUAL, COMMUNITY_LEADER (ADMIN is set directly in DB)
 *
 * Also updates the Profile.role in the database.
 */

import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await req.json();
  const allowed = ["INDIVIDUAL", "COMMUNITY_LEADER"];
  if (!allowed.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const client = await clerkClient();

  // Update Clerk metadata + DB in parallel
  await Promise.all([
    client.users.updateUser(userId, { publicMetadata: { role } }),
    prisma.profile.update({ where: { id: userId }, data: { role } }),
  ]);

  return NextResponse.json({ ok: true, role });
}
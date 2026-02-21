/**
 * /api/webhooks/clerk
 *
 * Listens for Clerk webhook events.
 * On "user.created" → upserts a Profile + UserProgress in the DB.
 * On "user.updated" → syncs email / name / avatar.
 * On "user.deleted" → deletes the profile (cascades to all related records).
 *
 * Set CLERK_WEBHOOK_SECRET in .env (from Clerk dashboard → Webhooks → signing secret).
 */

import { Webhook } from "svix";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing svix headers", { status: 400 });
    }

    const payload = await req.text();
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;
    try {
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch {
        return new Response("Invalid signature", { status: 400 });
    }

    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses?.[0]?.email_address ?? "";
    const fullName = `${first_name ?? ""} ${last_name ?? ""}`.trim();

    if (evt.type === "user.created") {
        await prisma.profile.upsert({
            where: { id },
            update: { email, fullName, avatarUrl: image_url },
            create: {
                id,
                email,
                fullName,
                avatarUrl: image_url,
                progress: { create: {} },
            },
        });
    }

    if (evt.type === "user.updated") {
        await prisma.profile.update({
            where: { id },
            data: { email, fullName, avatarUrl: image_url },
        });
    }

    if (evt.type === "user.deleted") {
        await prisma.profile.delete({ where: { id } });
    }

    return new Response("OK", { status: 200 });
}

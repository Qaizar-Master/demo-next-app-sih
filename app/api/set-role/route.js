import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { role } = await req.json();
  if (role !== "student" && role !== "teacher") {
    return new Response(JSON.stringify({ error: "Invalid role" }), { status: 400 });
  }

  await clerkClient.users.updateUser(userId, { publicMetadata: { role } });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
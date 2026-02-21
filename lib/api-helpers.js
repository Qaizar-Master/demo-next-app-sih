import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Wraps a route handler with auth. Passes { userId, user } to the handler.
 * Returns 401 automatically if not authenticated.
 */
export function withAuth(handler) {
    return async (req, ctx) => {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return handler(req, ctx, userId);
    };
}

/**
 * Standard JSON success response
 */
export function ok(data, status = 200) {
    return NextResponse.json(data, { status });
}

/**
 * Standard JSON error response
 */
export function err(message, status = 400) {
    return NextResponse.json({ error: message }, { status });
}

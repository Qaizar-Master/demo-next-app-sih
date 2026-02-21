/**
 * lib/client-api.js
 *
 * Thin wrapper around fetch for calling our own Next.js API routes from client components.
 * Throws on non-ok responses so callers get a clean error.
 */

async function apiFetch(path, options = {}) {
    const res = await fetch(path, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? `API error ${res.status}`);
    return data;
}

// ── Profile ─────────────────────────────────────────────
export const api = {
    // Upsert profile from Clerk data (call once after login)
    syncProfile: () => apiFetch("/api/profile", { method: "POST" }),

    // Get full profile with progress + badges
    getProfile: () => apiFetch("/api/profile"),

    // ── Challenges ────────────────────────────────────────
    getChallenges: () => apiFetch("/api/challenges"),

    startChallenge: (id) =>
        apiFetch(`/api/challenges/${id}/progress`, { method: "POST" }),

    updateChallengeProgress: (id, increment = 1) =>
        apiFetch(`/api/challenges/${id}/progress`, {
            method: "PATCH",
            body: JSON.stringify({ increment }),
        }),

    // ── Game Sessions ─────────────────────────────────────
    getGameSessions: (limit = 10) =>
        apiFetch(`/api/game-sessions?limit=${limit}`),

    createGameSession: (type, challengeId = null) =>
        apiFetch("/api/game-sessions", {
            method: "POST",
            body: JSON.stringify({ type, challengeId }),
        }),

    completeGameSession: (id, score, status = "COMPLETED") =>
        apiFetch(`/api/game-sessions/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status, score }),
        }),

    // ── Communities ───────────────────────────────────────
    getCommunities: (search = "") =>
        apiFetch(`/api/communities?search=${encodeURIComponent(search)}`),

    requestCommunity: (name, description) =>
        apiFetch("/api/communities", {
            method: "POST",
            body: JSON.stringify({ name, description }),
        }),

    getCommunity: (id) => apiFetch(`/api/communities/${id}`),

    joinCommunity: (id, joinCode) =>
        apiFetch(`/api/communities/${id}/join`, {
            method: "POST",
            body: JSON.stringify({ joinCode }),
        }),

    leaveCommunity: (id) =>
        apiFetch(`/api/communities/${id}/join`, { method: "DELETE" }),

    // ── Actions ───────────────────────────────────────────
    submitAction: (payload) =>
        apiFetch("/api/actions", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    getActions: (status = "") =>
        apiFetch(`/api/actions${status ? `?status=${status}` : ""}`),

    // ── Leaderboard ───────────────────────────────────────
    getLeaderboard: (period = "global", limit = 20, communityId = null) => {
        const params = new URLSearchParams({ period, limit });
        if (communityId) params.set("communityId", communityId);
        return apiFetch(`/api/leaderboard?${params}`);
    },

    // ── Badges ────────────────────────────────────────────
    getBadges: () => apiFetch("/api/badges"),

    // ── Admin ─────────────────────────────────────────────
    adminGetCommunityRequests: (status = "") =>
        apiFetch(`/api/admin/community-requests${status ? `?status=${status}` : ""}`),

    adminReviewCommunityRequest: (id, status, adminNote = "") =>
        apiFetch(`/api/admin/community-requests/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ status, adminNote }),
        }),

    adminGetPendingActions: () => apiFetch("/api/actions?status=PENDING"),

    adminReviewAction: (id, status, pointsAwarded = 25, adminNote = "") =>
        apiFetch(`/api/actions/${id}/review`, {
            method: "PATCH",
            body: JSON.stringify({ status, pointsAwarded, adminNote }),
        }),
};

/**
 * lib/badge-checker.js
 *
 * Call checkAndAwardBadges(prisma, userId) after any event that might
 * trigger a badge (game session, eco-action, challenge completion, community join).
 *
 * Badge conditions defined in seed.js:
 *   complete_1_action       — submitted at least 1 eco-action
 *   complete_1_challenge    — completed at least 1 challenge
 *   streak_7                — currentStreak >= 7
 *   streak_30               — currentStreak >= 30
 *   total_points_100        — totalPoints >= 100
 *   total_points_500        — totalPoints >= 500
 *   total_points_1000       — totalPoints >= 1000
 *   join_1_community        — member of at least 1 community
 *   create_community        — created a community
 *   ai_approved_action      — at least 1 AI_APPROVED action
 */

export async function checkAndAwardBadges(prisma, userId) {
    // Fetch everything we need in one go
    const [profile, progress, allBadges, earnedBadges] = await Promise.all([
        prisma.profile.findUnique({
            where: { id: userId },
            include: {
                actions: { select: { status: true } },
                challengeProgress: { select: { status: true } },
                memberships: { select: { active: true } },
                communitiesCreated: { select: { id: true } },
            },
        }),
        prisma.userProgress.findUnique({ where: { userId } }),
        prisma.badge.findMany(),
        prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } }),
    ]);

    if (!profile) return;

    const earnedSet = new Set(earnedBadges.map((b) => b.badgeId));

    // Pre-compute user stats
    const stats = {
        totalPoints: profile.totalPoints,
        actionCount: profile.actions.length,
        aiApprovedCount: profile.actions.filter((a) => a.status === "AI_APPROVED" || a.status === "APPROVED").length,
        completedChallenges: profile.challengeProgress.filter((c) => c.status === "COMPLETED").length,
        activeMemberships: profile.memberships.filter((m) => m.active).length,
        communitiesCreated: profile.communitiesCreated.length,
        currentStreak: progress?.currentStreak ?? 0,
    };

    const conditionMet = (condition) => {
        switch (condition) {
            case "complete_1_action": return stats.actionCount >= 1;
            case "complete_1_challenge": return stats.completedChallenges >= 1;
            case "streak_7": return stats.currentStreak >= 7;
            case "streak_30": return stats.currentStreak >= 30;
            case "total_points_100": return stats.totalPoints >= 100;
            case "total_points_500": return stats.totalPoints >= 500;
            case "total_points_1000": return stats.totalPoints >= 1000;
            case "join_1_community": return stats.activeMemberships >= 1;
            case "create_community": return stats.communitiesCreated >= 1;
            case "ai_approved_action": return stats.aiApprovedCount >= 1;
            default: return false;
        }
    };

    // Award any badges not yet earned but condition now met
    const toAward = allBadges.filter(
        (b) => !earnedSet.has(b.id) && conditionMet(b.condition)
    );

    if (toAward.length > 0) {
        await prisma.userBadge.createMany({
            data: toAward.map((b) => ({ userId, badgeId: b.id })),
            skipDuplicates: true,
        });
        console.log(`[badge-checker] Awarded ${toAward.length} badge(s) to ${userId}:`, toAward.map((b) => b.name));
    }

    return toAward;
}

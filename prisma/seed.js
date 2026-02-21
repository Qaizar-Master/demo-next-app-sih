/**
 * prisma/seed.js
 *
 * Run with: npx prisma db seed
 *
 * Populates:
 *   - Challenges (the full catalog)
 *   - Badges (milestone rewards)
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const challenges = [
    {
        id: "daily-energy-saver",
        title: "Daily Energy Saver",
        description: "Reduce your household energy consumption by turning off unused appliances and lights for 7 days straight.",
        category: "Energy",
        difficulty: "EASY",
        points: 100,
        duration: "7 days",
        iconName: "Zap",
        colorClass: "bg-yellow-500",
        maxProgress: 7,
        actions: [
            "Turn off all lights when leaving a room",
            "Unplug chargers and electronics when not in use",
            "Use natural light during daytime hours",
        ],
    },
    {
        id: "zero-waste-week",
        title: "Zero Waste Week",
        description: "Commit to producing zero single-use plastic waste for an entire week. Bring reusable bags, bottles, and containers.",
        category: "Waste",
        difficulty: "MEDIUM",
        points: 200,
        duration: "7 days",
        iconName: "Recycle",
        colorClass: "bg-green-500",
        maxProgress: 7,
        actions: [
            "Use reusable shopping bags",
            "Carry a reusable water bottle",
            "Pack lunch in reusable containers",
            "Refuse single-use straws and cutlery",
        ],
    },
    {
        id: "carbon-footprint-reducer",
        title: "Carbon Footprint Reducer",
        description: "Lower your carbon emissions for 30 days by using public transport, cycling, or walking instead of driving.",
        category: "Carbon",
        difficulty: "HARD",
        points: 500,
        duration: "30 days",
        iconName: "Wind",
        colorClass: "bg-blue-500",
        maxProgress: 30,
        actions: [
            "Use public transportation or carpool",
            "Walk or cycle for short distances",
            "Avoid air travel when possible",
            "Eat plant-based meals at least 3 times a week",
        ],
    },
    {
        id: "water-conservation",
        title: "Water Conservation Challenge",
        description: "Conserve water by taking shorter showers, fixing leaks, and using water-efficient practices for 14 days.",
        category: "Water",
        difficulty: "EASY",
        points: 150,
        duration: "14 days",
        iconName: "Droplets",
        colorClass: "bg-cyan-500",
        maxProgress: 14,
        actions: [
            "Take showers under 5 minutes",
            "Turn off tap while brushing teeth",
            "Fix any dripping taps or leaks",
            "Collect rainwater for plants",
        ],
    },
    {
        id: "tree-planting",
        title: "Community Tree Planting",
        description: "Organize or participate in a local tree planting event and plant at least 5 trees in your community.",
        category: "Biodiversity",
        difficulty: "MEDIUM",
        points: 300,
        duration: "1 day",
        iconName: "TreePine",
        colorClass: "bg-emerald-600",
        maxProgress: 5,
        actions: [
            "Find a local tree planting event",
            "Plant at least 5 native trees",
            "Document your planting with photos",
            "Share on social media to inspire others",
        ],
    },
    {
        id: "sustainable-diet",
        title: "Plant-Based Diet Week",
        description: "Adopt a plant-based diet for a full week to reduce the environmental impact of food production.",
        category: "Food",
        difficulty: "MEDIUM",
        points: 250,
        duration: "7 days",
        iconName: "Leaf",
        colorClass: "bg-lime-500",
        maxProgress: 7,
        actions: [
            "Eliminate or reduce meat consumption",
            "Choose locally sourced produce",
            "Minimize food waste",
            "Try cooking a new plant-based recipe daily",
        ],
    },
];

const badges = [
    {
        id: "first-action",
        name: "First Action",
        description: "Complete your very first eco-action",
        iconUrl: "🌿",
        condition: "complete_1_action",
    },
    {
        id: "eco-starter",
        name: "Eco Starter",
        description: "Complete your first challenge",
        iconUrl: "🎯",
        condition: "complete_1_challenge",
    },
    {
        id: "streak-7",
        name: "Week Warrior",
        description: "Maintain a 7-day activity streak",
        iconUrl: "🔥",
        condition: "streak_7",
    },
    {
        id: "streak-30",
        name: "Monthly Champion",
        description: "Maintain a 30-day activity streak",
        iconUrl: "🏆",
        condition: "streak_30",
    },
    {
        id: "points-100",
        name: "Century",
        description: "Earn your first 100 eco-points",
        iconUrl: "⭐",
        condition: "total_points_100",
    },
    {
        id: "points-500",
        name: "Community Leader Candidate",
        description: "Earn 500 eco-points — unlocks community creation",
        iconUrl: "🌍",
        condition: "total_points_500",
    },
    {
        id: "points-1000",
        name: "Eco Champion",
        description: "Earn 1,000 eco-points",
        iconUrl: "🦸",
        condition: "total_points_1000",
    },
    {
        id: "community-joiner",
        name: "Community Joiner",
        description: "Join your first community",
        iconUrl: "🤝",
        condition: "join_1_community",
    },
    {
        id: "community-creator",
        name: "Community Founder",
        description: "Create and lead a community",
        iconUrl: "🏘️",
        condition: "create_community",
    },
    {
        id: "action-verified",
        name: "Verified Hero",
        description: "Have an eco-action verified by AI",
        iconUrl: "✅",
        condition: "ai_approved_action",
    },
];

async function main() {
    console.log("🌱 Seeding challenges...");
    for (const c of challenges) {
        await prisma.challenge.upsert({
            where: { id: c.id },
            update: c,
            create: c,
        });
        console.log(`  ✓ ${c.title}`);
    }

    console.log("\n🏅 Seeding badges...");
    for (const b of badges) {
        await prisma.badge.upsert({
            where: { id: b.id },
            update: b,
            create: b,
        });
        console.log(`  ✓ ${b.name}`);
    }

    console.log("\n✅ Seed complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());

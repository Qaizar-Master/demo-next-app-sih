import { NextResponse } from "next/server";

// Maps our category IDs to search keywords for GNews
// "all" uses multiple keywords fetched separately and merged
const allKeywords = ["renewable energy", "climate change", "biodiversity"];

const categoryKeywords = {
    climate: "climate change global warming",
    renewable: "renewable energy solar wind",
    biodiversity: "biodiversity wildlife species",
    sustainability: "sustainability eco-friendly green",
    conservation: "conservation nature protection",
};

async function fetchArticles(searchTerm, apiKey) {
    const url = new URL("https://gnews.io/api/v4/search");
    url.searchParams.set("q", searchTerm);
    url.searchParams.set("lang", "en");
    url.searchParams.set("max", "3");
    url.searchParams.set("apikey", apiKey);

    const response = await fetch(url.toString(), { next: { revalidate: 300 } });
    const data = await response.json();

    if (!response.ok) {
        console.error("GNews API error:", data);
        return [];
    }

    return data.articles || [];
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "all";

    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey || apiKey === "your_api_key_here") {
        return NextResponse.json(
            { error: "GNews API key is not configured. Please add your key to .env.local" },
            { status: 500 }
        );
    }

    try {
        let rawArticles = [];

        if (category === "all" && !query.trim()) {
            // Fetch from each keyword separately and merge
            const results = await Promise.all(
                allKeywords.map((keyword) => fetchArticles(keyword, apiKey))
            );
            rawArticles = results.flat();
        } else {
            // Single keyword fetch
            const categoryTerm = categoryKeywords[category] || "environment";
            const searchTerm = query.trim()
                ? `${query.trim()} ${categoryTerm}`
                : categoryTerm;
            rawArticles = await fetchArticles(searchTerm, apiKey);
        }

        // Remove duplicates by title
        const seen = new Set();
        const uniqueArticles = rawArticles.filter((item) => {
            if (seen.has(item.title)) return false;
            seen.add(item.title);
            return true;
        });

        // Transform to our format
        const articles = uniqueArticles.map((item, index) => ({
            id: index + 1,
            title: item.title,
            excerpt: item.description || "",
            content: item.content || "",
            category: category === "all" ? "environment" : category,
            author: item.source?.name || "Unknown",
            publishedAt: item.publishedAt,
            readTime: `${Math.max(2, Math.ceil((item.content?.length || 200) / 1000))} min read`,
            image: item.image || `https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=600&h=300&fit=crop`,
            featured: index === 0,
            tags: [category],
            url: item.url,
        }));

        return NextResponse.json({ articles });
    } catch (error) {
        console.error("News fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch news data" },
            { status: 500 }
        );
    }
}
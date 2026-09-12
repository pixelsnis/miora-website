import type { MetadataRoute } from "next";
import { absoluteUrl, PRIVATE_PATHS } from "@/lib/site";

const privatePaths = [...PRIVATE_PATHS];

/**
 * Split stance: search + citation retrieval allowed, model-training crawlers blocked.
 * Survey stays disallowed for every bot.
 */
export default function robots(): MetadataRoute.Robots {
  const trainingBots = [
    "GPTBot",
    "ClaudeBot",
    "anthropic-ai",
    "CCBot",
    "Google-Extended",
    "Applebot-Extended",
  ];

  const retrievalBots = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "PerplexityBot",
    "Perplexity-User",
    "Claude-SearchBot",
    "Claude-User",
    "Googlebot",
    "Bingbot",
  ];

  return {
    rules: [
      {
        userAgent: trainingBots,
        disallow: "/",
      },
      {
        userAgent: retrievalBots,
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

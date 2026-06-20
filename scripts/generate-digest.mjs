// ============================================================
// Overtime - Daily sports news engine (Claude API + web search)
// Generates several English news cards per category, each with an
// image pulled from the source article and a link to the source.
// Runs on GitHub Actions. No external libraries required.
// ============================================================

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY (did you add the GitHub Secret?).");
  process.exit(1);
}

import { writeFileSync, mkdirSync, existsSync } from "node:fs";

// Folder that holds the blog posts (NOTE: the folder name contains a space)
const CONTENT_DIR = "overtime 4/src/content";

// The five categories. These names must match the filter tabs on the site.
const CATEGORIES = ["Football", "Badminton", "Tennis", "Esports", "Trending"];
const SLUG = {
  Football: "football",
  Badminton: "badminton",
  Tennis: "tennis",
  Esports: "esports",
  Trending: "trending",
};

// Date in Vietnam time (UTC+7)
const nowVN = new Date(Date.now() + 7 * 60 * 60 * 1000);
const y = nowVN.getUTCFullYear();
const m = String(nowVN.getUTCMonth() + 1).padStart(2, "0");
const d = String(nowVN.getUTCDate()).padStart(2, "0");
const iso = `${y}-${m}-${d}`;

const prompt = `Today is ${iso}. Find the most important SPORTS news from roughly the last 24 hours, drawn from reputable international and official news outlets.

Cover these five categories:
- Football (soccer)
- Badminton
- Tennis
- Esports
- Trending (any other big, hot sports story that does not fit the four above)

For EACH category, return 2 to 3 of the most notable items. For every item provide:
- "category": exactly one of: Football, Badminton, Tennis, Esports, Trending
- "title": a clear, concise English headline (max ~12 words, no emoji)
- "summary": 2-4 sentences in clear English. Summarise in your own words. Do NOT copy sentences from the source. No emoji, no icons.
- "source_url": the direct URL of the specific article on a reputable outlet

Rules:
- Output ONLY a JSON array of item objects. No prose before or after, no markdown, no code fences.
- If a category has no real news today, simply include fewer items or skip it. Never invent news or fake URLs.
- Keep everything in English.`;

console.log("Asking Claude for today's sports news...");

const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 10 }],
  }),
});

if (!res.ok) {
  console.error("Claude API error. Code:", res.status);
  console.error(await res.text());
  process.exit(1);
}

const data = await res.json();
const text = (data.content || [])
  .filter((b) => b.type === "text")
  .map((b) => b.text)
  .join("\n")
  .trim();

// Pull the JSON array out of the response (defensive against stray prose).
let items;
try {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  items = JSON.parse(text.slice(start, end + 1));
} catch (e) {
  console.error("Could not parse JSON from Claude. Raw text was:");
  console.error(text);
  process.exit(1);
}

if (!Array.isArray(items) || items.length === 0) {
  console.error("No news items returned. Nothing to publish today.");
  process.exit(1);
}

// Fetch the article's lead image (og:image) so each card shows a real photo.
async function fetchOgImage(url) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 (compatible; OvertimeBot/1.0)" },
    });
    clearTimeout(t);
    if (!r.ok) return "";
    const html = await r.text();
    const mm =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    let img = mm ? mm[1] : "";
    if (img.startsWith("//")) img = "https:" + img;
    return img.startsWith("http") ? img : "";
  } catch {
    return "";
  }
}

function clean(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}
function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

if (!existsSync(CONTENT_DIR)) mkdirSync(CONTENT_DIR, { recursive: true });

const counters = {};
let written = 0;

for (const item of items) {
  const category = CATEGORIES.includes(item.category) ? item.category : "Trending";
  const title = clean(item.title);
  const summary = clean(item.summary);
  const url = clean(item.source_url);
  if (!title || !summary || !/^https?:\/\//.test(url)) continue;

  counters[category] = (counters[category] || 0) + 1;
  const n = counters[category];
  const slug = `${iso}-${SLUG[category]}-${n}`;

  const cover = await fetchOgImage(url);
  const excerpt = summary.length > 180 ? summary.slice(0, 177).trimEnd() + "..." : summary;

  const frontmatter = `---
title: ${title}
slug: ${slug}
category: ${category}
excerpt: ${excerpt}
author: Overtime AI
date: ${iso}
cover: ${cover}
readingTime: 2
---
`;

  const body = `${summary}

Source: [${hostOf(url)}](${url})

_Auto-curated summary. Read the full report at the source._`;

  writeFileSync(`${CONTENT_DIR}/${slug}.md`, frontmatter + "\n" + body + "\n", "utf8");
  written++;
  console.log(`  wrote ${slug}.md  (image: ${cover ? "yes" : "fallback"})`);
}

if (written === 0) {
  console.error("No valid items to write.");
  process.exit(1);
}
console.log(`Done. Published ${written} news cards for ${iso}.`);

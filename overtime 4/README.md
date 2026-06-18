# OVERTIME — Sports news & blog

React + TypeScript + Vite + Tailwind + framer-motion + lucide-react.
Liquid-glass UI on black, Instrument Serif display type, video hero,
client-side routing and a markdown-driven blog.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Routes
| Path           | Page                                  |
| -------------- | ------------------------------------- |
| `/`            | Landing (hero + sections + latest)    |
| `/blog`        | All stories (grid of every post)      |
| `/blog/:slug`  | Single article (renders markdown)     |

## Writing a post (the "CMS")
Add a markdown file in `src/content/`. It is picked up automatically — no code
changes, no rebuild config. Frontmatter drives the metadata:

```md
---
title: Your headline
slug: your-headline           # the URL: /blog/your-headline
category: Football            # Football | Athletics | Tennis | Culture | Training
excerpt: One or two sentences shown on cards and at the top of the article.
author: Your Name
date: 2026-06-20             # ISO date, used for sorting (newest first)
readingTime: 7              # minutes
---

## Your markdown body
Normal **markdown** — headings, lists, tables, > blockquotes — all rendered.
```

Cover images are generated as gradients per `category` (see `coverFor` in
`src/lib/posts.ts`). To use real photos instead, swap the gradient `<div>` in
`PostCard.tsx` / `Post.tsx` for an `<img>`.

## Structure
```
src/
  main.tsx                 Router (BrowserRouter + routes)
  pages/  Home Blog Post
  components/  Navbar Footer PostCard LatestStories ScrollToTop
               AboutSection FeaturedVideoSection PhilosophySection ServicesSection
  lib/posts.ts             Loads + parses markdown, gradient covers
  content/*.md             The posts
```

## Deploy
BrowserRouter needs the host to serve `index.html` for unknown paths:
- **Netlify** — `public/_redirects` is included.
- **Vercel** — `vercel.json` is included.
- Other static hosts — configure an SPA fallback to `/index.html`.

## ⚠️ Replace the placeholder videos before launch
The hero / section video URLs point to a third-party CloudFront bucket from the
original design prompt — they are NOT yours. Replace each `src` with your own
sports footage (self-host in `public/`) before publishing.

## Newsletter (it actually works)
The form posts to `/api/subscribe`:
- **Local dev** (`npm run dev`) — handled by a middleware in `vite.config.ts`. With no
  provider set, emails are validated and saved to `subscribers.json` so you can see it work.
- **Production** — handled by the Vercel function in `api/subscribe.ts`.
- **Forward to a provider** — set `BUTTONDOWN_API_KEY` (Vercel env or `.env`). Swap the
  fetch for Mailchimp/ConvertKit if you prefer.
- **Or skip the backend** — set `VITE_NEWSLETTER_ENDPOINT` to a Formspree / Mailchimp form
  action and the form posts straight there.

Copy `.env.example` to `.env` to configure.

## Cover images
Each post sets a `cover:` URL in its frontmatter (free Unsplash photos under the Unsplash
License). Cards and the article hero show the photo and fall back to a category gradient if
the image fails to load. Use your own: put files in `public/covers/` and set
`cover: /covers/your-photo.jpg`.

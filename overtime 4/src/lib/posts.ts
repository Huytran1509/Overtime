// Lightweight markdown "CMS": every file in /src/content/*.md is a post.
// Frontmatter (the block between the --- lines) holds the metadata.

export interface Post {
  slug: string
  title: string
  category: string
  excerpt: string
  author: string
  date: string // ISO yyyy-mm-dd
  readingTime: number // minutes
  cover: string // image URL ('' = fall back to gradient)
  body: string // markdown
}

// Eagerly import every markdown file as a raw string.
const files = import.meta.glob('../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Minimal, dependency-free frontmatter parser (key: value lines).
function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw }
  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    val = val.replace(/^["']|["']$/g, '')
    data[key] = val
  }
  return { data, body: match[2].trim() }
}

export const posts: Post[] = Object.values(files)
  .map((raw) => {
    const { data, body } = parseFrontmatter(raw)
    return {
      slug: data.slug ?? '',
      title: data.title ?? 'Untitled',
      category: data.category ?? 'Story',
      excerpt: data.excerpt ?? '',
      author: data.author ?? 'Overtime',
      date: data.date ?? '2026-01-01',
      readingTime: Number(data.readingTime) || 5,
      cover: data.cover ?? '',
      body,
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export const getPost = (slug?: string): Post | undefined =>
  posts.find((p) => p.slug === slug)

// Procedural gradient cover per category — self-contained, no image files needed.
export function coverFor(category: string): string {
  const map: Record<string, string> = {
    Football:
      'radial-gradient(90% 80% at 70% 15%, rgba(242,165,60,.55), transparent 55%), linear-gradient(160deg,#1a2433,#0c121b)',
    Athletics:
      'radial-gradient(85% 80% at 25% 20%, rgba(92,115,133,.6), transparent 55%), linear-gradient(160deg,#13202a,#0a0f16)',
    Tennis:
      'radial-gradient(90% 80% at 60% 85%, rgba(45,160,120,.5), transparent 55%), linear-gradient(160deg,#10231d,#0a0f12)',
    Culture:
      'radial-gradient(85% 80% at 30% 25%, rgba(160,90,200,.45), transparent 55%), linear-gradient(160deg,#1d1626,#0d0a14)',
    Training:
      'radial-gradient(90% 80% at 75% 20%, rgba(226,96,58,.5), transparent 55%), linear-gradient(160deg,#241a22,#0d1119)',
  }
  return map[category] ?? map.Football
}

import type { MetadataRoute } from 'next'

const BASE_URL = 'https://ouver.jp'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/properties`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/help`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/tokusho`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // 物件詳細ページを動的に追加
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787'}/api/properties?limit=1000`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const json = await res.json()
      const items = Array.isArray(json.data) ? json.data : json.data?.items ?? []
      const propertyPages: MetadataRoute.Sitemap = items.map((p: { id: string; updated_at?: string }) => ({
        url: `${BASE_URL}/properties/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
      return [...staticPages, ...propertyPages]
    }
  } catch {
    // APIが利用不可の場合は静的ページのみ
  }

  return staticPages
}

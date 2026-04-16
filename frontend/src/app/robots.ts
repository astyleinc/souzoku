import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/seller/', '/buyer/', '/professional/', '/broker/', '/admin/'],
      },
    ],
    sitemap: 'https://ouver.jp/sitemap.xml',
  }
}

import type { Metadata } from 'next'
import { API_TIMEOUT_QUICK_MS } from '@shared/constants'

const API_BASE =
  process.env.API_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8787')

type Props = {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { id } = await params
  try {
    const res = await fetch(`${API_BASE}/api/properties/${id}`, {
      signal: AbortSignal.timeout(API_TIMEOUT_QUICK_MS),
    })
    if (res.ok) {
      const json = await res.json()
      const property = json.data ?? json
      const title = property.title
        ? `${property.title}｜Ouver`
        : '物件詳細｜Ouver'
      const description = property.description
        ? property.description.slice(0, 160)
        : '相続不動産の物件詳細。入札方式で適正価格での売却・購入が可能です。'
      return {
        title,
        description,
        openGraph: { title, description },
      }
    }
  } catch {
    // タイムアウト等の場合はフォールバック
  }
  return {
    title: '物件詳細｜Ouver',
    description: '相続不動産の物件詳細。入札方式で適正価格での売却・購入が可能です。',
  }
}

export default function PropertyDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

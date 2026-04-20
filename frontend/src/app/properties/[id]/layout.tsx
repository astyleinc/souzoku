import type { Metadata } from 'next'
import { services } from 'ouver-api'

type Props = {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { id } = await params
  try {
    const property = await services.property.getById(id)
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
  } catch {
    return {
      title: '物件詳細｜Ouver',
      description: '相続不動産の物件詳細。入札方式で適正価格での売却・購入が可能です。',
    }
  }
}

export default function PropertyDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

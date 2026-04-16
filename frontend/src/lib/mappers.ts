import type { Property, PropertyType, PropertyStatus, Urgency } from '@/data/mock'

// APIレスポンスの物件データ型
export type ApiProperty = {
  id: string
  title: string
  address: string
  prefecture: string
  city: string
  propertyType: string
  landArea: number | null
  buildingArea: number | null
  builtYear: number | null
  askingPrice: number
  status: string
  urgency: string
  description: string | null
  isRegistrationComplete: boolean
  createdAt: string
  nearestStation: string | null
  walkMinutes: number | null
  images?: string[]
}

// APIの物件データをフロントエンドのProperty型に変換
export const toProperty = (api: ApiProperty): Property => ({
  id: api.id,
  title: api.title,
  address: api.address,
  prefecture: api.prefecture,
  lat: 0,
  lng: 0,
  price: Math.round(api.askingPrice / 10000),
  type: api.propertyType as PropertyType,
  area: (api.landArea ?? 0) / 10,
  buildingArea: api.buildingArea ? api.buildingArea / 10 : undefined,
  yearBuilt: api.builtYear ?? undefined,
  status: api.status as PropertyStatus,
  urgency: api.urgency as Urgency,
  bidCount: 0,
  images: api.images ?? [],
  description: api.description ?? '',
  sellerReason: '',
  registrationStatus: api.isRegistrationComplete ? '相続登記済み' : '登記手続き中',
  createdAt: api.createdAt,
})

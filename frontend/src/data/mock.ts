export type PropertyStatus =
  | 'reviewing'
  | 'published'
  | 'published_registering'
  | 'bidding'
  | 'bid_ended'
  | 'pending_approval'
  | 'closed'
  | 'returned'
  | 'failed'

export type PropertyType = 'house' | 'land' | 'apartment' | 'other'
export type Urgency = 'urgent' | 'three_months' | 'one_year' | 'undecided'

export type Property = {
  id: string
  title: string
  address: string
  prefecture: string
  lat: number
  lng: number
  price: number
  type: PropertyType
  area: number
  buildingArea?: number
  yearBuilt?: number
  status: PropertyStatus
  urgency: Urgency
  bidCount: number
  imageUrl?: string
  description: string
  sellerReason: string
  registrationStatus: string
  createdAt: string
}

export const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  house: '一戸建て',
  land: '土地',
  apartment: 'マンション',
  other: 'その他',
}

export const URGENCY_LABEL: Record<Urgency, string> = {
  urgent: '至急',
  three_months: '3ヶ月以内',
  one_year: '1年以内',
  undecided: '未定',
}

export const STATUS_LABEL: Record<PropertyStatus, string> = {
  reviewing: '審査待ち',
  published: '公開',
  published_registering: '公開（登記中）',
  bidding: '入札受付中',
  bid_ended: '入札終了',
  pending_approval: '承認待ち',
  closed: '成約',
  returned: '差戻し',
  failed: '不成立',
}

export const mockProperties: Property[] = [
  {
    id: '1',
    title: '練馬区 駅近マンション 3LDK',
    address: '東京都練馬区豊玉北5丁目',
    prefecture: '東京都',
    lat: 35.7380,
    lng: 139.6540,
    price: 3500,
    type: 'apartment',
    area: 72.5,
    buildingArea: 72.5,
    yearBuilt: 2003,
    status: 'bidding',
    urgency: 'three_months',
    bidCount: 5,
    description: '西武池袋線練馬駅徒歩5分。スーパー・コンビニ徒歩圏内。日当たり良好な南向き3LDK。',
    sellerReason: '親から相続。現在空室のため早期売却希望。',
    registrationStatus: '相続登記済み',
    createdAt: '2026-04-10',
  },
  {
    id: '2',
    title: '杉並区 閑静な住宅地の土地',
    address: '東京都杉並区荻窪3丁目',
    prefecture: '東京都',
    lat: 35.7034,
    lng: 139.6204,
    price: 4200,
    type: 'land',
    area: 120.5,
    status: 'bidding',
    urgency: 'urgent',
    bidCount: 8,
    description: 'JR中央線荻窪駅徒歩12分。第一種低層住居専用地域。建築条件なし。',
    sellerReason: '相続税納付のため早期現金化が必要。',
    registrationStatus: '相続登記済み',
    createdAt: '2026-04-08',
  },
  {
    id: '3',
    title: '世田谷区 二世帯住宅',
    address: '東京都世田谷区桜丘4丁目',
    prefecture: '東京都',
    lat: 35.6461,
    lng: 139.6427,
    price: 5800,
    type: 'house',
    area: 180.2,
    buildingArea: 145.8,
    yearBuilt: 1998,
    status: 'bidding',
    urgency: 'three_months',
    bidCount: 3,
    description: '小田急線千歳船橋駅徒歩8分。1階・2階分離型の二世帯住宅。駐車場2台分あり。',
    sellerReason: '両親が他界し、維持管理が困難なため売却。',
    registrationStatus: '遺産分割協議済み',
    createdAt: '2026-04-05',
  },
  {
    id: '4',
    title: '横浜市青葉区 駅徒歩3分マンション',
    address: '神奈川県横浜市青葉区美しが丘2丁目',
    prefecture: '神奈川県',
    lat: 35.5780,
    lng: 139.5580,
    price: 2800,
    type: 'apartment',
    area: 65.3,
    buildingArea: 65.3,
    yearBuilt: 2008,
    status: 'published',
    urgency: 'one_year',
    bidCount: 0,
    description: '東急田園都市線たまプラーザ駅徒歩3分。ペット可。管理体制良好。',
    sellerReason: '相続により取得。居住予定なし。',
    registrationStatus: '登記手続き中',
    createdAt: '2026-04-12',
  },
  {
    id: '5',
    title: '大田区 商業地の一戸建て',
    address: '東京都大田区蒲田5丁目',
    prefecture: '東京都',
    lat: 35.5626,
    lng: 139.7163,
    price: 3200,
    type: 'house',
    area: 95.0,
    buildingArea: 110.5,
    yearBuilt: 1985,
    status: 'closed',
    urgency: 'urgent',
    bidCount: 12,
    description: 'JR蒲田駅徒歩7分。商業地域。店舗兼住宅としても利用可能。',
    sellerReason: '相続人が遠方在住のため管理不能。',
    registrationStatus: '相続登記済み',
    createdAt: '2026-03-20',
  },
  {
    id: '6',
    title: '板橋区 リノベ向きマンション',
    address: '東京都板橋区成増3丁目',
    prefecture: '東京都',
    lat: 35.7780,
    lng: 139.6310,
    price: 1800,
    type: 'apartment',
    area: 55.0,
    buildingArea: 55.0,
    yearBuilt: 1990,
    status: 'bidding',
    urgency: 'three_months',
    bidCount: 7,
    description: '東武東上線成増駅徒歩6分。リノベーション向き。管理費・修繕積立金安め。',
    sellerReason: '母が施設入所。維持費の負担軽減のため。',
    registrationStatus: '相続登記済み',
    createdAt: '2026-04-01',
  },
  {
    id: '7',
    title: '川崎市 大型一戸建て',
    address: '神奈川県川崎市宮前区有馬6丁目',
    prefecture: '神奈川県',
    lat: 35.5764,
    lng: 139.5853,
    price: 4500,
    type: 'house',
    area: 200.0,
    buildingArea: 160.0,
    yearBuilt: 2001,
    status: 'pending_approval',
    urgency: 'three_months',
    bidCount: 4,
    description: '東急田園都市線鷺沼駅バス10分。閑静な住宅街。庭付き。',
    sellerReason: '兄弟で相続。全員売却に合意。',
    registrationStatus: '相続登記済み',
    createdAt: '2026-03-28',
  },
  {
    id: '8',
    title: '中野区 駅近ワンルーム投資用',
    address: '東京都中野区中野5丁目',
    prefecture: '東京都',
    lat: 35.7074,
    lng: 139.6657,
    price: 1500,
    type: 'apartment',
    area: 25.5,
    buildingArea: 25.5,
    yearBuilt: 2010,
    status: 'bidding',
    urgency: 'undecided',
    bidCount: 2,
    description: 'JR中野駅徒歩4分。現在賃貸中（利回り5.2%）。オーナーチェンジ。',
    sellerReason: '遺産整理の一環。',
    registrationStatus: '相続登記済み',
    createdAt: '2026-04-14',
  },
]

export type KpiData = {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'flat'
}

export const mockKpis: KpiData[] = [
  { label: '公開中の物件', value: '24', change: '+3', trend: 'up' },
  { label: '入札中の物件', value: '12', change: '+2', trend: 'up' },
  { label: '今月の成約数', value: '6', change: '+1', trend: 'up' },
  { label: '今月のOuver収益', value: '195.6万', change: '+32.6万', trend: 'up' },
  { label: '未入金の件数', value: '3', change: '-1', trend: 'down' },
  { label: '平均入札数/物件', value: '4.2', change: '+0.3', trend: 'up' },
]

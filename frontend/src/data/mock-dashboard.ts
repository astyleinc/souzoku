// ダッシュボード用モックデータ

export type BidStatus = 'active' | 'superseded' | 'selected' | 'rejected' | 'cancelled'

export type Bid = {
  id: string
  propertyId: string
  propertyTitle: string
  bidderId: string
  bidderName: string
  bidderType: string
  amount: number
  status: BidStatus
  createdAt: string
  updatedAt: string
}

export type CaseStatus =
  | 'broker_assigned'
  | 'seller_contacted'
  | 'buyer_contacted'
  | 'explanation_done'
  | 'contract_signed'
  | 'settlement_done'
  | 'cancelled'

export type Case = {
  id: string
  propertyTitle: string
  propertyAddress: string
  sellerName: string
  buyerName: string
  brokerName: string
  status: CaseStatus
  amount: number
  createdAt: string
  updatedAt: string
}

export type Professional = {
  id: string
  name: string
  qualification: string
  officeName: string
  registrationNumber: string
  email: string
  phone: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  referralCount: number
  closedCount: number
  nwAffiliations: string[]
  createdAt: string
}

export type Broker = {
  id: string
  companyName: string
  representativeName: string
  licenseNumber: string
  email: string
  phone: string
  totalDeals: number
  averageRating: number
  createdAt: string
}

export type Revenue = {
  id: string
  propertyTitle: string
  salePrice: number
  brokerageFee: number
  brokerAmount: number
  ouverAmount: number
  professionalAmount: number
  nwAmount: number
  isNwReferral: boolean
  paymentStatus: 'unpaid' | 'invoiced' | 'paid'
  closedAt: string
}

export type Notification = {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
}

export type User = {
  id: string
  name: string
  email: string
  role: 'seller' | 'buyer' | 'professional' | 'broker' | 'admin'
  createdAt: string
  lastLoginAt: string
}

export type CaseMessage = {
  id: string
  senderName: string
  senderRole: string
  content: string
  createdAt: string
}

export type Document = {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

// ラベルマップ

export const BID_STATUS_LABEL: Record<BidStatus, string> = {
  active: '有効',
  superseded: '更新済み',
  selected: '選択済み',
  rejected: '不採用',
  cancelled: 'キャンセル',
}

export const CASE_STATUS_LABEL: Record<CaseStatus, string> = {
  broker_assigned: '業者割当済み',
  seller_contacted: '売主連絡済み',
  buyer_contacted: '買い手連絡済み',
  explanation_done: '重説完了',
  contract_signed: '契約締結',
  settlement_done: '決済完了',
  cancelled: '案件中止',
}

export const VERIFICATION_STATUS_LABEL: Record<string, string> = {
  pending: '認証待ち',
  verified: '認証済み',
  rejected: '却下',
}

export const ROLE_LABEL: Record<string, string> = {
  seller: '売主',
  buyer: '買い手',
  professional: '士業',
  broker: '業者',
  admin: '管理者',
}

// モックデータ

export const mockBids: Bid[] = [
  { id: 'b1', propertyId: '1', propertyTitle: '練馬区 駅近マンション 3LDK', bidderId: 'u10', bidderName: '株式会社山本不動産', bidderType: '不動産会社', amount: 3600, status: 'active', createdAt: '2026-04-14', updatedAt: '2026-04-14' },
  { id: 'b2', propertyId: '1', propertyTitle: '練馬区 駅近マンション 3LDK', bidderId: 'u11', bidderName: '高橋 健太', bidderType: '個人', amount: 3550, status: 'active', createdAt: '2026-04-13', updatedAt: '2026-04-15' },
  { id: 'b3', propertyId: '1', propertyTitle: '練馬区 駅近マンション 3LDK', bidderId: 'u12', bidderName: '合同会社KS投資', bidderType: '投資家', amount: 3700, status: 'active', createdAt: '2026-04-12', updatedAt: '2026-04-15' },
  { id: 'b4', propertyId: '2', propertyTitle: '杉並区 閑静な住宅地の土地', bidderId: 'u13', bidderName: '渡辺 美咲', bidderType: '個人', amount: 4300, status: 'active', createdAt: '2026-04-11', updatedAt: '2026-04-14' },
  { id: 'b5', propertyId: '2', propertyTitle: '杉並区 閑静な住宅地の土地', bidderId: 'u14', bidderName: '株式会社タカラ建設', bidderType: '不動産会社', amount: 4500, status: 'active', createdAt: '2026-04-10', updatedAt: '2026-04-14' },
  { id: 'b6', propertyId: '6', propertyTitle: '板橋区 リノベ向きマンション', bidderId: 'u15', bidderName: '鈴木 大輔', bidderType: '個人', amount: 1900, status: 'active', createdAt: '2026-04-13', updatedAt: '2026-04-13' },
  { id: 'b7', propertyId: '3', propertyTitle: '世田谷区 二世帯住宅', bidderId: 'u10', bidderName: '株式会社山本不動産', bidderType: '不動産会社', amount: 5900, status: 'active', createdAt: '2026-04-09', updatedAt: '2026-04-14' },
  { id: 'b8', propertyId: '5', propertyTitle: '大田区 商業地の一戸建て', bidderId: 'u16', bidderName: '株式会社アーバン', bidderType: '不動産会社', amount: 3400, status: 'selected', createdAt: '2026-03-25', updatedAt: '2026-04-01' },
]

export const mockCases: Case[] = [
  { id: 'c1', propertyTitle: '大田区 商業地の一戸建て', propertyAddress: '東京都大田区蒲田5丁目', sellerName: '中村 一郎', buyerName: '株式会社アーバン', brokerName: '東京中央不動産株式会社', status: 'contract_signed', amount: 3400, createdAt: '2026-04-02', updatedAt: '2026-04-14' },
  { id: 'c2', propertyTitle: '品川区 駅近オフィスビル', propertyAddress: '東京都品川区大崎2丁目', sellerName: '小林 誠', buyerName: '株式会社山本不動産', brokerName: '東京中央不動産株式会社', status: 'buyer_contacted', amount: 8500, createdAt: '2026-04-05', updatedAt: '2026-04-12' },
  { id: 'c3', propertyTitle: '目黒区 一戸建て', propertyAddress: '東京都目黒区自由が丘1丁目', sellerName: '加藤 裕子', buyerName: '高橋 健太', brokerName: '横浜南不動産株式会社', status: 'settlement_done', amount: 6200, createdAt: '2026-03-15', updatedAt: '2026-04-10' },
  { id: 'c4', propertyTitle: '新宿区 投資用マンション', propertyAddress: '東京都新宿区西新宿3丁目', sellerName: '佐々木 恵', buyerName: '合同会社KS投資', brokerName: '東京中央不動産株式会社', status: 'seller_contacted', amount: 2100, createdAt: '2026-04-10', updatedAt: '2026-04-13' },
]

export const mockProfessionals: Professional[] = [
  { id: 'p1', name: '山田 太郎', qualification: '税理士', officeName: '山田税理士事務所', registrationNumber: '第12345号', email: 'yamada@example.com', phone: '03-1234-5678', verificationStatus: 'verified', referralCount: 8, closedCount: 6, nwAffiliations: ['awaka cross'], createdAt: '2026-01-15' },
  { id: 'p2', name: '佐藤 花子', qualification: '司法書士', officeName: '佐藤法務事務所', registrationNumber: '第67890号', email: 'sato@example.com', phone: '03-9876-5432', verificationStatus: 'verified', referralCount: 5, closedCount: 3, nwAffiliations: ['awaka cross', 'UIコンサルティング'], createdAt: '2026-02-01' },
  { id: 'p3', name: '田中 一郎', qualification: '税理士', officeName: '田中会計事務所', registrationNumber: '第11111号', email: 'tanaka@example.com', phone: '03-1111-2222', verificationStatus: 'verified', referralCount: 4, closedCount: 2, nwAffiliations: ['ミツカル'], createdAt: '2026-02-20' },
  { id: 'p4', name: '鈴木 次郎', qualification: '司法書士', officeName: '鈴木司法書士事務所', registrationNumber: '第22222号', email: 'suzuki@example.com', phone: '03-3333-4444', verificationStatus: 'verified', referralCount: 3, closedCount: 2, nwAffiliations: [], createdAt: '2026-03-01' },
  { id: 'p5', name: '木村 美紀', qualification: '行政書士', officeName: '木村行政書士事務所', registrationNumber: '第33333号', email: 'kimura@example.com', phone: '03-5555-6666', verificationStatus: 'pending', referralCount: 0, closedCount: 0, nwAffiliations: ['awaka cross'], createdAt: '2026-04-10' },
]

export const mockBrokers: Broker[] = [
  { id: 'br1', companyName: '東京中央不動産株式会社', representativeName: '松本 大輝', licenseNumber: '東京都知事(3)第12345号', email: 'matsumoto@example.com', phone: '03-7777-8888', totalDeals: 15, averageRating: 4.2, createdAt: '2026-01-10' },
  { id: 'br2', companyName: '横浜南不動産株式会社', representativeName: '井上 翔', licenseNumber: '神奈川県知事(2)第67890号', email: 'inoue@example.com', phone: '045-1111-2222', totalDeals: 8, averageRating: 4.5, createdAt: '2026-01-20' },
  { id: 'br3', companyName: '城西ホーム株式会社', representativeName: '小川 真由', licenseNumber: '東京都知事(1)第11111号', email: 'ogawa@example.com', phone: '03-9999-0000', totalDeals: 3, averageRating: 3.8, createdAt: '2026-03-05' },
]

export const mockRevenue: Revenue[] = [
  { id: 'r1', propertyTitle: '大田区 商業地の一戸建て', salePrice: 3200, brokerageFee: 204, brokerAmount: 102, ouverAmount: 65.3, professionalAmount: 30.6, nwAmount: 6.1, isNwReferral: true, paymentStatus: 'paid', closedAt: '2026-03-25' },
  { id: 'r2', propertyTitle: '目黒区 一戸建て', salePrice: 6200, brokerageFee: 384, brokerAmount: 192, ouverAmount: 134.4, professionalAmount: 57.6, nwAmount: 0, isNwReferral: false, paymentStatus: 'invoiced', closedAt: '2026-04-10' },
  { id: 'r3', propertyTitle: '品川区 オフィスビル', salePrice: 8500, brokerageFee: 522, brokerAmount: 261, ouverAmount: 167.0, professionalAmount: 78.3, nwAmount: 15.7, isNwReferral: true, paymentStatus: 'unpaid', closedAt: '2026-04-15' },
]

export const mockUsers: User[] = [
  { id: 'u1', name: '中村 一郎', email: 'nakamura@example.com', role: 'seller', createdAt: '2026-03-01', lastLoginAt: '2026-04-15' },
  { id: 'u2', name: '小林 誠', email: 'kobayashi@example.com', role: 'seller', createdAt: '2026-03-10', lastLoginAt: '2026-04-14' },
  { id: 'u3', name: '加藤 裕子', email: 'kato@example.com', role: 'seller', createdAt: '2026-02-15', lastLoginAt: '2026-04-12' },
  { id: 'u10', name: '株式会社山本不動産', email: 'yamamoto@example.com', role: 'buyer', createdAt: '2026-01-20', lastLoginAt: '2026-04-16' },
  { id: 'u11', name: '高橋 健太', email: 'takahashi@example.com', role: 'buyer', createdAt: '2026-02-05', lastLoginAt: '2026-04-15' },
  { id: 'u12', name: '合同会社KS投資', email: 'ks-invest@example.com', role: 'buyer', createdAt: '2026-02-10', lastLoginAt: '2026-04-16' },
  { id: 'u20', name: '山田 太郎', email: 'yamada@example.com', role: 'professional', createdAt: '2026-01-15', lastLoginAt: '2026-04-15' },
  { id: 'u21', name: '佐藤 花子', email: 'sato@example.com', role: 'professional', createdAt: '2026-02-01', lastLoginAt: '2026-04-14' },
  { id: 'u30', name: '松本 大輝', email: 'matsumoto@example.com', role: 'broker', createdAt: '2026-01-10', lastLoginAt: '2026-04-16' },
]

export const mockNotifications: Notification[] = [
  { id: 'n1', message: '練馬区 駅近マンションに新しい入札がありました（3,700万円）', type: 'info', isRead: false, createdAt: '2026-04-15 14:30' },
  { id: 'n2', message: '杉並区 土地の入札期間が残り3日です', type: 'warning', isRead: false, createdAt: '2026-04-15 10:00' },
  { id: 'n3', message: '大田区 商業地の一戸建てが成約しました', type: 'success', isRead: true, createdAt: '2026-04-14 16:00' },
  { id: 'n4', message: '横浜市 マンションの書類審査が完了しました', type: 'info', isRead: true, createdAt: '2026-04-14 11:00' },
  { id: 'n5', message: '板橋区 マンションが即決価格に到達しました', type: 'warning', isRead: false, createdAt: '2026-04-13 09:00' },
]

export const mockCaseMessages: CaseMessage[] = [
  { id: 'm1', senderName: '松本 大輝', senderRole: '業者', content: '売主様との初回連絡を完了しました。来週月曜に現地確認の予定です。', createdAt: '2026-04-03 10:00' },
  { id: 'm2', senderName: 'Ouver運営', senderRole: '管理者', content: '承知しました。進捗があればこちらで共有をお願いします。', createdAt: '2026-04-03 11:30' },
  { id: 'm3', senderName: '松本 大輝', senderRole: '業者', content: '現地確認完了。買い手候補への内見日程を調整中です。', createdAt: '2026-04-07 15:00' },
  { id: 'm4', senderName: '松本 大輝', senderRole: '業者', content: '買い手（株式会社アーバン）との内見を4/10に実施予定です。', createdAt: '2026-04-08 09:00' },
]

export const mockDocuments: Document[] = [
  { id: 'd1', name: '登記事項証明書.pdf', type: '登記簿謄本', size: '2.4 MB', uploadedAt: '2026-04-10', status: 'approved' },
  { id: 'd2', name: '遺産分割協議書.pdf', type: '遺産分割協議書', size: '1.8 MB', uploadedAt: '2026-04-10', status: 'approved' },
  { id: 'd3', name: '本人確認書類.jpg', type: '本人確認書類', size: '850 KB', uploadedAt: '2026-04-10', status: 'approved' },
  { id: 'd4', name: '物件写真_外観.jpg', type: '物件写真', size: '3.2 MB', uploadedAt: '2026-04-10', status: 'approved' },
  { id: 'd5', name: '物件写真_内装1.jpg', type: '物件写真', size: '2.8 MB', uploadedAt: '2026-04-10', status: 'pending' },
  { id: 'd6', name: '固定資産税納税通知書.pdf', type: '固定資産税納税通知書', size: '1.2 MB', uploadedAt: '2026-04-11', status: 'pending' },
]

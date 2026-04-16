import 'dotenv/config'
import { getDb } from './client'
import { getAuth } from '../lib/auth'
import {
  users, sellerProfiles, buyerProfiles,
  professionals, nwCompanies, professionalNwAffiliations,
  brokers,
  properties, propertyDocuments,
  bids,
  cases, caseMessages,
  revenueDistributions, payments,
  notifications, notificationSettings,
  helpArticles, blogPosts,
  supportTickets, supportMessages,
  authUser,
} from './schema'
import { eq } from 'drizzle-orm'

// 固定UUID（シード間の参照整合性のため）
const ID = {
  // ユーザー
  u1: '00000000-0000-4000-a000-000000000001',
  u2: '00000000-0000-4000-a000-000000000002',
  u3: '00000000-0000-4000-a000-000000000003',
  u10: '00000000-0000-4000-a000-000000000010',
  u11: '00000000-0000-4000-a000-000000000011',
  u12: '00000000-0000-4000-a000-000000000012',
  u13: '00000000-0000-4000-a000-000000000013',
  u14: '00000000-0000-4000-a000-000000000014',
  u15: '00000000-0000-4000-a000-000000000015',
  u16: '00000000-0000-4000-a000-000000000016',
  u20: '00000000-0000-4000-a000-000000000020',
  u21: '00000000-0000-4000-a000-000000000021',
  u30: '00000000-0000-4000-a000-000000000030',
  u31: '00000000-0000-4000-a000-000000000031',
  u99: '00000000-0000-4000-a000-000000000099',
  // 士業
  p1: '00000000-0000-4000-b000-000000000001',
  p2: '00000000-0000-4000-b000-000000000002',
  p3: '00000000-0000-4000-b000-000000000003',
  // 業者
  br1: '00000000-0000-4000-c000-000000000001',
  br2: '00000000-0000-4000-c000-000000000002',
  // NW
  nw1: '00000000-0000-4000-d000-000000000001',
  nw2: '00000000-0000-4000-d000-000000000002',
  nw3: '00000000-0000-4000-d000-000000000003',
  // 物件
  prop1: '00000000-0000-4000-e000-000000000001',
  prop2: '00000000-0000-4000-e000-000000000002',
  prop3: '00000000-0000-4000-e000-000000000003',
  prop4: '00000000-0000-4000-e000-000000000004',
  prop5: '00000000-0000-4000-e000-000000000005',
  prop6: '00000000-0000-4000-e000-000000000006',
  prop7: '00000000-0000-4000-e000-000000000007',
  prop8: '00000000-0000-4000-e000-000000000008',
  // 案件
  case1: '00000000-0000-4000-f000-000000000001',
  case2: '00000000-0000-4000-f000-000000000002',
  case3: '00000000-0000-4000-f000-000000000003',
  case4: '00000000-0000-4000-f000-000000000004',
} as const

const DEV_PASSWORD = 'password123'

// BetterAuthでユーザーを作成
const createAuthUser = async (auth: ReturnType<typeof getAuth>, params: {
  email: string
  name: string
  role: string
}) => {
  const result = await auth.api.signUpEmail({
    body: {
      email: params.email,
      password: DEV_PASSWORD,
      name: params.name,
    },
  })
  if (!result?.user?.id) {
    throw new Error(`ユーザー作成失敗: ${params.email}`)
  }
  // roleを更新（BetterAuthのデフォルトはbuyer）
  const db = getDb()
  await db.update(authUser)
    .set({ role: params.role })
    .where(eq(authUser.id, result.user.id))
  return result.user.id
}

const seed = async () => {
  const db = getDb()
  const auth = getAuth()

  console.log('シードデータ投入開始...')

  // ==============================
  // 1. BetterAuthユーザー作成
  // ==============================
  console.log('1/10 BetterAuthユーザー作成...')
  const authUsers = [
    { email: 'nakamura@example.com', name: '中村 一郎', role: 'seller' },
    { email: 'yamamoto@example.com', name: '株式会社山本不動産', role: 'buyer' },
    { email: 'yamada@example.com', name: '山田 太郎', role: 'professional' },
    { email: 'matsumoto@example.com', name: '松本 大輝', role: 'broker' },
    { email: 'admin@ouver.jp', name: '田中 太郎', role: 'admin' },
  ]

  const authIdMap: Record<string, string> = {}
  for (const u of authUsers) {
    authIdMap[u.email] = await createAuthUser(auth, u)
  }

  // ==============================
  // 2. アプリケーションユーザー
  // ==============================
  console.log('2/10 ユーザーレコード作成...')
  const userRecords = [
    { id: ID.u1, authId: authIdMap['nakamura@example.com'], role: 'seller' as const, email: 'nakamura@example.com', name: '中村 一郎', phone: '03-1234-5678' },
    { id: ID.u2, authId: null, role: 'seller' as const, email: 'kobayashi@example.com', name: '小林 誠', phone: '03-2345-6789' },
    { id: ID.u3, authId: null, role: 'seller' as const, email: 'kato@example.com', name: '加藤 裕子', phone: '03-3456-7890' },
    { id: ID.u10, authId: authIdMap['yamamoto@example.com'], role: 'buyer' as const, email: 'yamamoto@example.com', name: '株式会社山本不動産', phone: '03-9876-5432' },
    { id: ID.u11, authId: null, role: 'buyer' as const, email: 'takahashi@example.com', name: '高橋 健太', phone: '03-4567-8901' },
    { id: ID.u12, authId: null, role: 'buyer' as const, email: 'ks-invest@example.com', name: '合同会社KS投資', phone: '03-5678-9012' },
    { id: ID.u13, authId: null, role: 'buyer' as const, email: 'watanabe@example.com', name: '渡辺 美咲', phone: '03-6789-0123' },
    { id: ID.u14, authId: null, role: 'buyer' as const, email: 'takara@example.com', name: '株式会社タカラ建設', phone: '03-7890-1234' },
    { id: ID.u15, authId: null, role: 'buyer' as const, email: 'suzuki-d@example.com', name: '鈴木 大輔', phone: '03-8901-2345' },
    { id: ID.u16, authId: null, role: 'buyer' as const, email: 'urban@example.com', name: '株式会社アーバン', phone: '03-9012-3456' },
    { id: ID.u20, authId: authIdMap['yamada@example.com'], role: 'professional' as const, email: 'yamada@example.com', name: '山田 太郎', phone: '03-1234-5678' },
    { id: ID.u21, authId: null, role: 'professional' as const, email: 'sato@example.com', name: '佐藤 花子', phone: '03-9876-5432' },
    { id: ID.u30, authId: authIdMap['matsumoto@example.com'], role: 'broker' as const, email: 'matsumoto@example.com', name: '松本 大輝', phone: '03-7777-8888' },
    { id: ID.u31, authId: null, role: 'broker' as const, email: 'inoue@example.com', name: '井上 翔', phone: '045-1111-2222' },
    { id: ID.u99, authId: authIdMap['admin@ouver.jp'], role: 'admin' as const, email: 'admin@ouver.jp', name: '田中 太郎', phone: '03-0000-0000' },
  ]
  await db.insert(users).values(userRecords)

  // 売主プロフィール
  await db.insert(sellerProfiles).values([
    { userId: ID.u1, referralCode: 'SELLER001', referredByProfessionalId: ID.p1 },
    { userId: ID.u2, referralCode: 'SELLER002', referredByProfessionalId: ID.p1 },
    { userId: ID.u3, referralCode: 'SELLER003' },
  ])

  // 買い手プロフィール
  await db.insert(buyerProfiles).values([
    { userId: ID.u10, buyerType: 'real_estate_company', companyName: '株式会社山本不動産' },
    { userId: ID.u11, buyerType: 'individual' },
    { userId: ID.u12, buyerType: 'investor', companyName: '合同会社KS投資' },
    { userId: ID.u13, buyerType: 'individual' },
    { userId: ID.u14, buyerType: 'real_estate_company', companyName: '株式会社タカラ建設' },
    { userId: ID.u15, buyerType: 'individual' },
    { userId: ID.u16, buyerType: 'real_estate_company', companyName: '株式会社アーバン' },
  ])

  // ==============================
  // 3. NW会社 + 士業 + 業者
  // ==============================
  console.log('3/10 NW会社・士業・業者作成...')
  await db.insert(nwCompanies).values([
    { id: ID.nw1, name: 'awaka cross', contactEmail: 'info@awakacross.jp', contactPhone: '03-1000-1000' },
    { id: ID.nw2, name: 'UIコンサルティング', contactEmail: 'info@ui-consulting.jp', contactPhone: '03-2000-2000' },
    { id: ID.nw3, name: 'ミツカル', contactEmail: 'info@mitsukaru.jp', contactPhone: '03-3000-3000' },
  ])

  const bankDefaults = {
    bankName: 'みずほ銀行',
    bankBranch: '東京営業部',
    bankAccountType: '普通',
    bankAccountNumber: '1234567',
  }

  await db.insert(professionals).values([
    {
      id: ID.p1, userId: ID.u20, qualificationType: 'tax_accountant',
      registrationNumber: '第12345号', verificationStatus: 'manually_verified',
      employmentType: 'sole_proprietor', officeName: '山田税理士事務所',
      officeAddress: '東京都千代田区丸の内1-1-1', officePhone: '03-1234-5678',
      referralCode: 'YAMADA001', paymentRecipient: 'self', paymentRecipientName: '山田 太郎',
      ...bankDefaults,
    },
    {
      id: ID.p2, userId: ID.u21, qualificationType: 'judicial_scrivener',
      registrationNumber: '第67890号', verificationStatus: 'manually_verified',
      employmentType: 'sole_proprietor', officeName: '佐藤法務事務所',
      officeAddress: '東京都新宿区西新宿2-8-1', officePhone: '03-9876-5432',
      referralCode: 'SATO001', paymentRecipient: 'self', paymentRecipientName: '佐藤 花子',
      ...bankDefaults, bankBranch: '新宿支店',
    },
    {
      id: ID.p3, userId: ID.u1, qualificationType: 'tax_accountant',
      registrationNumber: '第11111号', verificationStatus: 'manually_verified',
      employmentType: 'sole_proprietor', officeName: '田中会計事務所',
      officeAddress: '東京都渋谷区渋谷1-1-1', officePhone: '03-1111-2222',
      referralCode: 'TANAKA001', paymentRecipient: 'self', paymentRecipientName: '田中 一郎',
      ...bankDefaults, bankBranch: '渋谷支店',
    },
  ])

  await db.insert(professionalNwAffiliations).values([
    { professionalId: ID.p1, nwCompanyId: ID.nw1 },
    { professionalId: ID.p2, nwCompanyId: ID.nw1 },
    { professionalId: ID.p2, nwCompanyId: ID.nw2 },
  ])

  await db.insert(brokers).values([
    {
      id: ID.br1, userId: ID.u30, companyName: '東京中央不動産株式会社',
      representativeName: '松本 大輝', address: '東京都中央区日本橋1-1-1',
      licenseNumber: '東京都知事(3)第12345号', contactPersonName: '松本 大輝',
      ...bankDefaults, totalDeals: 15,
    },
    {
      id: ID.br2, userId: ID.u31, companyName: '横浜南不動産株式会社',
      representativeName: '井上 翔', address: '神奈川県横浜市中区本町1-1-1',
      licenseNumber: '神奈川県知事(2)第67890号', contactPersonName: '井上 翔',
      ...bankDefaults, bankName: '三井住友銀行', bankBranch: '横浜支店', totalDeals: 8,
    },
  ])

  // ==============================
  // 4. 物件（8件）
  // ==============================
  console.log('4/10 物件作成...')
  await db.insert(properties).values([
    {
      id: ID.prop1, sellerId: ID.u1, referringProfessionalId: ID.p1,
      referralNwCompanyId: ID.nw1, referralChannel: 'nw', assignedBrokerId: ID.br1,
      status: 'bidding', propertyType: 'apartment',
      title: '練馬区 駅近マンション 3LDK', description: '西武池袋線練馬駅徒歩5分。スーパー・コンビニ徒歩圏内。日当たり良好な南向き3LDK。',
      prefecture: '東京都', city: '練馬区', address: '東京都練馬区豊玉北5丁目',
      nearestStation: '練馬駅', walkMinutes: 5,
      landArea: 725, buildingArea: 725, builtYear: 2003,
      askingPrice: 35000000, urgency: 'three_months',
      isRegistrationComplete: true,
      bidStartAt: new Date('2026-04-10'), bidEndAt: new Date('2026-04-20'),
      publishedAt: new Date('2026-04-10'), createdAt: new Date('2026-04-10'),
    },
    {
      id: ID.prop2, sellerId: ID.u1, referringProfessionalId: ID.p1,
      referralNwCompanyId: ID.nw1, referralChannel: 'nw', assignedBrokerId: ID.br1,
      status: 'bidding', propertyType: 'land',
      title: '杉並区 閑静な住宅地の土地', description: 'JR中央線荻窪駅徒歩12分。第一種低層住居専用地域。建築条件なし。',
      prefecture: '東京都', city: '杉並区', address: '東京都杉並区荻窪3丁目',
      nearestStation: '荻窪駅', walkMinutes: 12,
      landArea: 1205,
      askingPrice: 42000000, urgency: 'urgent',
      isRegistrationComplete: true,
      bidStartAt: new Date('2026-04-08'), bidEndAt: new Date('2026-04-18'),
      publishedAt: new Date('2026-04-08'), createdAt: new Date('2026-04-08'),
    },
    {
      id: ID.prop3, sellerId: ID.u2, referringProfessionalId: ID.p2,
      referralChannel: 'direct', assignedBrokerId: ID.br1,
      status: 'bidding', propertyType: 'house',
      title: '世田谷区 二世帯住宅', description: '小田急線千歳船橋駅徒歩8分。1階・2階分離型の二世帯住宅。駐車場2台分あり。',
      prefecture: '東京都', city: '世田谷区', address: '東京都世田谷区桜丘4丁目',
      nearestStation: '千歳船橋駅', walkMinutes: 8,
      landArea: 1802, buildingArea: 1458, builtYear: 1998,
      askingPrice: 58000000, urgency: 'three_months',
      isRegistrationComplete: true,
      bidStartAt: new Date('2026-04-05'), bidEndAt: new Date('2026-04-25'),
      publishedAt: new Date('2026-04-05'), createdAt: new Date('2026-04-05'),
    },
    {
      id: ID.prop4, sellerId: ID.u3,
      status: 'published', propertyType: 'apartment',
      title: '横浜市青葉区 駅徒歩3分マンション', description: '東急田園都市線たまプラーザ駅徒歩3分。ペット可。管理体制良好。',
      prefecture: '神奈川県', city: '横浜市青葉区', address: '神奈川県横浜市青葉区美しが丘2丁目',
      nearestStation: 'たまプラーザ駅', walkMinutes: 3,
      landArea: 653, buildingArea: 653, builtYear: 2008,
      askingPrice: 28000000, urgency: 'one_year',
      isRegistrationComplete: false,
      publishedAt: new Date('2026-04-12'), createdAt: new Date('2026-04-12'),
    },
    {
      id: ID.prop5, sellerId: ID.u1, referringProfessionalId: ID.p1,
      referralNwCompanyId: ID.nw1, referralChannel: 'nw', assignedBrokerId: ID.br1,
      status: 'closed', propertyType: 'house',
      title: '大田区 商業地の一戸建て', description: 'JR蒲田駅徒歩7分。商業地域。店舗兼住宅としても利用可能。',
      prefecture: '東京都', city: '大田区', address: '東京都大田区蒲田5丁目',
      nearestStation: '蒲田駅', walkMinutes: 7,
      landArea: 950, buildingArea: 1105, builtYear: 1985,
      askingPrice: 32000000, urgency: 'urgent',
      isRegistrationComplete: true,
      closedAt: new Date('2026-03-25'), publishedAt: new Date('2026-03-20'), createdAt: new Date('2026-03-20'),
    },
    {
      id: ID.prop6, sellerId: ID.u2, assignedBrokerId: ID.br2,
      status: 'bidding', propertyType: 'apartment',
      title: '板橋区 リノベ向きマンション', description: '東武東上線成増駅徒歩6分。リノベーション向き。管理費・修繕積立金安め。',
      prefecture: '東京都', city: '板橋区', address: '東京都板橋区成増3丁目',
      nearestStation: '成増駅', walkMinutes: 6,
      landArea: 550, buildingArea: 550, builtYear: 1990,
      askingPrice: 18000000, urgency: 'three_months',
      isRegistrationComplete: true,
      bidStartAt: new Date('2026-04-01'), bidEndAt: new Date('2026-04-21'),
      publishedAt: new Date('2026-04-01'), createdAt: new Date('2026-04-01'),
    },
    {
      id: ID.prop7, sellerId: ID.u3, assignedBrokerId: ID.br1,
      status: 'pending_approval', propertyType: 'house',
      title: '川崎市 大型一戸建て', description: '東急田園都市線鷺沼駅バス10分。閑静な住宅街。庭付き。',
      prefecture: '神奈川県', city: '川崎市宮前区', address: '神奈川県川崎市宮前区有馬6丁目',
      nearestStation: '鷺沼駅', walkMinutes: 15,
      landArea: 2000, buildingArea: 1600, builtYear: 2001,
      askingPrice: 45000000, urgency: 'three_months',
      isRegistrationComplete: true,
      publishedAt: new Date('2026-03-28'), createdAt: new Date('2026-03-28'),
    },
    {
      id: ID.prop8, sellerId: ID.u1, assignedBrokerId: ID.br1,
      status: 'bidding', propertyType: 'apartment',
      title: '中野区 駅近ワンルーム投資用', description: 'JR中野駅徒歩4分。現在賃貸中（利回り5.2%）。オーナーチェンジ。',
      prefecture: '東京都', city: '中野区', address: '東京都中野区中野5丁目',
      nearestStation: '中野駅', walkMinutes: 4,
      landArea: 255, buildingArea: 255, builtYear: 2010,
      askingPrice: 15000000, urgency: 'undecided',
      isRegistrationComplete: true,
      bidStartAt: new Date('2026-04-14'), bidEndAt: new Date('2026-04-28'),
      publishedAt: new Date('2026-04-14'), createdAt: new Date('2026-04-14'),
    },
  ])

  // ==============================
  // 5. 書類
  // ==============================
  console.log('5/10 書類作成...')
  await db.insert(propertyDocuments).values([
    { propertyId: ID.prop1, documentType: 'registry_certificate', fileName: '登記事項証明書.pdf', fileUrl: `properties/${ID.prop1}/registry_certificate/登記事項証明書.pdf`, uploadedBy: ID.u1 },
    { propertyId: ID.prop1, documentType: 'inheritance_agreement', fileName: '遺産分割協議書.pdf', fileUrl: `properties/${ID.prop1}/inheritance_agreement/遺産分割協議書.pdf`, uploadedBy: ID.u1 },
    { propertyId: ID.prop1, documentType: 'identity_document', fileName: '本人確認書類.jpg', fileUrl: `properties/${ID.prop1}/identity_document/本人確認書類.jpg`, uploadedBy: ID.u1 },
    { propertyId: ID.prop1, documentType: 'property_photo', fileName: '物件写真_外観.jpg', fileUrl: `properties/${ID.prop1}/property_photo/物件写真_外観.jpg`, uploadedBy: ID.u1 },
    { propertyId: ID.prop2, documentType: 'registry_certificate', fileName: '登記事項証明書.pdf', fileUrl: `properties/${ID.prop2}/registry_certificate/登記事項証明書.pdf`, uploadedBy: ID.u1 },
  ])

  // ==============================
  // 6. 入札（8件）
  // ==============================
  console.log('6/10 入札作成...')
  await db.insert(bids).values([
    { propertyId: ID.prop1, buyerId: ID.u10, amount: 36000000, status: 'active', createdAt: new Date('2026-04-14') },
    { propertyId: ID.prop1, buyerId: ID.u11, amount: 35500000, status: 'active', createdAt: new Date('2026-04-13') },
    { propertyId: ID.prop1, buyerId: ID.u12, amount: 37000000, status: 'active', createdAt: new Date('2026-04-12') },
    { propertyId: ID.prop2, buyerId: ID.u13, amount: 43000000, status: 'active', createdAt: new Date('2026-04-11') },
    { propertyId: ID.prop2, buyerId: ID.u14, amount: 45000000, status: 'active', createdAt: new Date('2026-04-10') },
    { propertyId: ID.prop6, buyerId: ID.u15, amount: 19000000, status: 'active', createdAt: new Date('2026-04-13') },
    { propertyId: ID.prop3, buyerId: ID.u10, amount: 59000000, status: 'active', createdAt: new Date('2026-04-09') },
    { propertyId: ID.prop5, buyerId: ID.u16, amount: 34000000, status: 'selected', createdAt: new Date('2026-03-25') },
  ])

  // ==============================
  // 7. 案件（4件）
  // ==============================
  console.log('7/10 案件作成...')
  await db.insert(cases).values([
    { id: ID.case1, propertyId: ID.prop5, brokerId: ID.br1, buyerId: ID.u16, sellerId: ID.u1, status: 'contract_signed', createdAt: new Date('2026-04-02') },
    { id: ID.case2, propertyId: ID.prop1, brokerId: ID.br1, buyerId: ID.u10, sellerId: ID.u2, status: 'buyer_contacted', createdAt: new Date('2026-04-05') },
    { id: ID.case3, propertyId: ID.prop3, brokerId: ID.br2, buyerId: ID.u11, sellerId: ID.u3, status: 'settlement_done', createdAt: new Date('2026-03-15') },
    { id: ID.case4, propertyId: ID.prop8, brokerId: ID.br1, buyerId: ID.u12, sellerId: ID.u1, status: 'seller_contacted', createdAt: new Date('2026-04-10') },
  ])

  // 案件メッセージ
  await db.insert(caseMessages).values([
    { caseId: ID.case1, senderId: ID.u30, body: '売主様との初回連絡を完了しました。来週月曜に現地確認の予定です。', createdAt: new Date('2026-04-03T10:00:00') },
    { caseId: ID.case1, senderId: ID.u99, body: '承知しました。進捗があればこちらで共有をお願いします。', createdAt: new Date('2026-04-03T11:30:00') },
    { caseId: ID.case1, senderId: ID.u30, body: '現地確認完了。買い手候補への内見日程を調整中です。', createdAt: new Date('2026-04-07T15:00:00') },
    { caseId: ID.case1, senderId: ID.u30, body: '買い手（株式会社アーバン）との内見を4/10に実施予定です。', createdAt: new Date('2026-04-08T09:00:00') },
  ])

  // ==============================
  // 8. 収益配分 + 支払い
  // ==============================
  console.log('8/10 収益配分・支払い作成...')
  const revId1 = '00000000-0000-4000-f100-000000000001'
  const revId2 = '00000000-0000-4000-f100-000000000002'
  const revId3 = '00000000-0000-4000-f100-000000000003'

  await db.insert(revenueDistributions).values([
    {
      id: revId1, caseId: ID.case1, propertyId: ID.prop5,
      salePrice: 32000000, brokerageFee: 2040000, brokerageFeeWithTax: 2244000,
      brokerAmount: 1020000, ouverAmount: 652800, professionalAmount: 306000, nwAmount: 61200,
      brokerRate: '0.5000', ouverRate: '0.3200', professionalRate: '0.1500', nwRate: '0.0300',
      brokerId: ID.br1, professionalId: ID.p1, nwCompanyId: ID.nw1, isNwReferral: 'nw',
    },
    {
      id: revId2, caseId: ID.case3, propertyId: ID.prop3,
      salePrice: 62000000, brokerageFee: 3840000, brokerageFeeWithTax: 4224000,
      brokerAmount: 1920000, ouverAmount: 1344000, professionalAmount: 576000, nwAmount: 0,
      brokerRate: '0.5000', ouverRate: '0.3500', professionalRate: '0.1500', nwRate: '0.0000',
      brokerId: ID.br2, professionalId: ID.p2, isNwReferral: 'direct',
    },
  ])

  await db.insert(payments).values([
    { revenueDistributionId: revId1, payeeType: 'broker', payeeId: ID.br1, amount: 1020000, status: 'confirmed', confirmedAt: new Date('2026-04-05') },
    { revenueDistributionId: revId1, payeeType: 'professional', payeeId: ID.p1, amount: 306000, status: 'confirmed', confirmedAt: new Date('2026-04-05') },
    { revenueDistributionId: revId1, payeeType: 'nw', payeeId: ID.nw1, amount: 61200, status: 'invoiced', invoicedAt: new Date('2026-04-10') },
    { revenueDistributionId: revId2, payeeType: 'broker', payeeId: ID.br2, amount: 1920000, status: 'invoiced', invoicedAt: new Date('2026-04-12') },
    { revenueDistributionId: revId2, payeeType: 'professional', payeeId: ID.p2, amount: 576000, status: 'not_invoiced' },
  ])

  // ==============================
  // 9. 通知
  // ==============================
  console.log('9/10 通知作成...')
  await db.insert(notifications).values([
    { userId: ID.u1, event: 'new_bid', channel: 'system', title: '新しい入札', body: '練馬区 駅近マンションに新しい入札がありました（3,700万円）', relatedEntityType: 'property', relatedEntityId: ID.prop1, isRead: false },
    { userId: ID.u1, event: 'bid_deadline', channel: 'system', title: '入札期限間近', body: '杉並区 土地の入札期間が残り3日です', relatedEntityType: 'property', relatedEntityId: ID.prop2, isRead: false },
    { userId: ID.u1, event: 'property_closed', channel: 'system', title: '成約完了', body: '大田区 商業地の一戸建てが成約しました', relatedEntityType: 'property', relatedEntityId: ID.prop5, isRead: true },
    { userId: ID.u10, event: 'bid_accepted', channel: 'system', title: '入札状況', body: '世田谷区 二世帯住宅への入札が受理されました', relatedEntityType: 'property', relatedEntityId: ID.prop3, isRead: false },
    { userId: ID.u20, event: 'referral_success', channel: 'system', title: '紹介成約', body: '紹介した物件が成約しました。報酬が確定しています。', relatedEntityType: 'case', relatedEntityId: ID.case1, isRead: false },
    { userId: ID.u30, event: 'case_assigned', channel: 'system', title: '新規案件', body: '新しい案件が割り当てられました', relatedEntityType: 'case', relatedEntityId: ID.case4, isRead: false },
    { userId: ID.u99, event: 'new_property', channel: 'system', title: '物件審査依頼', body: '新しい物件が登録されました。審査をお願いします。', relatedEntityType: 'property', relatedEntityId: ID.prop4, isRead: false },
  ])

  // 通知設定
  const settingUsers = [ID.u1, ID.u10, ID.u20, ID.u30, ID.u99]
  await db.insert(notificationSettings).values(
    settingUsers.map((userId) => ({ userId, emailEnabled: true, systemEnabled: true }))
  )

  // ==============================
  // 10. コンテンツ + サポート
  // ==============================
  console.log('10/10 コンテンツ・サポート作成...')
  await db.insert(helpArticles).values([
    { slug: 'getting-started', title: 'はじめての方へ', category: 'getting_started', body: 'Ouverは相続不動産の売却を支援するプラットフォームです。入札方式により、短期間での売却が可能です。', sortOrder: 1, isPublished: true },
    { slug: 'how-to-list', title: '物件を掲載するには', category: 'listing', body: '物件の掲載は無料です。必要書類（登記事項証明書、遺産分割協議書等）を準備の上、物件情報を入力してください。', sortOrder: 2, isPublished: true },
    { slug: 'bidding-guide', title: '入札の流れ', category: 'bidding', body: '入札期間中に希望金額を提示してください。入札期間終了後、売主が入札者を選択します。', sortOrder: 3, isPublished: true },
    { slug: 'document-upload', title: '書類のアップロード方法', category: 'documents', body: '物件詳細ページの「書類」タブから、必要書類をアップロードできます。対応形式: PDF, JPG, PNG', sortOrder: 4, isPublished: true },
    { slug: 'payment-flow', title: '支払いの流れ', category: 'payment', body: '成約後、提携宅建業者を通じて決済を行います。仲介手数料は成約時のみ発生します。', sortOrder: 5, isPublished: true },
    { slug: 'case-management', title: '案件管理について', category: 'cases', body: '成約後は案件ページで進捗を確認できます。重要事項説明、契約締結、決済の各ステップが表示されます。', sortOrder: 6, isPublished: true },
  ])

  await db.insert(blogPosts).values([
    { slug: 'launch-announcement', title: 'Ouverサービス開始のお知らせ', excerpt: '相続不動産に特化した入札プラットフォーム「Ouver」のサービスを開始しました。', body: '株式会社Ouverは、相続で取得した不動産の売却をサポートする入札プラットフォーム「Ouver」のサービスを開始しました。', category: 'news', authorName: '株式会社Ouver', authorRole: '運営チーム', readingMinutes: 3, isPublished: true, publishedAt: new Date('2026-04-01') },
    { slug: 'inheritance-tax-guide', title: '相続不動産の売却と税金の基礎知識', excerpt: '相続で取得した不動産を売却する際の税金について解説します。', body: '相続で取得した不動産を売却する場合、譲渡所得税が課税されます。取得費の特例や小規模宅地等の特例について解説します。', category: 'column', authorName: '山田 太郎', authorRole: '税理士', readingMinutes: 8, isPublished: true, publishedAt: new Date('2026-04-05') },
    { slug: 'case-study-nerima', title: '【活用事例】練馬区マンション、入札開始3日で5件の入札', excerpt: '練馬区のマンションが入札開始わずか3日で5件の入札を集めた事例を紹介します。', body: '入札方式の強みが最も発揮された事例です。従来の不動産売却では数ヶ月かかるところ、わずか数日で複数の購入希望者が集まりました。', category: 'case_study', authorName: '株式会社Ouver', authorRole: '運営チーム', readingMinutes: 5, isPublished: true, publishedAt: new Date('2026-04-10') },
    { slug: 'version-update-april', title: '2026年4月のアップデート情報', excerpt: '入札機能の改善、士業ダッシュボードの追加など、4月のアップデート内容をお知らせします。', body: '4月のアップデートでは、入札画面のUI改善、士業向けダッシュボードの追加、通知機能の拡充を行いました。', category: 'update', authorName: '株式会社Ouver', authorRole: '開発チーム', readingMinutes: 4, isPublished: true, publishedAt: new Date('2026-04-15') },
  ])

  await db.insert(supportTickets).values([
    { id: '00000000-0000-4000-f200-000000000001', userId: ID.u1, email: 'nakamura@example.com', name: '中村 一郎', category: 'property', subject: '物件写真の差し替えについて', status: 'resolved' },
    { id: '00000000-0000-4000-f200-000000000002', userId: ID.u10, email: 'yamamoto@example.com', name: '株式会社山本不動産', category: 'bidding', subject: '入札金額の変更方法', status: 'open' },
    { id: '00000000-0000-4000-f200-000000000003', userId: null, email: 'guest@example.com', name: 'ゲスト', category: 'general', subject: 'サービスの利用料金について', status: 'closed' },
  ])

  await db.insert(supportMessages).values([
    { ticketId: '00000000-0000-4000-f200-000000000001', senderId: ID.u1, senderName: '中村 一郎', body: '掲載中の物件写真を差し替えたいのですが、どうすればよいですか？', isStaffReply: false },
    { ticketId: '00000000-0000-4000-f200-000000000001', senderId: ID.u99, senderName: 'Ouverサポート', body: '物件詳細ページの「書類」タブから写真を削除し、新しい写真をアップロードしてください。', isStaffReply: true },
    { ticketId: '00000000-0000-4000-f200-000000000002', senderId: ID.u10, senderName: '株式会社山本不動産', body: '入札済みの金額を増額したいのですが可能でしょうか？', isStaffReply: false },
  ])

  console.log('シードデータ投入完了')
  process.exit(0)
}

seed().catch((err) => {
  console.error('シード失敗:', err)
  process.exit(1)
})

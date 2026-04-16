import { eq, and, isNull } from 'drizzle-orm'
import type { Database } from '../db/client'
import { professionals, professionalHistory, professionalNwAffiliations, nwCompanies } from '../db/schema/professionals'
import type { RegisterProfessionalInput, UpdateProfessionalInput } from '../schemas/professional'
import { notFound } from '../lib/errors'
import { v4 as uuidv4 } from 'uuid'

// 変更履歴を記録する対象フィールド
const TRACKED_FIELDS = ['officeName', 'officeAddress', 'employmentType', 'paymentRecipient', 'paymentRecipientName', 'bankName', 'bankBranch', 'bankAccountType', 'bankAccountNumber'] as const

export const createProfessionalService = (db: Database) => ({
  // 士業一覧
  async list() {
    return db.select().from(professionals)
  },

  // 士業詳細
  async getById(id: string) {
    const result = await db.select().from(professionals).where(eq(professionals.id, id)).limit(1)
    if (result.length === 0) {
      throw notFound('士業')
    }
    return result[0]
  },

  // ユーザーIDから士業情報を取得
  async getByUserId(userId: string) {
    const result = await db.select().from(professionals).where(eq(professionals.userId, userId)).limit(1)
    if (result.length === 0) {
      throw notFound('士業')
    }
    return result[0]
  },

  // 士業登録
  async register(input: RegisterProfessionalInput, userId: string) {
    const referralCode = `PRO_${uuidv4().slice(0, 8).toUpperCase()}`

    const { nwCompanyIds, ...professionalData } = input

    const result = await db.insert(professionals).values({
      ...professionalData,
      userId,
      referralCode,
    }).returning()

    const professional = result[0]

    // NW所属を登録
    if (nwCompanyIds && nwCompanyIds.length > 0) {
      await db.insert(professionalNwAffiliations).values(
        nwCompanyIds.map((nwId) => ({
          professionalId: professional.id,
          nwCompanyId: nwId,
        })),
      )
    }

    return professional
  },

  // 士業情報更新（変更履歴を記録）
  async update(id: string, input: UpdateProfessionalInput, changedBy: string) {
    const existing = await this.getById(id)

    // 変更履歴を記録
    const historyRecords = TRACKED_FIELDS
      .filter((field) => input[field] !== undefined && input[field] !== existing[field])
      .map((field) => ({
        professionalId: id,
        fieldName: field,
        oldValue: String(existing[field] ?? ''),
        newValue: String(input[field] ?? ''),
        changedBy,
      }))

    if (historyRecords.length > 0) {
      await db.insert(professionalHistory).values(historyRecords)
    }

    const { nwCompanyIds, ...updateData } = input

    const result = await db.update(professionals)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(professionals.id, id))
      .returning()

    return result[0]
  },

  // NW所属一覧
  async getNwAffiliations(professionalId: string) {
    return db.select({
      affiliation: professionalNwAffiliations,
      nwCompany: nwCompanies,
    })
      .from(professionalNwAffiliations)
      .innerJoin(nwCompanies, eq(professionalNwAffiliations.nwCompanyId, nwCompanies.id))
      .where(and(
        eq(professionalNwAffiliations.professionalId, professionalId),
        isNull(professionalNwAffiliations.leftAt),
      ))
  },

  // NW脱退
  async leaveNw(professionalId: string, nwCompanyId: string) {
    await db.update(professionalNwAffiliations)
      .set({ leftAt: new Date() })
      .where(and(
        eq(professionalNwAffiliations.professionalId, professionalId),
        eq(professionalNwAffiliations.nwCompanyId, nwCompanyId),
        isNull(professionalNwAffiliations.leftAt),
      ))
  },

  // 変更履歴取得
  async getHistory(professionalId: string) {
    return db.select()
      .from(professionalHistory)
      .where(eq(professionalHistory.professionalId, professionalId))
      .orderBy(professionalHistory.changedAt)
  },

  // 認証ステータス更新
  async updateVerificationStatus(id: string, status: typeof professionals.verificationStatus.enumValues[number]) {
    const result = await db.update(professionals)
      .set({ verificationStatus: status, updatedAt: new Date() })
      .where(eq(professionals.id, id))
      .returning()

    if (result.length === 0) {
      throw notFound('士業')
    }
    return result[0]
  },
})

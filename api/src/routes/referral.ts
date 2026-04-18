import { Hono } from 'hono'
import { auth, requireRole } from '../middleware/auth'
import { validateBody, validateQuery } from '../middleware/validate'
import { validateUuidParam } from '../middleware/param-validator'
import { createReferralLinkSchema, referralQuerySchema, linkReferralSchema, proxyClientCreateSchema } from '../schemas/referral'
import type { CreateReferralLinkInput, ReferralQuery, LinkReferralInput, ProxyClientCreateInput } from '../schemas/referral'
import { services } from '../lib/services'
import { ok, created, paginated } from '../lib/response'

export const referralRoutes = new Hono()

// 紹介リンク一覧
referralRoutes.get('/me', auth, requireRole('professional'), validateQuery(referralQuerySchema), async (c) => {
  const user = c.get('user')
  const query = c.get('validatedQuery') as ReferralQuery
  const professional = await services.professional.getByUserId(user.id)
  const result = await services.referral.listLinks(professional.id, query)
  return paginated(c, result)
})

// 紹介リンク作成
referralRoutes.post('/me', auth, requireRole('professional'), validateBody(createReferralLinkSchema), async (c) => {
  const user = c.get('user')
  const input = c.get('validatedBody') as CreateReferralLinkInput
  const professional = await services.professional.getByUserId(user.id)
  const link = await services.referral.createLink(professional.id, input.label)
  return created(c, link)
})

// 紹介リンク無効化
referralRoutes.delete('/me/:id', auth, requireRole('professional'), validateUuidParam('id'), async (c) => {
  const user = c.get('user')
  const professional = await services.professional.getByUserId(user.id)
  const link = await services.referral.deactivateLink(c.req.param('id'), professional.id)
  return ok(c, link)
})

// 紹介クライアント一覧
referralRoutes.get('/me/clients', auth, requireRole('professional'), validateQuery(referralQuerySchema), async (c) => {
  const user = c.get('user')
  const query = c.get('validatedQuery') as ReferralQuery
  const professional = await services.professional.getByUserId(user.id)
  const result = await services.referral.listClients(professional.id, query)
  return paginated(c, result)
})

// 代理登録（売主ユーザーと物件を一括作成）
referralRoutes.post('/me/clients', auth, requireRole('professional'), validateBody(proxyClientCreateSchema), async (c) => {
  const user = c.get('user')
  const input = c.get('validatedBody') as ProxyClientCreateInput
  const professional = await services.professional.getByUserId(user.id)
  const result = await services.referral.createProxyClient(professional.id, input)
  return created(c, result)
})

// 紹介クライアント詳細
referralRoutes.get('/me/clients/:id', auth, requireRole('professional'), validateUuidParam('id'), async (c) => {
  const user = c.get('user')
  const professional = await services.professional.getByUserId(user.id)
  const result = await services.referral.getClientDetail(professional.id, c.req.param('id'))
  return ok(c, result)
})

// 登録直後の紹介コード紐づけ（ログイン済みユーザーのみ）
referralRoutes.post('/link', auth, validateBody(linkReferralSchema), async (c) => {
  const user = c.get('user')
  const input = c.get('validatedBody') as LinkReferralInput
  const result = await services.referral.linkToSeller(user.id, input)
  return ok(c, result)
})

// 紹介コード検証（公開エンドポイント）
referralRoutes.get('/validate/:code', async (c) => {
  const code = c.req.param('code')
  const result = await services.referral.validateCode(code)
  return ok(c, result)
})

// 代理登録・紹介リンク発行時に選択する NW 一覧（士業のみ）
referralRoutes.get('/nw-companies', auth, requireRole('professional'), async (c) => {
  const result = await services.referral.listActiveNwCompanies()
  return ok(c, result)
})

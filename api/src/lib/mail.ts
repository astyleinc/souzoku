import { logger } from './logger'

type MailParams = {
  to: string
  subject: string
  html: string
  text?: string
}

let cachedResend: { send: (p: MailParams) => Promise<void> } | null = null

const getFromAddress = () =>
  process.env.MAIL_FROM ?? 'Ouver <no-reply@ouver.local>'

// Resend を遅延読み込み。API キー未設定時はログのみ（dev フォールバック）
const getResend = async () => {
  if (cachedResend) return cachedResend

  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    cachedResend = {
      send: async ({ to, subject }: MailParams) => {
        logger.warn('メール送信スキップ（RESEND_API_KEY 未設定）', { to, subject })
      },
    }
    return cachedResend
  }

  const { Resend } = await import('resend')
  const client = new Resend(apiKey)

  cachedResend = {
    send: async ({ to, subject, html, text }: MailParams) => {
      const result = await client.emails.send({
        from: getFromAddress(),
        to,
        subject,
        html,
        text,
      })

      if (result.error) {
        logger.error('メール送信エラー', { to, subject, error: result.error })
        throw new Error(`メール送信失敗: ${result.error.message}`)
      }

      logger.info('メール送信成功', { to, subject, id: result.data?.id })
    },
  }

  return cachedResend
}

export const sendMail = async (params: MailParams) => {
  try {
    const resend = await getResend()
    await resend.send(params)
  } catch (err) {
    // 通知失敗で業務処理を止めないため、ログに留める
    logger.error('メール送信で例外', {
      to: params.to,
      subject: params.subject,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

// 汎用の簡易HTMLテンプレート
export const renderSimpleTemplate = (args: {
  title: string
  body: string
  ctaLabel?: string
  ctaUrl?: string
}) => {
  const cta = args.ctaLabel && args.ctaUrl
    ? `<p style="margin:24px 0"><a href="${args.ctaUrl}" style="display:inline-block;background:#F97316;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">${args.ctaLabel}</a></p>`
    : ''

  return `<!doctype html>
<html lang="ja"><body style="font-family:-apple-system,'Hiragino Sans','Yu Gothic',sans-serif;background:#F8FAFC;margin:0;padding:32px 16px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px">
    <h1 style="font-size:18px;margin:0 0 16px;color:#0F172A">${args.title}</h1>
    <div style="font-size:14px;line-height:1.8;color:#334155;white-space:pre-line">${args.body}</div>
    ${cta}
    <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0">
    <p style="font-size:11px;color:#94A3B8;margin:0">株式会社Ouver / 相続不動産マッチング</p>
  </div>
</body></html>`
}

import { logger } from './logger'

type SlackPayload = {
  webhookUrl: string
  title: string
  body: string
  linkUrl?: string
  linkLabel?: string
}

export const sendSlack = async (payload: SlackPayload) => {
  if (!payload.webhookUrl) {
    logger.warn('Slack送信スキップ（Webhook URL 未指定）', { title: payload.title })
    return
  }

  const blocks: unknown[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: payload.title },
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: payload.body },
    },
  ]

  if (payload.linkUrl && payload.linkLabel) {
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: payload.linkLabel },
          url: payload.linkUrl,
        },
      ],
    })
  }

  try {
    const res = await fetch(payload.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      logger.error('Slack送信エラー', {
        status: res.status,
        response: text,
        title: payload.title,
      })
      return
    }

    logger.info('Slack送信成功', { title: payload.title })
  } catch (err) {
    logger.error('Slack送信で例外', {
      title: payload.title,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

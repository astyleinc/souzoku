import type { Metadata } from 'next'
import { Zen_Kaku_Gothic_New, Cormorant_Garamond, JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'
import { DevAuthSwitcher } from '@/components/dev/DevAuthSwitcher'
import { AuthProvider } from '@/providers/AuthProvider'

const zenKaku = Zen_Kaku_Gothic_New({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const jetBrains = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: '相続不動産マッチング',
  description:
    '相続で取得した不動産を、入札方式で適正価格・短期間で売却。士業との連携で相続手続きもワンストップで解決。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ja"
      className={`${zenKaku.variable} ${cormorant.variable} ${jetBrains.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <DevAuthSwitcher />
        </AuthProvider>
      </body>
    </html>
  )
}

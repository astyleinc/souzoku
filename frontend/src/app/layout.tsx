import type { Metadata } from 'next'
import { Noto_Sans_JP, Inter } from 'next/font/google'
import './globals.css'
import { DevAuthSwitcher } from '@/components/dev/DevAuthSwitcher'
import { AuthProvider } from '@/providers/AuthProvider'

const notoSansJP = Noto_Sans_JP({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
      className={`${notoSansJP.variable} ${inter.variable} h-full antialiased`}
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

import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { QueryProvider } from '@/components/providers/query-provider'

const inter = Inter({ subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'FIREWOLF',
    template: '%s | FIREWOLF',
  },
  description: '人狼ゲームが無料で遊べるWebサービス',
  keywords: ['人狼', '人狼ゲーム', 'オンライン', '無料', 'ゲーム'],
  authors: [{ name: 'h-orito' }],
  openGraph: {
    title: 'FIREWOLF',
    description: '人狼ゲームが無料で遊べるWebサービス',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    creator: '@firewolf_bbs',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#dc2626',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} ${jetbrainsMono.variable} min-h-screen flex flex-col`}>
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ConditionalFooter } from '@/components/layout/ConditionalFooter'
import '@/lib/fontawesome'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FIREWOLF',
    template: '%s | FIREWOLF',
  },
  description: '人狼ゲームが無料で遊べるWebサービス',
  keywords: ['人狼', '人狼ゲーム', 'オンライン', '無料', 'ゲーム'],
  authors: [{ name: 'hUorito' }],
  icons: {
    icon: '/firewolf/favicon.ico',
    shortcut: '/firewolf/favicon.ico',
  },
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
  manifest: '/firewolf/manifest.json',
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
          <ConditionalFooter />
        </QueryProvider>
      </body>
    </html>
  )
}

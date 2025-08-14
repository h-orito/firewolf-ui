'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

/**
 * 条件付きフッター表示コンポーネント
 * 村画面以外でのみフッターを表示する
 */
export const ConditionalFooter: React.FC = () => {
  const pathname = usePathname()

  // 村画面のパス（/village/[id]）の場合はフッターを表示しない
  // basePath設定により実際のpathnameは /village/[id] になる
  const isVillagePage = pathname.startsWith('/village/')

  if (isVillagePage) {
    return null
  }

  return <Footer />
}

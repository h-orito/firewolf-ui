'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'

/**
 * 条件付きヘッダー表示コンポーネント
 * 村画面以外でのみヘッダーを表示する
 */
export const ConditionalHeader: React.FC = () => {
  const pathname = usePathname()

  // 村画面のパス（/village/[id]）の場合はヘッダーを表示しない
  // basePath設定により実際のpathnameは /village/[id] になる
  const isVillagePage = pathname?.startsWith('/village/')

  if (isVillagePage) {
    return null
  }

  return <Header />
}

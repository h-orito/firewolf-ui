'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'

/**
 * 条件付きヘッダー表示コンポーネント
 * 村画面以外でのみヘッダーを表示する
 */
export const ConditionalHeader: React.FC = () => {
  const pathname = usePathname()

  // 村詳細画面のパス（/village/[id]）の場合はヘッダーを表示しない
  // 村作成画面（/village/create）は除外する
  // basePath設定により実際のpathnameは /village/[id] になる
  const isVillageDetailPage = pathname.startsWith('/village/') && pathname !== '/village/create'

  if (isVillageDetailPage) {
    return null
  }

  return <Header />
}

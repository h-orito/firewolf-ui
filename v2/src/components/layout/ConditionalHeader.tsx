'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'

/**
 * 条件付きヘッダー表示コンポーネント
 * 村画面以外でのみヘッダーを表示する
 */
export const ConditionalHeader: React.FC = () => {
  const pathname = usePathname()

  // 村詳細画面のパス（/village）の場合はヘッダーを表示しない
  // 村作成画面（/village/create）は除外する
  const isVillageDetailPage = pathname === '/village'

  if (isVillageDetailPage) {
    return null
  }

  return <Header />
}

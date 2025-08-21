'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

/**
 * 条件付きフッター表示コンポーネント
 * 村画面以外でのみフッターを表示する
 */
export const ConditionalFooter: React.FC = () => {
  const pathname = usePathname()

  // 村画面のパス（/village）の場合はフッターを表示しない
  // 村作成画面（/village/create）は表示する
  const isVillagePage = pathname === '/village'

  if (isVillagePage) {
    return null
  }

  return <Footer />
}

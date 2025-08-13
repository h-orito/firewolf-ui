'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

/**
 * 条件付きフッター表示コンポーネント
 * 村画面以外でのみフッターを表示する
 */
export const ConditionalFooter: React.FC = () => {
  const pathname = usePathname()

  // 村画面のパス（/firewolf/village/[id]）の場合はフッターを表示しない
  const isVillagePage = pathname?.match(/^\/firewolf\/village\/\d+/)

  if (isVillagePage) {
    return null
  }

  return <Footer />
}

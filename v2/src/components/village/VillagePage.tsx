/**
 * 村画面のメインエントリーポイント
 *
 * 村画面全体の状態管理と初期化を担当
 * レイアウト、エラーハンドリング、状態初期化を統合
 */

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { VillageLayout } from './VillageLayout'
import { VillageErrorBoundary } from './VillageErrorBoundary'
import { initializeVillageStores, cleanupVillageStores } from '@/stores/village'
import { useVillageQuery } from '@/hooks/use-village-query'
import { useAuth } from '@/hooks/useAuth'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface VillagePageProps {
  /** 村情報（サーバーから取得済み） */
  village: VillageView
  /** 初期表示日（URLパラメータから） */
  initialDay?: number
  /** 個人抽出対象ID（URLパラメータから） */
  participantId?: number
  /** キーワード検索（URLパラメータから） */
  keyword?: string
  /** 私宛のみ表示（URLパラメータから） */
  onlyToMe?: boolean
}

/**
 * 村画面のメインコンポーネント
 *
 * 責任:
 * - 村の存在確認とアクセス権限の検証
 * - 村画面用ストアの初期化とクリーンアップ
 * - エラーハンドリングの統合
 * - レイアウトコンポーネントへの状態連携
 */
export const VillagePage: React.FC<VillagePageProps> = ({
  village,
  initialDay,
  participantId,
  keyword,
  onlyToMe,
}) => {
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()

  // ストアの初期化とクリーンアップ
  useEffect(() => {
    // 村画面用ストアの初期化
    initializeVillageStores({
      villageId: village.id,
      initialDay,
      participantId,
      keyword,
      onlyToMe,
    })

    // クリーンアップ関数
    return () => {
      cleanupVillageStores()
    }
  }, [village.id, initialDay, participantId, keyword, onlyToMe])

  // ローディング状態
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">認証情報を確認中...</p>
        </div>
      </div>
    )
  }

  return (
    <VillageErrorBoundary>
      <VillageLayout village={village} user={user} initialDay={initialDay} />
    </VillageErrorBoundary>
  )
}

// プリロード用のコンポーネント
export const VillagePageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー部分のスケルトン */}
      <div className="bg-white border-b">
        <div className="h-16 max-w-7xl mx-auto px-4 flex items-center">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* メインコンテンツのスケルトン */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* サイドバーのスケルトン */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow space-y-3">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>

          {/* メインコンテンツのスケルトン */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-full h-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

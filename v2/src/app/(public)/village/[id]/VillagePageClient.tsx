'use client'

import React, { useEffect } from 'react'
import { VillageLayout } from '@/components/village/VillageLayout'
import { VillageErrorBoundary } from '@/components/village/VillageErrorBoundary'
import { initializeVillageStores, cleanupVillageStores } from '@/stores/village'
import { useAuth } from '@/hooks/useAuth'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface VillagePageClientProps {
  village: VillageView
  initialDay?: number
  participantId?: number
  keyword?: string
  onlyToMe?: boolean
}

export function VillagePageClient({
  village,
  initialDay,
  participantId,
  keyword,
  onlyToMe,
}: VillagePageClientProps) {
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

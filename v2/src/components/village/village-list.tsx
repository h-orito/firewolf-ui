'use client'

import { useState, useMemo } from 'react'
import { useVillageListQuery } from '@/hooks/useVillageListQuery'
import { useClientSidePagination } from '@/hooks/useClientSidePagination'
import { VillageCard } from './village-card'
import { ClientSidePagination } from '@/components/ui/client-side-pagination'
import type { components } from '@/types/generated/api'

type VillageStatus = string[]

interface VillageListProps {
  initialStatuses?: VillageStatus
}

const statusOptions = [
  { value: 'PROLOGUE', label: 'プロローグ' },
  { value: 'PROGRESS', label: '進行中' },
  { value: 'EPILOGUE', label: 'エピローグ' },
  { value: 'FINISHED', label: '終了' },
  { value: 'CANCELED', label: '廃村' },
]

export function VillageList({ initialStatuses = ['PROLOGUE', 'PROGRESS'] }: VillageListProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<VillageStatus>(initialStatuses)

  const { data, isLoading, error } = useVillageListQuery({
    village_status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
  })

  // フィルタリングされた村リスト
  const villages = useMemo(() => {
    return data?.list || []
  }, [data?.list])

  // クライアントサイドページネーション（1ページあたり12件）
  const {
    currentItems: currentVillages,
    currentPage,
    totalItems,
    totalPages,
    setPage,
  } = useClientSidePagination({
    items: villages,
    itemsPerPage: 12,
  })

  const handleStatusChange = (status: string, checked: boolean) => {
    setSelectedStatuses((prev) => (checked ? [...prev, status] : prev.filter((s) => s !== status)))
    // フィルター変更時は1ページ目に戻る
    setPage(1)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-2">村一覧の取得に失敗しました</p>
        <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">
          再読み込み
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* フィルター */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">表示する村の状態</h3>
        <div className="flex flex-wrap gap-4">
          {statusOptions.map(({ value, label }) => (
            <label key={value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedStatuses.includes(value)}
                onChange={(e) => handleStatusChange(value, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ローディング状態 */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">村一覧を読み込み中...</p>
        </div>
      )}

      {/* 村一覧 */}
      {data && (
        <>
          {villages.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p>条件に一致する村はありません</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {villages.length} 件の村が見つかりました
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentVillages.map((village) => (
                  <VillageCard key={village.id} village={village} />
                ))}
              </div>

              {/* クライアントサイドページネーション */}
              <ClientSidePagination
                totalItems={totalItems}
                itemsPerPage={12}
                currentPage={currentPage}
                onPageChange={setPage}
                className="mt-8"
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

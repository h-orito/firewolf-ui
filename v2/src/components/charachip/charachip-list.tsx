'use client'

import { useCharachipListQuery } from '@/hooks/useCharachipListQuery'
import { CharachipCard } from './charachip-card'

export function CharachipList() {
  const { data, isLoading, error } = useCharachipListQuery()

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-2">キャラチップ一覧の取得に失敗しました</p>
        <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">
          再読み込み
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">キャラチップ一覧を読み込み中...</p>
      </div>
    )
  }

  const charachips = data?.data?.list || []

  if (charachips.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>キャラチップが見つかりません</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        {charachips.length} 件のキャラチップが見つかりました
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {charachips.map((charachip) => (
          <CharachipCard key={charachip.id} charachip={charachip} />
        ))}
      </div>
    </div>
  )
}

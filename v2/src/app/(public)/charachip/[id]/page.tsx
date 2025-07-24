'use client'

import Link from 'next/link'
import { use, Suspense, lazy } from 'react'
import { useCharachipQuery } from '@/hooks/useCharachipQuery'
import { CharaCard } from '@/components/pages/charachip/chara-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const LazyCharaCard = lazy(() =>
  import('@/components/pages/charachip/chara-card').then((module) => ({
    default: module.CharaCard,
  }))
)

interface CharachipDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CharachipDetailPage({ params }: CharachipDetailPageProps) {
  const { id } = use(params)
  const charaChipId = parseInt(id, 10)
  const { data, isLoading, error } = useCharachipQuery(charaChipId)

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">キャラチップの取得に失敗しました</p>
          <Link href="/charachip-list">
            <Button variant="outline">キャラチップ一覧に戻る</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">キャラチップ詳細を読み込み中...</p>
        </div>
      </div>
    )
  }

  const charachip = data?.data

  if (!charachip) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">キャラチップが見つかりません</p>
          <Link href="/charachip-list">
            <Button variant="outline">キャラチップ一覧に戻る</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-6">
          <Link href="/charachip-list">
            <Button variant="outline" className="mb-4">
              ← キャラチップ一覧に戻る
            </Button>
          </Link>
        </div>

        {/* キャラチップ情報 */}
        <Card className="p-8 mb-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">{charachip.name}</h1>
            <p className="text-lg text-gray-600">作者: {charachip.designer.name}</p>

            {charachip.description_url && (
              <div>
                <a
                  href={charachip.description_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 hover:text-blue-800 underline"
                >
                  作者 HP
                </a>
              </div>
            )}

            <div className="text-gray-700 space-y-2">
              <p>キャラクター数: {charachip.chara_list?.length || 0}</p>
              <p>名前変更: {charachip.is_available_change_name ? '可能' : '不可'}</p>
            </div>
          </div>
        </Card>

        {/* キャラクター一覧 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">キャラクター一覧</h2>

          {charachip.chara_list && charachip.chara_list.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {charachip.chara_list.map((chara) => (
                <Suspense
                  key={chara.id}
                  fallback={
                    <Card className="p-4 animate-pulse">
                      <div className="space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="grid grid-cols-2 gap-2">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-16 h-16 bg-gray-200 rounded mx-auto"></div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  }
                >
                  <LazyCharaCard chara={chara} />
                </Suspense>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p>キャラクターが見つかりません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

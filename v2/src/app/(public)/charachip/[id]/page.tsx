'use client'

import Link from 'next/link'
import { useCharachipQuery } from '@/hooks/useCharachipQuery'
import { CharaCard } from '@/components/charachip/chara-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CharachipDetailPageProps {
  params: { id: string }
}

export default function CharachipDetailPage({ params }: CharachipDetailPageProps) {
  const charaChipId = parseInt(params.id, 10)
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

            {charachip.descriptionUrl && (
              <div>
                <a
                  href={charachip.descriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 hover:text-blue-800 underline"
                >
                  素材サイトを見る
                </a>
              </div>
            )}

            <div className="text-gray-700">
              <p>キャラクター数: {charachip.charaList?.length || 0}</p>
            </div>
          </div>
        </Card>

        {/* キャラクター一覧 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">キャラクター一覧</h2>

          {charachip.charaList && charachip.charaList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {charachip.charaList.map((chara) => (
                <CharaCard key={chara.id} chara={chara} />
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

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { components } from '@/types/generated/api'

type SimpleVillageView = components['schemas']['SimpleVillageView']

interface VillageCardProps {
  village: SimpleVillageView
}

export function VillageCard({ village }: VillageCardProps) {
  const statusColor = getStatusColor(village.status.code)
  const progressPercent = Math.round(
    (village.participant.count / village.setting.capacity.max) * 100
  )

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium line-clamp-2">
            <Link href={`/village/${village.id}`} className="hover:text-blue-600 transition-colors">
              {village.name}
            </Link>
          </CardTitle>
          <div className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
            {village.status.name}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          {/* 参加者情報 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">参加者</span>
            <span className="font-medium">
              {village.participant.count} / {village.setting.capacity.max}
              {progressPercent > 0 && (
                <span className="text-gray-500 ml-1">({progressPercent}%)</span>
              )}
            </span>
          </div>

          {/* キャラチップ */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">キャラチップ</span>
            <span className="text-xs">{village.setting.charachip.dummyCharaName}</span>
          </div>

          {/* 開始予定時刻 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">開始予定</span>
            <span className="text-xs">{formatDateTime(village.setting.time.startDatetime)}</span>
          </div>

          {/* 構成 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">構成</span>
            <span className="text-xs">
              {village.setting.organizations.organization['MILLER_HOLLOW'] || '不明'}
            </span>
          </div>

          {/* 勝利陣営（終了している場合） */}
          {village.status.isFinished && village.winCamp && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">勝利陣営</span>
              <span className="text-xs font-medium">{village.winCamp.name}</span>
            </div>
          )}

          {/* タグ */}
          {village.setting.tags.list.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {village.setting.tags.list.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function getStatusColor(statusCode: string): string {
  switch (statusCode) {
    case 'PROLOGUE':
      return 'bg-green-100 text-green-800'
    case 'PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'EPILOGUE':
      return 'bg-yellow-100 text-yellow-800'
    case 'FINISHED':
      return 'bg-gray-100 text-gray-800'
    case 'CANCELED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

function formatDateTime(dateTime: string): string {
  const date = new Date(dateTime)
  return date.toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

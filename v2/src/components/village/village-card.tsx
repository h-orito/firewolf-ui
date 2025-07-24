import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/utils/datetime'
import type { components } from '@/types/generated/api'
import { VILLAGE_STATUS } from '@/types/village-status'

type SimpleVillageView = components['schemas']['SimpleVillageView']

interface VillageCardProps {
  village: SimpleVillageView
}

export function VillageCard({ village }: VillageCardProps) {
  const statusColor = getStatusColor(village.status.code)

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
          {/* 参加人数情報 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">参加人数</span>
            <span className="font-medium">
              {village.participant.count} / {village.setting.capacity.max}
              {village.spectator.count > 0 && (
                <span className="text-gray-500 ml-1">+ {village.spectator.count}</span>
              )}
            </span>
          </div>

          {/* 更新時刻 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">更新</span>
            <span className="text-xs">{getLastUpdateTime(village.day.day_list)}</span>
          </div>

          {/* 発言可能時間 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">発言可能時間</span>
            <span className="text-xs">{getSayableTime(village.setting.time)}</span>
          </div>

          {/* 構成 */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">編成</span>
            <span className="text-xs">
              {getOrganizationName(
                village.setting.organizations.organization,
                village.participant.count,
                village.setting.capacity.max
              )}
            </span>
          </div>

          {/* ダミー役欠け */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">ダミー役欠け</span>
            <span className="text-xs">
              {getDummySkill(village.setting.rules.available_dummy_skill)}
            </span>
          </div>

          {/* 年齢制限（該当する場合のみ） */}
          {getAgeLimit(village.setting.tags.list) && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">年齢制限</span>
              <span className="text-xs">{getAgeLimit(village.setting.tags.list)}</span>
            </div>
          )}

          {/* 勝利陣営（終了している場合） */}
          {village.status.is_finished && village.win_camp && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">勝利陣営</span>
              <span className="text-xs font-medium">{village.win_camp.name}</span>
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
    case VILLAGE_STATUS.PROLOGUE:
      return 'bg-green-100 text-green-800'
    case VILLAGE_STATUS.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800'
    case VILLAGE_STATUS.EPILOGUE:
      return 'bg-yellow-100 text-yellow-800'
    case VILLAGE_STATUS.COMPLETED:
      return 'bg-gray-100 text-gray-800'
    case VILLAGE_STATUS.CANCEL:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

function getOrganizationName(
  organization: { [key: string]: string },
  participantCount: number,
  maxCapacity: number
): string {
  // まず現在の参加人数に対応する構成を探す
  const currentCountKey = String(participantCount)
  if (organization[currentCountKey]) {
    return organization[currentCountKey]
  }

  // なければ最大人数に対応する構成を探す
  const maxCountKey = String(maxCapacity)
  if (organization[maxCountKey]) {
    return organization[maxCountKey]
  }

  // それでもなければ最初のキーの値を返す
  const keys = Object.keys(organization)
  if (keys.length === 0) {
    return '不明'
  }
  return organization[keys[0]] || '不明'
}

function getLastUpdateTime(dayList: { day_change_datetime: string }[] | undefined): string {
  if (!dayList || dayList.length === 0) {
    return '未定'
  }
  const lastDay = dayList[dayList.length - 1]
  return formatDateTime(lastDay.day_change_datetime)
}

function getSayableTime(timeSettings: {
  silent_hours?: number
  sayable_start: { hour?: number; minute?: number }
  sayable_end: { hour?: number; minute?: number }
}): string {
  const silentHours = timeSettings.silent_hours
  if (!silentHours) {
    return '24時間'
  }

  const start = timeSettings.sayable_start
  const end = timeSettings.sayable_end
  const startTime = `${String(start.hour || 0).padStart(2, '0')}:${String(start.minute || 0).padStart(2, '0')}`
  const endTime = `${String(end.hour || 0).padStart(2, '0')}:${String(end.minute || 0).padStart(2, '0')}`

  if (startTime === endTime) {
    return '24時間'
  }

  const activeHours = 24 - silentHours
  return `${startTime} - ${endTime}（${activeHours}時間）`
}

function getDummySkill(available_dummy_skill: boolean): string {
  return available_dummy_skill ? 'あり' : 'なし'
}

function getAgeLimit(tagList: string[]): string | null {
  return tagList.find((tag) => tag.startsWith('R')) || null
}

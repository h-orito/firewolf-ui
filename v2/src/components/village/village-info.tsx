import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTimeWithYear } from '@/utils/datetime'
import type { components } from '@/types/generated/api'
import { VILLAGE_STATUS } from '@/types/village-status'

type VillageView = components['schemas']['VillageView']

interface VillageInfoProps {
  village: VillageView
}

export function VillageInfo({ village }: VillageInfoProps) {
  const statusColor = getStatusColor(village.status.code)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold">{village.name}</CardTitle>
          <div className={`px-3 py-1 rounded text-sm font-medium ${statusColor}`}>
            {village.status.name}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {/* 基本情報 */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">村建て</span>
              <span>{village.creator_player.nickname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">参加者</span>
              <span>
                {village.participant.count} / {village.setting.capacity.max}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">観戦者</span>
              <span>{village.spectator.count}人</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">開始予定</span>
              <span className="text-sm">
                {formatDateTimeWithYear(village.setting.time.start_datetime)}
              </span>
            </div>
          </div>

          {/* 設定情報 */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">キャラチップ</span>
              <span className="text-sm">{village.setting.charachip.dummy_chara_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">構成</span>
              <span className="text-sm">
                {getOrganizationName(
                  village.setting.organizations.organization,
                  village.participant.count,
                  village.setting.capacity.max
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">更新間隔</span>
              <span className="text-sm">
                {Math.floor(village.setting.time.day_change_interval_seconds / 3600)}時間
              </span>
            </div>
            {village.setting.time.silent_hours && (
              <div className="flex justify-between">
                <span className="text-gray-600">沈黙時間</span>
                <span className="text-sm">{village.setting.time.silent_hours}時間</span>
              </div>
            )}
          </div>
        </div>

        {/* タグ */}
        {village.setting.tags.list.length > 0 && (
          <div className="mt-4">
            <span className="text-gray-600 text-sm block mb-2">タグ</span>
            <div className="flex flex-wrap gap-2">
              {village.setting.tags.list.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 勝利陣営（終了している場合） */}
        {village.status.is_finished && village.win_camp && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="text-center">
              <span className="text-gray-600">勝利陣営: </span>
              <span className="font-semibold text-yellow-800">{village.win_camp.name}</span>
            </div>
          </div>
        )}

        {/* 村の説明（ルール等） */}
        <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">投票・議論ルール</h4>
            <ul className="space-y-1 text-gray-600">
              <li>・投票: {village.setting.rules.open_vote ? '記名' : '無記名'}</li>
              <li>・役職希望: {village.setting.rules.available_skill_request ? '可' : '不可'}</li>
              <li>・観戦: {village.setting.rules.available_spectate ? '可' : '不可'}</li>
              <li>・コミット: {village.setting.rules.available_commit ? '可' : '不可'}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">その他設定</h4>
            <ul className="space-y-1 text-gray-600">
              <li>・墓下公開: {village.setting.rules.open_skill_in_grave ? '可' : '不可'}</li>
              <li>・墓下発言表示: {village.setting.rules.visible_grave_message ? '可' : '不可'}</li>
              <li>・突然死: {village.setting.rules.available_suddenly_death ? '有り' : '無し'}</li>
              <li>・アクション: {village.setting.rules.available_action ? '有り' : '無し'}</li>
            </ul>
          </div>
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

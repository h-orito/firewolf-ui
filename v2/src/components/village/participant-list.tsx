import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']
type VillageParticipantView = components['schemas']['VillageParticipantView']

interface ParticipantListProps {
  village: VillageView
}

interface ParticipantCardProps {
  participant: VillageParticipantView
  isSpectator?: boolean
}

function ParticipantCard({ participant, isSpectator = false }: ParticipantCardProps) {
  return (
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
      {/* キャラクター画像（仮） */}
      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-xs text-gray-600">IMG</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-900 truncate">{participant.charaName.name}</p>
          {participant.dead && (
            <span className="px-1 py-0.5 bg-red-100 text-red-800 text-xs rounded">死亡</span>
          )}
          {isSpectator && (
            <span className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">観戦</span>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          {participant.player && <p className="truncate">{participant.player.nickname}</p>}

          {/* 役職表示（条件によって表示/非表示） */}
          {participant.skill && <p className="text-blue-600">{participant.skill.name}</p>}

          {/* コミングアウト表示 */}
          {participant.commingOuts.list.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {participant.commingOuts.list.map((co, index) => (
                <span key={index} className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                  CO: {co.skill.shortName}
                </span>
              ))}
            </div>
          )}

          {/* 死亡情報 */}
          {participant.dead && (
            <p className="text-red-600">
              {participant.dead.villageDay.day}日目 {participant.dead.reason}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function ParticipantList({ village }: ParticipantListProps) {
  const livingParticipants = village.participant.memberList.filter((p) => !p.dead)
  const deadParticipants = village.participant.memberList.filter((p) => p.dead)

  return (
    <div className="space-y-6">
      {/* 生存者 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">生存者 ({livingParticipants.length}人)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {livingParticipants.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">生存者はいません</p>
          ) : (
            livingParticipants.map((participant) => (
              <ParticipantCard key={participant.id} participant={participant} />
            ))
          )}
        </CardContent>
      </Card>

      {/* 死亡者 */}
      {deadParticipants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-600">
              死亡者 ({deadParticipants.length}人)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {deadParticipants.map((participant) => (
              <ParticipantCard key={participant.id} participant={participant} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* 観戦者 */}
      {village.spectator.count > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-600">
              観戦者 ({village.spectator.count}人)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {village.spectator.memberList.map((spectator) => (
              <ParticipantCard key={spectator.id} participant={spectator} isSpectator={true} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

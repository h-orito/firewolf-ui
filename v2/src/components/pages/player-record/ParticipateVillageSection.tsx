import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { components } from '@/types/generated/api'

type ParticipateVillageView = components['schemas']['ParticipateVillageView']

interface ParticipateVillageSectionProps {
  participateVillageList: ParticipateVillageView[]
}

export function ParticipateVillageSection({
  participateVillageList,
}: ParticipateVillageSectionProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">参加村一覧</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">村名</th>
              <th className="text-left p-2">キャラクター</th>
              <th className="text-left p-2">役職</th>
              <th className="text-center p-2">勝敗</th>
              <th className="text-center p-2">生死</th>
              <th className="text-left p-2">開始日</th>
            </tr>
          </thead>
          <tbody>
            {participateVillageList.map((participateVillage, index) => {
              const { village, participant } = participateVillage
              const isWin = participant.win
              const isDead = participant.dead

              return (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <Link
                      href={`/village?id=${village.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {village.name}
                    </Link>
                  </td>
                  <td className="p-2">{participant.chara_name.name}</td>
                  <td className="p-2">
                    {participant.skill?.name || '-'}
                    {participant.spectator && (
                      <span className="ml-1 text-xs bg-gray-200 px-1 rounded">見学</span>
                    )}
                  </td>
                  <td className="text-center p-2">
                    {participant.spectator ? (
                      '-'
                    ) : isWin !== undefined ? (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isWin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isWin ? '勝利' : '敗北'}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="text-center p-2">
                    {participant.spectator ? (
                      '-'
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isDead ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {isDead ? '死亡' : '生存'}
                        {isDead && participant.dead && ` (${participant.dead.village_day.day}日目)`}
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    {village.setting.time.start_datetime
                      ? new Date(village.setting.time.start_datetime).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                        })
                      : '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {participateVillageList.length === 0 && (
        <div className="text-center py-8 text-gray-500">参加村がありません</div>
      )}
    </Card>
  )
}

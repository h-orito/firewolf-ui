import { Card } from '@/components/ui/card'
import { components } from '@/types/generated/api'

type PlayerView = components['schemas']['PlayerView']
type Record = components['schemas']['Record']

interface PlayerInfoSectionProps {
  player: PlayerView
  wholeRecord: Record
}

export function PlayerInfoSection({ player, wholeRecord }: PlayerInfoSectionProps) {
  const winRate = wholeRecord.win_rate * 100

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">プレイヤー情報</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">プレイヤー名</h3>
          <p className="text-lg font-semibold">{player.nickname}</p>
        </div>

        {player.twitter_user_name && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">Twitter</h3>
            <p className="text-lg">@{player.twitter_user_name}</p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">参加回数</h3>
          <p className="text-2xl font-bold text-blue-600">{wholeRecord.participate_count}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">勝利回数</h3>
          <p className="text-2xl font-bold text-green-600">{wholeRecord.win_count}</p>
        </div>

        <div className="space-y-2 md:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-medium text-gray-600">勝率</h3>
          <p className="text-2xl font-bold text-orange-600">{winRate.toFixed(1)}%</p>
        </div>
      </div>
    </Card>
  )
}

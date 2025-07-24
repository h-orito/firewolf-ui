import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import type { components } from '@/types/generated/api'

interface CharachipCardProps {
  charachip: components['schemas']['CharachipView']
}

export function CharachipCard({ charachip }: CharachipCardProps) {
  const router = useRouter()

  const handleCardClick = (e: React.MouseEvent) => {
    // description_urlのリンククリック時はカードナビゲーションを無効化
    if ((e.target as HTMLElement).closest('a[href^="http"]')) {
      return
    }
    router.push(`/charachip/${charachip.id}`)
  }

  return (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">{charachip.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{charachip.designer.name}</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-700">{charachip.chara_list?.length || 0} キャラクター</p>
        </div>

        {charachip.description_url && (
          <div className="text-center">
            <a
              href={charachip.description_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              素材サイトを見る
            </a>
          </div>
        )}
      </div>
    </Card>
  )
}

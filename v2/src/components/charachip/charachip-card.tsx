import Link from 'next/link'
import { Card } from '@/components/ui/card'
import type { components } from '@/types/generated/api'

interface CharachipCardProps {
  charachip: components['schemas']['CharachipView']
}

export function CharachipCard({ charachip }: CharachipCardProps) {
  return (
    <Link href={`/charachip/${charachip.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">{charachip.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{charachip.designer.name}</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-700">{charachip.charaList?.length || 0} キャラクター</p>
          </div>

          {charachip.descriptionUrl && (
            <div className="text-center">
              <a
                href={charachip.descriptionUrl}
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
    </Link>
  )
}

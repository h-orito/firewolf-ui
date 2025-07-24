import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import type { components } from '@/types/generated/api'

interface CharachipCardProps {
  charachip: components['schemas']['CharachipView']
}

export function CharachipCard({ charachip }: CharachipCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/charachip/${charachip.id}`)
  }

  // 代表キャラクターの画像を取得（v1と同様に最初のキャラクターを使用）
  const representativeChara = charachip.chara_list?.[0]
  const representativeImageUrl = representativeChara?.face_list?.[0]?.image_url

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

        {/* 代表キャラクター画像 */}
        {representativeImageUrl && representativeChara && (
          <div className="flex justify-center">
            <Image
              src={representativeImageUrl}
              alt={`${representativeChara.chara_name?.name || 'キャラクター'}`}
              width={representativeChara.display.width}
              height={representativeChara.display.height}
              className="mx-auto"
            />
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-700">{charachip.chara_list?.length || 0} キャラクター</p>
        </div>
      </div>
    </Card>
  )
}

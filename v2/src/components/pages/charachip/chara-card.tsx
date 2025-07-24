import { Card } from '@/components/ui/card'
import type { components } from '@/types/generated/api'

interface CharaCardProps {
  chara: components['schemas']['Chara']
}

export function CharaCard({ chara }: CharaCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="text-center">
          <h3 className="font-medium text-gray-900">{chara.chara_name.name}</h3>
        </div>

        {chara.face_list && chara.face_list.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {chara.face_list.slice(0, 4).map((face, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-600 mb-1">{face.type}</div>
                {/* TODO: 画像が利用可能な場合は表示 */}
                <div className="w-12 h-12 bg-gray-200 rounded mx-auto flex items-center justify-center">
                  <span className="text-xs text-gray-500">画像</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-600 text-center">
          表情: {chara.face_list?.length || 0}種類
        </div>
      </div>
    </Card>
  )
}

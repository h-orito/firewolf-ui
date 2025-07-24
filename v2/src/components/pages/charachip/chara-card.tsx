import Image from 'next/image'
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
          <div className="flex flex-wrap gap-2 justify-center">
            {chara.face_list.slice(0, 6).map((face, index) => (
              <div key={index} className="text-center">
                {face.image_url ? (
                  <Image
                    src={face.image_url}
                    alt={`${chara.chara_name.name} - ${face.type || '表情'}`}
                    width={chara.display.width}
                    height={chara.display.height}
                    className="mx-auto"
                  />
                ) : (
                  <div
                    className="bg-gray-200 mx-auto flex items-center justify-center"
                    style={{
                      width: `${chara.display.width}px`,
                      height: `${chara.display.height}px`,
                    }}
                  >
                    <span className="text-xs text-gray-500">画像</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

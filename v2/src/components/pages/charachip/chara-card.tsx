import { Card } from '@/components/ui/card'
import { CharacterImage } from '@/components/ui/character-image'
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
                <CharacterImage
                  chara={chara}
                  faceType={face.type}
                  alt={`${chara.chara_name.name} - ${face.type || '表情'}`}
                  className="mx-auto"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

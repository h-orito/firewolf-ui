'use client'

import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CharacterImage } from '@/components/ui/character-image'
import type { Chara } from '@/types/charachip'

interface DummyCharacterModalProps {
  isOpen: boolean
  onClose: () => void
  charas: Chara[]
  selectedCharaId: number
  onSelectChara: (chara: Chara) => void
}

export function DummyCharacterModal({
  isOpen,
  onClose,
  charas,
  selectedCharaId,
  onSelectChara,
}: DummyCharacterModalProps) {
  const handleSelectChara = (chara: Chara) => {
    onSelectChara(chara)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ダミーキャラを選択</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {charas.map((chara) => (
            <Card
              key={chara.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedCharaId === chara.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectChara(chara)}
            >
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-lg font-medium">
                    [{chara.chara_name.short_name}] {chara.chara_name.name}
                  </p>
                </div>

                {chara.face_list && chara.face_list.length > 0 ? (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {chara.face_list.map((face, index) => (
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
                ) : (
                  <div className="text-center text-gray-500">画像がありません</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { memo, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'
import { CharacterImage } from '@/components/ui/character-image'
import { usePagination } from '@/hooks/use-pagination'
import type { Chara } from '@/types/charachip'

interface DummyCharacterModalProps {
  isOpen: boolean
  onClose: () => void
  charas: Chara[]
  selectedCharaId: number
  onSelectChara: (chara: Chara) => void
}

const DummyCharacterModal = memo(function DummyCharacterModal({
  isOpen,
  onClose,
  charas,
  selectedCharaId,
  onSelectChara,
}: DummyCharacterModalProps) {
  const ITEMS_PER_PAGE = 20

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination<Chara>({
    totalItems: charas.length,
    itemsPerPage: ITEMS_PER_PAGE,
    initialPage: 1,
  })

  const currentCharas = useMemo(() => paginatedItems(charas), [paginatedItems, charas])

  const handleSelectChara = (chara: Chara) => {
    onSelectChara(chara)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ダミーキャラを選択</DialogTitle>
          <div className="text-sm text-gray-600">
            {charas.length}件中 {(currentPage - 1) * ITEMS_PER_PAGE + 1}〜
            {Math.min(currentPage * ITEMS_PER_PAGE, charas.length)}件を表示
          </div>
        </DialogHeader>

        {totalPages > 1 && (
          <div className="flex justify-center py-2">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {currentCharas.map((chara) => (
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
                          loading="lazy"
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

        {totalPages > 1 && (
          <div className="flex justify-center py-4">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
})

export { DummyCharacterModal }

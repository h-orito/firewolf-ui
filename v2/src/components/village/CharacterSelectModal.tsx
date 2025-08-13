'use client'

import { useState, useEffect, useMemo } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { CharacterIcon } from '@/components/common/CharacterIcon'
import { useCharasQuery } from '@/hooks/use-charas-query'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']
type Chara = components['schemas']['Chara']
type Charas = components['schemas']['Charas']

interface CharacterSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (character: Chara) => void
  village: VillageView
  selectedCharacterId?: number
}

/**
 * キャラクター選択モーダル
 *
 * 村のキャラチップから選択可能なキャラクターを表示し、
 * ユーザーがキャラクターを選択できるモーダル
 */
export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  village,
  selectedCharacterId,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<number | null>(
    selectedCharacterId || null
  )

  // 村のキャラチップIDからキャラクター一覧を取得
  const charachipIds = village.setting?.charachip?.charachip_ids || []
  const { data: charasData, isLoading, error } = useCharasQuery(charachipIds)
  const charas: Chara[] = useMemo(() => (charasData?.data as Charas)?.list || [], [charasData])

  // 既に使用されているキャラクターのIDを取得
  const usedCharacterIds = useMemo(() => {
    const participantCharIds =
      village.participant?.member_list?.map((member) => member.chara?.id).filter(Boolean) || []

    const spectatorCharIds =
      village.spectator?.member_list?.map((member) => member.chara?.id).filter(Boolean) || []

    return [...participantCharIds, ...spectatorCharIds]
  }, [village.participant?.member_list, village.spectator?.member_list])

  // 選択可能なキャラクター（使用されていないキャラクター）
  const availableCharas = useMemo(
    () => charas.filter((chara) => !usedCharacterIds.includes(chara.id)),
    [charas, usedCharacterIds]
  )

  // モーダルが開かれた時の初期化
  useEffect(() => {
    if (isOpen) {
      setInternalSelectedId(selectedCharacterId || null)
    }
  }, [isOpen, selectedCharacterId])

  // キャラクター選択ハンドラー
  const handleCharacterClick = (chara: Chara) => {
    setInternalSelectedId(chara.id)
  }

  // ダブルクリックで選択して閉じる
  const handleCharacterDoubleClick = (chara: Chara) => {
    onSelect(chara)
    onClose()
  }

  // 選択ボタンのハンドラー
  const handleSelect = () => {
    const selectedChara = availableCharas.find((chara) => chara.id === internalSelectedId)
    if (selectedChara) {
      onSelect(selectedChara)
      onClose()
    }
  }

  // 選択されたキャラクター
  const selectedChara = availableCharas.find((chara) => chara.id === internalSelectedId)

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="キャラクター選択" className="max-w-4xl">
      <div className="space-y-6">
        {/* キャラチップグループ選択タブ（将来的な拡張用・現在は1つのみ） */}
        <div className="border-b">
          <div className="text-sm text-gray-600">
            利用可能なキャラクター: {availableCharas.length}
          </div>
        </div>

        {/* ローディング状態 */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="text-gray-500">キャラクターを読み込み中...</div>
          </div>
        )}

        {/* エラー状態 */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-500">キャラクターの読み込みに失敗しました</div>
          </div>
        )}

        {/* キャラクター一覧 */}
        {availableCharas.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {availableCharas.map((chara) => (
                <button
                  key={chara.id}
                  onClick={() => handleCharacterClick(chara)}
                  onDoubleClick={() => handleCharacterDoubleClick(chara)}
                  className={`p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    internalSelectedId === chara.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <CharacterIcon
                      characterName={{
                        name: chara.chara_name.name,
                        short_name: chara.chara_name.short_name,
                        full_name: chara.chara_name.name,
                      }}
                      size="md"
                    />
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-900">
                        {chara.chara_name.short_name}
                      </div>
                      <div className="text-xs text-gray-600 leading-tight">
                        {chara.chara_name.name}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 選択中キャラクター表示 */}
            {selectedChara && (
              <div className="border-t pt-4">
                <div className="flex items-center space-x-3">
                  <CharacterIcon
                    characterName={{
                      name: selectedChara.chara_name.name,
                      short_name: selectedChara.chara_name.short_name,
                      full_name: selectedChara.chara_name.name,
                    }}
                    size="sm"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      選択中: {selectedChara.chara_name.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {selectedChara.chara_name.short_name}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 利用可能なキャラクターがない場合 */}
        {!isLoading && !error && availableCharas.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">利用可能なキャラクターがありません</div>
          </div>
        )}

        {/* フッターボタン */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleSelect} disabled={!selectedChara} className="min-w-24">
            選択
          </Button>
        </div>
      </div>
    </Modal>
  )
}

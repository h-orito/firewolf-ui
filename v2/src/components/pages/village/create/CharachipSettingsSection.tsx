import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { CharacterImage } from '@/components/ui/CharacterImage'
import { Alert } from '@/components/ui/Alert'
import type { CharachipView, Chara } from '@/types/charachip'

interface CharachipSettingsSectionProps {
  // キャラチップ関連
  charachips: CharachipView[]
  charachipLoading: boolean
  charachipError: any
  charachipIds: number[]
  onCharachipIdsChange: (ids: number[]) => void

  // ダミーキャラ関連
  charas: Chara[]
  dummyCharaId: number
  dummyCharaName: string
  dummyCharaShortName: string
  dummyCharaDay0Message: string
  dummyCharaDay1Message: string
  onDummyCharaChange: (chara: Chara) => void
  onDummyCharaNameChange: (name: string) => void
  onDummyCharaShortNameChange: (shortName: string) => void
  onDummyCharaDay0MessageChange: (message: string) => void
  onDummyCharaDay1MessageChange: (message: string) => void
  onOpenDummyCharaModal: () => void
}

export function CharachipSettingsSection({
  charachips,
  charachipLoading,
  charachipError,
  charachipIds,
  onCharachipIdsChange,
  charas,
  dummyCharaId,
  dummyCharaName,
  dummyCharaShortName,
  dummyCharaDay0Message,
  dummyCharaDay1Message,
  onDummyCharaChange,
  onDummyCharaNameChange,
  onDummyCharaShortNameChange,
  onDummyCharaDay0MessageChange,
  onDummyCharaDay1MessageChange,
  onOpenDummyCharaModal,
}: CharachipSettingsSectionProps) {
  const selectedDummyChara = charas.find((chara) => chara.id === dummyCharaId)

  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">キャラチップ設定</h2>

        {/* キャラチップ選択 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">キャラチップ</label>
          <div className="space-y-2">
            {charachipLoading && <p className="text-gray-500">キャラチップを読み込み中...</p>}
            {charachipError && <p className="text-red-500">キャラチップの読み込みに失敗しました</p>}
            {charachips.length === 0 && !charachipLoading && !charachipError && (
              <p className="text-gray-500">キャラチップがありません</p>
            )}
            {charachips.length > 0 && (
              <select
                multiple
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                value={charachipIds.map(String)}
                onChange={(e) => {
                  const selectedValues = Array.from(e.target.selectedOptions, (option) =>
                    parseInt(option.value)
                  )
                  onCharachipIdsChange(selectedValues)
                }}
                required
              >
                {charachips.map((charachip) => (
                  <option key={charachip.id} value={charachip.id}>
                    {charachip.name}
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-gray-500">
              複数選択する場合はCtrl/Cmd + クリックしてください
            </p>
          </div>
        </div>

        {/* ダミーキャラ選択 */}
        {charas.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">ダミーキャラ</label>
            <div className="flex gap-2">
              <select
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dummyCharaId}
                onChange={(e) => {
                  const selectedCharaId = parseInt(e.target.value)
                  const selectedChara = charas.find((chara) => chara.id === selectedCharaId)
                  if (selectedChara) {
                    onDummyCharaChange(selectedChara)
                  }
                }}
                required
              >
                {charas.map((chara) => (
                  <option key={chara.id} value={chara.id}>
                    {chara.chara_name.name}
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" onClick={onOpenDummyCharaModal}>
                画像から選ぶ
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ダミーキャラ名</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dummyCharaName}
              onChange={(e) => onDummyCharaNameChange(e.target.value)}
              maxLength={40}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ダミーキャラ略称</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dummyCharaShortName}
              onChange={(e) => onDummyCharaShortNameChange(e.target.value)}
              maxLength={1}
              required
            />
          </div>
        </div>

        {/* ダミーキャラ発言セクション */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">ダミーキャラ発言</h3>
          </div>

          <Alert>
            <p>1日目発言のみ、村作成後も変更できます</p>
          </Alert>

          <div className="space-y-2">
            <label className="text-sm font-medium">プロローグ発言</label>
            <div className="flex" style={{ gap: '5px' }}>
              {selectedDummyChara && (
                <div className="flex-shrink-0">
                  <CharacterImage chara={selectedDummyChara} faceType="NORMAL" />
                </div>
              )}
              <Textarea
                className="flex-1"
                value={dummyCharaDay0Message}
                onChange={(e) => onDummyCharaDay0MessageChange(e.target.value)}
                placeholder="プロローグでのダミーキャラクターのメッセージ"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">1日目発言</label>
            <div className="flex" style={{ gap: '5px' }}>
              {selectedDummyChara && (
                <div className="flex-shrink-0">
                  <CharacterImage chara={selectedDummyChara} faceType="NORMAL" />
                </div>
              )}
              <Textarea
                className="flex-1"
                value={dummyCharaDay1Message}
                onChange={(e) => onDummyCharaDay1MessageChange(e.target.value)}
                placeholder="1日目でのダミーキャラクターのメッセージ（空の場合は発言なし）"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

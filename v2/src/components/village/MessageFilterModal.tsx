import { useState } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useMessageFilterStore } from '@/stores/village'
import type { MessageFilterState } from '@/types/village'

interface MessageFilterModalProps {
  isOpen: boolean
  onClose: () => void
  participants: Array<{
    id: number
    name: string
    shortName: string
    characterIcon?: string
    messageCount?: number
  }>
}

/**
 * 発言抽出フィルタモーダル
 * 11種類の発言種別、参加者、宛先、キーワードによる発言フィルタリング機能を提供
 */
export function MessageFilterModal({ isOpen, onClose, participants }: MessageFilterModalProps) {
  const {
    messageTypes,
    participants: participantsFilter,
    target,
    keyword,
    setMessageTypeFilter,
    toggleMessageTypeFilter,
    setParticipantFilter,
    toggleParticipantFilter,
    setOnlyToMe,
    setKeyword,
    reset,
    applyFilters,
  } = useMessageFilterStore()

  const [localKeyword, setLocalKeyword] = useState(keyword)

  // 発言種別の定義（仕様書準拠）
  const messageTypeLabels: Record<keyof MessageFilterState['messageTypes'], string> = {
    normalSay: '通常発言',
    werewolfSay: '囁き',
    sympathizeSay: '共鳴',
    graveSay: '墓下見学',
    monologueSay: '独り言',
    spectateSay: '見学',
    systemMessage: '公開システム',
    privateSystem: '非公開システム',
    participantMessage: '参加者',
    psychicMessage: '霊能者',
    hunterMessage: '狩人',
  }

  // 一括操作
  const handleToggleAllMessageTypes = (enabled: boolean) => {
    Object.keys(messageTypes).forEach((type) => {
      setMessageTypeFilter(type as keyof MessageFilterState['messageTypes'], enabled)
    })
  }

  const handleInvertMessageTypes = () => {
    Object.entries(messageTypes).forEach(([type, enabled]) => {
      setMessageTypeFilter(type as keyof MessageFilterState['messageTypes'], !enabled)
    })
  }

  const handleToggleAllParticipants = (enabled: boolean) => {
    participants.forEach((participant) => {
      setParticipantFilter(participant.id, enabled)
    })
  }

  const handleInvertParticipants = () => {
    participants.forEach((participant) => {
      toggleParticipantFilter(participant.id)
    })
  }

  // フィルタ適用
  const handleApply = () => {
    setKeyword(localKeyword)
    applyFilters()
    onClose()
  }

  // リセット
  const handleReset = () => {
    if (window.confirm('すべての設定をリセットしてよろしいですか？')) {
      reset()
      setLocalKeyword('')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="発言抽出" className="!max-w-4xl !max-h-[90vh]">
      <div className="p-4 space-y-6">
        {/* 発言種別フィルタ */}
        <section>
          <h3 className="font-semibold text-lg mb-3 text-blue-700">■ 発言種別</h3>

          {/* 一括操作ボタン */}
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={() => handleToggleAllMessageTypes(true)}>
              全て ON
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleToggleAllMessageTypes(false)}>
              全て OFF
            </Button>
            <Button variant="outline" size="sm" onClick={handleInvertMessageTypes}>
              反転
            </Button>
          </div>

          {/* チェックボックスリスト */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(messageTypeLabels).map(([type, label]) => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={messageTypes[type as keyof MessageFilterState['messageTypes']]}
                  onChange={() =>
                    toggleMessageTypeFilter(type as keyof MessageFilterState['messageTypes'])
                  }
                  className="rounded focus:ring-blue-500"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* 発言者フィルタ */}
        <section>
          <h3 className="font-semibold text-lg mb-3 text-blue-700">■ 発言者</h3>

          {/* 一括操作ボタン */}
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={() => handleToggleAllParticipants(true)}>
              全て ON
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleToggleAllParticipants(false)}>
              全て OFF
            </Button>
            <Button variant="outline" size="sm" onClick={handleInvertParticipants}>
              反転
            </Button>
          </div>

          {/* 参加者チェックボックス */}
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {participants.map((participant) => (
              <label
                key={participant.id}
                className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
              >
                <input
                  type="checkbox"
                  checked={participantsFilter.selectedParticipantIds.includes(participant.id)}
                  onChange={() => toggleParticipantFilter(participant.id)}
                  className="rounded focus:ring-blue-500"
                />
                {/* キャラアイコン */}
                {participant.characterIcon && (
                  <Image
                    src={participant.characterIcon}
                    alt=""
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">
                    [{participant.shortName}] {participant.name}
                  </div>
                  {participant.messageCount && (
                    <div className="text-xs text-gray-500">{participant.messageCount}回</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* 宛先フィルタ */}
        <section>
          <h3 className="font-semibold text-lg mb-3 text-blue-700">■ 宛先</h3>

          {/* 一括操作ボタン */}
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm">
              全て ON
            </Button>
            <Button variant="outline" size="sm">
              全て OFF
            </Button>
            <Button variant="outline" size="sm">
              反転
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOnlyToMe(!target.onlyToMe)}
              className={target.onlyToMe ? 'bg-blue-100' : ''}
            >
              自分宛
            </Button>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            自分宛機能: {target.onlyToMe ? 'ON' : 'OFF'}
          </div>
        </section>

        {/* キーワードフィルタ */}
        <section>
          <h3 className="font-semibold text-lg mb-3 text-blue-700">■ キーワード</h3>
          <input
            type="text"
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
            placeholder="スペース区切りで複数指定可能"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            複数キーワードはOR検索（部分一致）で処理されます
          </div>
        </section>

        {/* アクションボタン */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            リセット
          </Button>
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleApply}>適用</Button>
        </div>
      </div>
    </Modal>
  )
}

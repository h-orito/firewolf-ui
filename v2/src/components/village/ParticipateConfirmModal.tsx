'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { CharacterIcon } from '@/components/common/CharacterIcon'
import { MessageContent } from './main/MessageContent'
import type { components } from '@/types/generated/api'
import { MESSAGE_TYPE_CODE, type MessageTypeCode } from '@/types/village'

type MessageType = components['schemas']['MessageType']

type VillageView = components['schemas']['VillageView']
type Chara = components['schemas']['Chara']
type Skill = components['schemas']['Skill']

interface ParticipateConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmed: () => void
  village: VillageView
  selectedCharacter: Chara
  firstRequestSkill?: Skill
  secondRequestSkill?: Skill
  participateMessage?: string
}

interface CheckItem {
  id: string
  label: string
  checked: boolean
}

/**
 * 入村確認モーダル
 *
 * 入村前の規約同意と設定確認を行うモーダル
 */
export const ParticipateConfirmModal: React.FC<ParticipateConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmed,
  village,
  selectedCharacter,
  firstRequestSkill,
  secondRequestSkill,
  participateMessage = '',
}) => {
  const [checkItems, setCheckItems] = useState<CheckItem[]>([
    {
      id: 'terms',
      label: '利用規約およびルールを確認し、禁止事項について理解しました。',
      checked: false,
    },
    {
      id: 'conduct',
      label:
        '他者への礼節を欠いたり、正常な運営を妨げる行為を行った場合、管理人の裁量により処罰される可能性があることについて理解しました。',
      checked: false,
    },
    {
      id: 'sudden_death',
      label:
        '発言可能時間および突然死の設定を確認し、進行中該当の時間に発言しなければ突然死してしまう可能性があることを理解しました。',
      checked: false,
    },
  ])

  // モーダルが開かれた時の初期化
  useEffect(() => {
    if (isOpen) {
      setCheckItems((items) => items.map((item) => ({ ...item, checked: false })))
    }
  }, [isOpen])

  // チェック項目の変更ハンドラー
  const handleCheckChange = (id: string) => {
    setCheckItems((items) =>
      items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  // 利用規約リンククリックハンドラー
  const handleTermsClick = () => {
    // 利用規約モーダルを表示（未実装）
    console.log('利用規約モーダルを表示')
  }

  // ルールリンククリックハンドラー
  const handleRuleClick = () => {
    // ルールページを別タブで開く
    window.open('/rule', '_blank')
  }

  // 全てのチェックが完了しているかどうか
  const allChecked = checkItems.every((item) => item.checked)

  // 入村ボタンのハンドラー
  const handleConfirm = async () => {
    if (!allChecked) return

    // 実際の入村処理（未実装）
    onConfirmed()
    onClose()
  }

  // キャンセル処理
  const handleCancel = () => {
    setCheckItems((items) => items.map((item) => ({ ...item, checked: false })))
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="入村確認" className="!max-w-3xl">
      <div className="space-y-6">
        {/* 選択したキャラクター・役職希望の確認 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 border rounded-lg bg-gray-50">
            <CharacterIcon
              characterName={{
                name: selectedCharacter.chara_name.name,
                short_name: selectedCharacter.chara_name.short_name,
                full_name: selectedCharacter.chara_name.name,
              }}
              size={0.5}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                [{selectedCharacter.chara_name.short_name}] {selectedCharacter.chara_name.name}
              </div>
              <div className="text-sm text-gray-600">
                役職希望:
                {firstRequestSkill ? (
                  <>
                    <span className="mx-1">{firstRequestSkill.name}</span>
                    {secondRequestSkill && (
                      <>
                        / <span className="mx-1">{secondRequestSkill.name}</span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="mx-1 text-gray-400">未選択</span>
                )}
              </div>
            </div>
          </div>

          {/* 入村発言プレビュー */}
          {participateMessage && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">入村発言プレビュー</h4>
              <div className="border rounded-lg p-3 bg-white">
                <MessageContent text={participateMessage} villageId={village.id} />
              </div>
            </div>
          )}
        </div>

        {/* 確認事項 */}
        <div className="border-t pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              以下の項目をすべて確認してください
            </h3>

            <div className="space-y-4">
              {checkItems.map((item) => (
                <label key={item.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckChange(item.id)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    {item.id === 'terms' ? (
                      <>
                        <button
                          type="button"
                          onClick={handleTermsClick}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          利用規約
                        </button>
                        および
                        <button
                          type="button"
                          onClick={handleRuleClick}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          ルール
                        </button>
                        を確認し、禁止事項について理解しました。
                      </>
                    ) : (
                      item.label
                    )}
                  </span>
                </label>
              ))}
            </div>

            {/* 村の設定情報表示（突然死設定など） */}
            <div className="mt-4 p-3 border rounded-lg bg-yellow-50">
              <h4 className="text-sm font-medium text-gray-900 mb-2">重要な設定</h4>
              <div className="text-xs text-gray-700 space-y-1">
                <div>
                  • 発言時間:{' '}
                  {village.setting.time.day_change_interval_seconds
                    ? `${Math.floor(village.setting.time.day_change_interval_seconds / 3600)}時間`
                    : '未設定'}
                </div>
                <div>
                  • 突然死: {village.setting.rules.available_suddenly_death ? '有効' : '無効'}
                </div>
                <div>• コミット: {village.setting.rules.available_commit ? '有効' : '無効'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* フッターボタン */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleConfirm} disabled={!allChecked} className="min-w-24">
            入村する
          </Button>
        </div>
      </div>
    </Modal>
  )
}

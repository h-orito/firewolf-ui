/**
 * 村情報モーダルコンポーネント
 */

'use client'

import React, { useMemo } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Card } from '@/components/ui/Card'
import { useCharachipListQuery } from '@/hooks/use-charachip-list-query'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface VillageInfoModalProps {
  /** モーダルの開閉状態 */
  isOpen: boolean
  /** モーダルを閉じるコールバック */
  onClose: () => void
  /** 村情報 */
  village: VillageView
}

/**
 * 村情報モーダル
 *
 * パスワード以外の村設定を一覧表示するモーダルコンポーネント。
 * カテゴリ別にセクション分けして見やすくレイアウト。
 */
export const VillageInfoModal: React.FC<VillageInfoModalProps> = ({ isOpen, onClose, village }) => {
  // キャラチップ一覧を取得
  const { data: charachipListData } = useCharachipListQuery()
  const charachipList = useMemo(() => charachipListData?.data?.list || [], [charachipListData])

  // 村のキャラチップ名を取得（自動生成型に存在するプロパティのみ使用）
  const charachipName = useMemo(() => {
    // キャラチップIDsから最初のキャラチップを取得
    if (village.setting.charachip.charachip_ids.length > 0) {
      const charachipId = village.setting.charachip.charachip_ids[0]
      const charachip = charachipList.find((c) => c.id === charachipId)
      if (charachip) {
        return charachip.name
      }
    }

    // フォールバック
    return '設定なし'
  }, [village.setting.charachip.charachip_ids, charachipList])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="村情報" className="!max-w-4xl !max-h-[95vh]">
      <div className="p-3 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-8 max-h-[65vh] md:max-h-[60vh] overflow-y-auto">
          {/* 左カラム */}
          <div className="space-y-3 md:space-y-4">
            {/* 基本設定 */}
            <Card>
              <div className="p-3 md:p-4">
                <h3 className="font-bold mb-3 text-blue-700">基本設定</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">村名:</span>
                    <span className="text-gray-700">{village.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">村建て:</span>
                    <span className="text-gray-700">{village.creator_player.nickname}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">ステータス:</span>
                    <span className="text-gray-700">{village.status.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">定員:</span>
                    <span className="text-gray-700">
                      {village.setting.capacity.min}〜{village.setting.capacity.max}名
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">参加者数:</span>
                    <span className="text-gray-700">
                      {village.participant.count}/{village.setting.capacity.max}名
                    </span>
                  </div>
                  {village.spectator.count > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">見学者数:</span>
                      <span className="text-gray-700">{village.spectator.count}名</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* キャラチップ設定 */}
            <Card>
              <div className="p-3 md:p-4">
                <h3 className="font-bold mb-3 text-blue-700">キャラチップ設定</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">キャラチップ:</span>
                    <span className="text-gray-700">{charachipName}</span>
                  </div>
                  {village.setting.charachip.dummy_chara_name && (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">ダミーキャラ:</span>
                      <span className="text-gray-700">
                        {village.setting.charachip.dummy_chara_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* 発言制限設定 */}
            {village.setting.rules.message_restrict.exist_restricts && (
              <Card>
                <div className="p-3 md:p-4">
                  <h3 className="font-bold mb-3 text-blue-700">発言制限設定</h3>
                  <div className="space-y-1">
                    {village.setting.rules.message_restrict.restrict_list.map((restrict, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2 text-xs">
                        <span className="font-medium">{restrict.type.name}:</span>
                        <span className="text-gray-700">
                          {restrict.count}回/日 • {restrict.length}文字/回
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* 右カラム */}
          <div className="space-y-3 md:space-y-4">
            {/* 編成設定 */}
            {Object.keys(village.setting.organizations.organization).length > 0 && (
              <Card>
                <div className="p-3 md:p-4">
                  <h3 className="font-bold mb-3 text-blue-700">編成設定</h3>
                  <div className="text-gray-700 bg-gray-50 p-3 rounded">
                    {Object.values(village.setting.organizations.organization)[0] || '設定なし'}
                  </div>
                </div>
              </Card>
            )}

            {/* ルール設定 */}
            <Card>
              <div className="p-3 md:p-4">
                <h3 className="font-bold mb-3 text-blue-700">ルール設定</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span>記名投票:</span>
                    <span
                      className={
                        village.setting.rules.open_vote ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {village.setting.rules.open_vote ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>役職希望可能:</span>
                    <span
                      className={
                        village.setting.rules.available_skill_request
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {village.setting.rules.available_skill_request ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>見学可能:</span>
                    <span
                      className={
                        village.setting.rules.available_spectate ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {village.setting.rules.available_spectate ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>墓下役職公開:</span>
                    <span
                      className={
                        village.setting.rules.open_skill_in_grave
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {village.setting.rules.open_skill_in_grave ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>突然死あり:</span>
                    <span
                      className={
                        village.setting.rules.available_suddenly_death
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {village.setting.rules.available_suddenly_death ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>時短希望可能:</span>
                    <span
                      className={
                        village.setting.rules.available_commit ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {village.setting.rules.available_commit ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ダミー役欠け:</span>
                    <span
                      className={
                        village.setting.rules.available_dummy_skill
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {village.setting.rules.available_dummy_skill ? 'あり' : 'なし'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>連続護衛:</span>
                    <span
                      className={
                        village.setting.rules.available_guard_same_target
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {village.setting.rules.available_guard_same_target ? 'あり' : 'なし'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 参加パスワード・RP設定 */}
            <div className="space-y-3 md:space-y-4">
              {/* 参加パスワード */}
              <Card>
                <div className="p-3 md:p-4">
                  <h3 className="font-bold mb-3 text-blue-700">参加パスワード</h3>
                  <p className="text-gray-700">
                    {village.setting.password.join_password_required ? '設定済み' : '設定なし'}
                  </p>
                </div>
              </Card>

              {/* RP設定 */}
              {(village.setting.rules.visible_grave_message ||
                village.setting.rules.available_action) && (
                <Card>
                  <div className="p-3 md:p-4">
                    <h3 className="font-bold mb-3 text-blue-700">RP設定</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>墓下見学会話公開:</span>
                        <span
                          className={
                            village.setting.rules.visible_grave_message
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {village.setting.rules.visible_grave_message ? 'あり' : 'なし'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>アクション発言:</span>
                        <span
                          className={
                            village.setting.rules.available_action
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {village.setting.rules.available_action ? 'あり' : 'なし'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* タグ設定 */}
              {village.setting.tags.list.length > 0 && (
                <Card>
                  <div className="p-3 md:p-4">
                    <h3 className="font-bold mb-3 text-blue-700">タグ設定</h3>
                    <div className="flex flex-wrap gap-2">
                      {village.setting.tags.list.map((tag: string, index: number) => (
                        <span key={index} className="bg-gray-200 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

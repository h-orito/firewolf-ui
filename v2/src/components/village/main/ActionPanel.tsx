/**
 * アクションパネルコンポーネント
 */

import React, { useState } from 'react'
import type { components } from '@/types/generated/api'
import { useUserSettingsStore } from '@/stores/village/user-settings-store'
import { MESSAGE_TYPE_CODE, type MessageTypeCode } from '@/types/village'
import { MessageConfirmModal } from '../MessageConfirmModal'
import { VoteConfirmModal } from '../VoteConfirmModal'
import { ParticipateAction } from '../actions/ParticipateAction'
import { SpectateAction } from '../actions/SpectateAction'
import { LeaveAction } from '../actions/LeaveAction'
import { ActionSayAction } from '../actions/ActionSayAction'
import { ChangeNameAction } from '../actions/ChangeNameAction'
import { SkillRequestAction } from '../actions/SkillRequestAction'
import { ComingoutAction } from '../actions/ComingoutAction'
import { CommitAction } from '../actions/CommitAction'
import { CreatorActions } from '../actions/CreatorActions'
import { AdminActions } from '../actions/AdminActions'
import { DebugActions } from '../actions/DebugActions'
import { AbilityActions } from '../actions/AbilityActions'
import { useVoteMutation } from '@/hooks/village/use-vote-mutation'
import { useAbilityMutation } from '@/hooks/village/use-ability-mutation'
import { useParticipateSituationQuery } from '@/hooks/use-participate-situation-query'
import { CollapsiblePanel } from '@/components/ui/CollapsiblePanel'

type MessageType = components['schemas']['MessageType']

type VillageView = components['schemas']['VillageView']

interface ActionPanelProps {
  /** 村情報 */
  village: VillageView
  /** ログインユーザー情報 */
  user?: any
}

/**
 * アクションパネル
 *
 * 発言、投票、能力行使などのアクション機能を提供
 * 権限ベースで表示制御を行う
 * 暫定実装
 */
export const ActionPanel: React.FC<ActionPanelProps> = ({ village, user }) => {
  const [activeTab, setActiveTab] = useState<'say' | 'vote' | 'ability' | 'other'>('say')
  const [messageContent, setMessageContent] = useState('')
  const [messageType, setMessageType] = useState<MessageTypeCode>(MESSAGE_TYPE_CODE.NORMAL_SAY)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedVoteTarget, setSelectedVoteTarget] = useState<number | null>(null)
  const [showVoteConfirmModal, setShowVoteConfirmModal] = useState(false)
  const [selectedAbilityTarget, setSelectedAbilityTarget] = useState<number | null>(null)
  const [selectedAbilityType, setSelectedAbilityType] = useState<string>('')

  const voteMutation = useVoteMutation()
  const abilityMutation = useAbilityMutation()

  // 参加状況を取得
  const { data: participateSituation } = useParticipateSituationQuery(village.id.toString())

  // ユーザー設定から固定表示設定を取得
  const { operation } = useUserSettingsStore()

  const isParticipant =
    user && village.participant.member_list.some((p) => p.player?.id === user.uid)
  const isSpectator = user && village.spectator.member_list.some((s) => s.player?.id === user.uid)

  // 村建て権限チェック
  const isCreator = user && village.creator_player.id === user.uid

  // 管理者権限チェック（実際の実装では適切な権限チェックロジックを実装）
  const isAdmin = user && (user.role === 'admin' || user.isAdmin)

  const handleSubmitMessage = () => {
    if (!messageContent.trim()) return

    // 確認モーダルを開く
    setShowConfirmModal(true)
  }

  // 確認モーダルで確認が完了した際の処理
  const handleConfirmed = () => {
    setMessageContent('')
    setShowConfirmModal(false)
  }

  // 現在のユーザー情報を取得（プレビュー用）
  const getCurrentUser = () => {
    if (isParticipant) {
      const participant = village.participant.member_list.find((p) => p.player?.id === user.uid)
      return {
        characterName: participant?.chara.chara_name.name || 'キャラクター',
        characterImageUrl: '',
        playerName: participant?.player?.nickname || 'あなた',
      }
    }
    return {
      characterName: 'プレビューキャラ',
      characterImageUrl: '',
      playerName: 'あなた',
    }
  }

  // デコレーション挿入処理
  const handleDecorationClick = (tag: string) => {
    const textArea = document.querySelector(
      'textarea[placeholder="発言を入力してください..."]'
    ) as HTMLTextAreaElement
    const start = textArea.selectionStart
    const end = textArea.selectionEnd
    const selectedText = textArea.value.substring(start, end)

    let insertText = ''
    if (tag === 'ruby') {
      // ルビ専用の処理
      insertText = `[[ruby]]${selectedText || 'テキスト'}[[rt]]よみがな[[/rt]][[/ruby]]`
    } else {
      // 通常の装飾タグ
      insertText = `[[${tag}]]${selectedText || 'テキスト'}[[/${tag}]]`
    }

    const newText = textArea.value.substring(0, start) + insertText + textArea.value.substring(end)
    setMessageContent(newText)

    // カーソル位置を調整
    setTimeout(() => {
      if (selectedText) {
        textArea.setSelectionRange(start + insertText.length, start + insertText.length)
      } else {
        const newStart = tag === 'ruby' ? start + `[[ruby]]`.length : start + `[[${tag}]]`.length
        const newEnd = tag === 'ruby' ? newStart + 'テキスト'.length : newStart + 'テキスト'.length
        textArea.setSelectionRange(newStart, newEnd)
      }
      textArea.focus()
    }, 0)
  }

  // 参加・見学完了時のハンドラー
  const handleParticipated = () => {
    // 参加完了後の処理（必要に応じて実装）
    console.log('参加完了')
  }

  const handleSpectated = () => {
    // 見学開始後の処理（必要に応じて実装）
    console.log('見学開始')
  }

  // 退村完了時のハンドラー
  const handleLeft = () => {
    // 退村完了後の処理（必要に応じて実装）
    console.log('退村完了')
  }

  // 共通のコンテナクラス（固定表示設定に応じてスタイルを変更）
  const containerClass = operation.fixedActionPanel
    ? 'bg-white rounded-lg shadow sticky bottom-4 z-10'
    : 'bg-white rounded-lg shadow'

  // 未ログイン時
  if (!user) {
    return (
      <div className={containerClass}>
        <div className="p-4">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium text-gray-900">ログインが必要です</h3>
            <p className="text-sm text-gray-600">村に参加するには、まずログインしてください。</p>
            <button
              onClick={() => {
                // ログインモーダルを開く処理（実装時に追加）
                console.log('ログインモーダルを開く')
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ログイン
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 参加者でも見学者でもない場合（村への参加・見学選択）
  if (!isParticipant && !isSpectator) {
    return (
      <>
        <div className={containerClass}>
          <div className="p-4">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-gray-900">村への参加</h3>
              <p className="text-sm text-gray-600">
                この村に参加するか、見学するかを選択してください。
              </p>
              <div className="space-y-3">
                <ParticipateAction
                  village={village}
                  user={user}
                  onParticipated={handleParticipated}
                />
                <SpectateAction village={village} user={user} onSpectated={handleSpectated} />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // 参加者の場合
  if (isParticipant) {
    return (
      <>
        <div className={containerClass}>
          {/* タブ選択 */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {['say', 'vote', 'ability', 'other'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-2 px-4 text-sm font-medium border-b-2 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'say' && '発言'}
                  {tab === 'vote' && '投票'}
                  {tab === 'ability' && '能力'}
                  {tab === 'other' && 'その他'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4">
            {/* 発言タブ */}
            {activeTab === 'say' && (
              <div className="space-y-4">
                {/* 発言種別選択 */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">発言種別</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'NORMAL_SAY', label: '通常発言', icon: 'fa-comment' },
                      { value: 'WEREWOLF_SAY', label: '人狼の囁き', icon: 'fa-paw' },
                      { value: 'SYMPATHIZE_SAY', label: '共鳴発言', icon: 'fa-wave-square' },
                      { value: 'GRAVE_SAY', label: '死者の呻き', icon: 'fa-skull' },
                      { value: 'MONOLOGUE_SAY', label: '独り言', icon: 'fa-comment-dots' },
                      { value: 'SPECTATE_SAY', label: '見学発言', icon: 'fa-eye' },
                    ].map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                          messageType === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="messageType"
                          value={type.value}
                          checked={messageType === type.value}
                          onChange={(e) => setMessageType(e.target.value as MessageTypeCode)}
                          className="sr-only"
                        />
                        <i className={`fas ${type.icon} text-sm mr-1`}></i>
                        <span className="text-xs text-gray-700 leading-tight">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">発言内容</label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="発言を入力してください..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <div
                      className={`text-xs ${messageContent.length > 400 ? 'text-red-500' : 'text-gray-500'}`}
                    >
                      {messageContent.length}/400文字
                      {messageContent.length > 400 && (
                        <span className="ml-2 text-red-500">文字数制限を超えています</span>
                      )}
                    </div>
                    {messageContent.trim() && messageContent.length <= 400 && (
                      <div className="text-xs text-green-600">✓ 送信可能</div>
                    )}
                  </div>
                </div>

                {/* デコレーションツールバー */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">装飾機能</label>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    {[
                      { tag: 'b', label: '太字', icon: 'fa-bold' },
                      { tag: 'large', label: '大文字', icon: 'fa-search-plus' },
                      { tag: 'small', label: '小文字', icon: 'fa-search-minus' },
                      { tag: 's', label: '打消線', icon: 'fa-strikethrough' },
                      { tag: 'ruby', label: 'ルビ', icon: 'fa-language' },
                      { tag: 'cw', label: '隠し文字', icon: 'fa-eye-slash' },
                    ].map((decoration) => (
                      <button
                        key={decoration.tag}
                        onClick={() => handleDecorationClick(decoration.tag)}
                        className="flex items-center justify-center p-2 border border-gray-200 rounded hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        title={`${decoration.label} [[${decoration.tag}]]text[[/${decoration.tag}]]`}
                      >
                        <i className={`fas ${decoration.icon} text-xs mr-1`}></i>
                        <span className="text-xs text-gray-700">{decoration.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmitMessage}
                  disabled={!messageContent.trim() || messageContent.length > 400}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {messageContent.length > 400 ? '文字数制限超過' : '発言する'}
                </button>
              </div>
            )}

            {/* 投票タブ */}
            {activeTab === 'vote' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">投票</h3>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">投票先を選択</label>
                  <div className="space-y-2">
                    {village.participant.member_list
                      .filter(
                        (participant) => !participant.dead && participant.player?.id !== user?.uid
                      )
                      .map((participant) => (
                        <label
                          key={participant.id}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedVoteTarget === participant.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="voteTarget"
                            value={participant.id}
                            checked={selectedVoteTarget === participant.id}
                            onChange={(e) => setSelectedVoteTarget(Number(e.target.value))}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {participant.chara_name.short_name || participant.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {participant.chara_name.name || participant.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {participant.player?.nickname || 'プレイヤー'}
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (selectedVoteTarget) {
                      setShowVoteConfirmModal(true)
                    }
                  }}
                  disabled={!selectedVoteTarget}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {selectedVoteTarget ? '投票する' : '投票先を選択してください'}
                </button>
              </div>
            )}

            {/* 能力タブ - 新しいAbilityActionsコンポーネントを使用 */}
            {activeTab === 'ability' && <AbilityActions village={village} user={user} />}

            {/* その他タブ */}
            {activeTab === 'other' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">その他のアクション</h3>
                <div className="space-y-3">
                  <ActionSayAction
                    village={village}
                    user={user}
                    onMessagePosted={() => {
                      // アクション発言投稿後の処理（必要に応じて実装）
                      console.log('アクション発言投稿完了')
                    }}
                  />
                  <ChangeNameAction
                    village={village}
                    user={user}
                    onNameChanged={() => {
                      // 名前変更後の処理（必要に応じて実装）
                      console.log('名前変更完了')
                    }}
                  />
                  {participateSituation && (
                    <SkillRequestAction
                      village={village}
                      user={user}
                      situation={participateSituation}
                      onSkillRequestChanged={() => {
                        // 役職希望変更後の処理（必要に応じて実装）
                        console.log('役職希望変更完了')
                      }}
                    />
                  )}
                  {participateSituation && (
                    <ComingoutAction
                      village={village}
                      user={user}
                      situation={participateSituation}
                      onComingOutChanged={() => {
                        // カミングアウト変更後の処理（必要に応じて実装）
                        console.log('カミングアウト変更完了')
                      }}
                    />
                  )}
                  {participateSituation && (
                    <CommitAction
                      village={village}
                      user={user}
                      situation={participateSituation}
                      onCommitChanged={() => {
                        // コミット変更後の処理（必要に応じて実装）
                        console.log('コミット変更完了')
                      }}
                    />
                  )}
                  <LeaveAction village={village} user={user} onLeft={handleLeft} />

                  {/* 新しい特権アクション */}
                  {isCreator && (
                    <div className="border-t pt-4">
                      <CollapsiblePanel
                        title="村建て専用"
                        defaultOpen={false}
                        titleClassName="text-sm bg-orange-50 border border-orange-200"
                        contentClassName="space-y-2"
                      >
                        <CreatorActions village={village} user={user} />
                      </CollapsiblePanel>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="border-t pt-4">
                      <CollapsiblePanel
                        title="管理者専用"
                        defaultOpen={false}
                        titleClassName="text-sm bg-red-50 border border-red-200"
                        contentClassName="space-y-2"
                      >
                        <AdminActions village={village} user={user} />
                      </CollapsiblePanel>
                    </div>
                  )}

                  {(isAdmin || process.env.NODE_ENV === 'development') && (
                    <div className="border-t pt-4">
                      <CollapsiblePanel
                        title="デバッグ機能"
                        defaultOpen={false}
                        titleClassName="text-sm bg-gray-50 border border-gray-200"
                        contentClassName="space-y-2"
                      >
                        <DebugActions village={village} user={user} />
                      </CollapsiblePanel>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 発言確認モーダル（参加者用） */}
        <MessageConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirmed={handleConfirmed}
          village={village}
          preview={{
            content: messageContent,
            messageType: messageType,
            ...getCurrentUser(),
          }}
        />

        {/* 投票確認モーダル */}
        <VoteConfirmModal
          isOpen={showVoteConfirmModal}
          onClose={() => setShowVoteConfirmModal(false)}
          onConfirmed={() => {
            if (selectedVoteTarget) {
              voteMutation.mutate(
                {
                  villageId: village.id,
                  targetId: selectedVoteTarget,
                },
                {
                  onSuccess: () => {
                    setShowVoteConfirmModal(false)
                    setSelectedVoteTarget(null)
                  },
                }
              )
            }
          }}
          target={
            selectedVoteTarget
              ? village.participant.member_list.find((p) => p.id === selectedVoteTarget) || null
              : null
          }
          isLoading={voteMutation.isPending}
        />
      </>
    )
  }

  // 見学者の場合
  if (isSpectator) {
    return (
      <>
        <div className={containerClass}>
          <div className="p-4">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-gray-900">見学中</h3>
              <p className="text-sm text-gray-600">あなたは現在この村を見学しています。</p>
              {/* 見学者用の発言機能（暫定実装） */}
              <div className="space-y-2">
                <textarea
                  placeholder="見学発言を入力..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <button className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                  見学発言する
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // フォールバック（通常はここに到達しない）
  return null
}

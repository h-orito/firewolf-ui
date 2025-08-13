/**
 * 投票確認モーダルコンポーネント
 */

import React from 'react'
import { Modal } from '@/components/ui/Modal'
import type { components } from '@/types/generated/api'

type VillageParticipantView = components['schemas']['VillageParticipantView']

interface VoteConfirmModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean
  /** モーダルを閉じるハンドラー */
  onClose: () => void
  /** 投票が確認された際のハンドラー */
  onConfirmed: () => void
  /** 投票対象の参加者 */
  target: VillageParticipantView | null
  /** 投票実行中フラグ */
  isLoading?: boolean
}

/**
 * 投票確認モーダル
 *
 * 投票対象を確認し、投票を実行するかユーザーに確認を求める
 */
export const VoteConfirmModal: React.FC<VoteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmed,
  target,
  isLoading = false,
}) => {
  if (!target) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="投票確認">
      <div className="space-y-4">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-2">
              <span className="text-xl font-medium">
                {target.chara_name?.short_name || target.name?.charAt(0)}
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {target.chara_name?.name || target.name}
            </h3>
            <p className="text-sm text-gray-500">{target.player?.nickname || 'プレイヤー'}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">投票確認</h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p>上記のキャラクターに投票しますか？</p>
                  <p className="mt-1 text-xs">投票は一度行うと変更できません。</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirmed}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isLoading ? '投票中...' : '投票する'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

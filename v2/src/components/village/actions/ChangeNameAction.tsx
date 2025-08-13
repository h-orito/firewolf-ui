/**
 * 名前変更アクションコンポーネント
 */

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { apiClient } from '@/lib/api/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParticipateSituationQuery } from '@/hooks/use-participate-situation-query'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface ChangeNameActionProps {
  /** 村情報 */
  village: VillageView
  /** ユーザー情報 */
  user: any
  /** 名前変更完了時のコールバック */
  onNameChanged?: () => void
}

/**
 * 名前変更アクション
 *
 * キャラクターの名前（フルネーム・短縮名）を変更する機能
 */
export const ChangeNameAction: React.FC<ChangeNameActionProps> = ({
  village,
  user,
  onNameChanged,
}) => {
  const queryClient = useQueryClient()

  // モーダル表示状態
  const [showDialog, setShowDialog] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  // フォーム状態
  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')

  // 参加状況を取得
  const { data: participateSituation } = useParticipateSituationQuery(village.id.toString())

  // 参加者として村にいるかどうかの確認
  const participant = village.participant?.member_list?.find((p) => p.player?.id === user?.uid)
  const isParticipant = !!participant

  // 名前変更が利用可能かどうかの確認
  const canChangeName = participateSituation?.rp?.is_available_change_name || false

  // 名前変更が利用可能でない場合は表示しない
  if (!isParticipant || !canChangeName) {
    return null
  }

  // ダイアログを開く処理
  const handleOpenDialog = () => {
    // 現在の名前を初期値として設定
    setName(participant?.chara?.chara_name?.name || '')
    setShortName(participant?.chara?.chara_name?.short_name || '')
    setShowDialog(true)
  }

  // 名前変更処理
  const handleChangeName = async () => {
    if (!name.trim() || !shortName.trim()) {
      alert('名前と短縮名を両方入力してください。')
      return
    }

    setIsChanging(true)

    try {
      // 名前変更APIを呼び出し
      const { data, error } = await apiClient.POST('/village/{villageId}/change-name', {
        params: {
          path: {
            villageId: village.id,
          },
        },
        body: {
          name: name.trim(),
          short_name: shortName.trim(),
        },
      })

      if (error) {
        // エラー処理
        console.error('名前変更エラー:', error)
        alert('名前変更に失敗しました。')
        return
      }

      // 成功時の処理
      // 村情報を再取得
      await queryClient.invalidateQueries({ queryKey: ['village', village.id] })
      await queryClient.invalidateQueries({ queryKey: ['village-participants', village.id] })

      // モーダルを閉じる
      setShowDialog(false)

      // コールバック実行
      onNameChanged?.()

      alert('名前を変更しました。')
    } catch (error) {
      console.error('名前変更エラー:', error)
      alert('名前変更処理中にエラーが発生しました。')
    } finally {
      setIsChanging(false)
    }
  }

  // キャンセル処理
  const handleCancel = () => {
    setShowDialog(false)
    // フォームをリセット
    setName('')
    setShortName('')
  }

  // バリデーション
  const isValid = name.trim().length > 0 && shortName.trim().length > 0

  return (
    <>
      {/* 名前変更ボタン */}
      <div className="space-y-2 p-4 border rounded-lg bg-blue-50 border-blue-200">
        <h4 className="font-medium text-blue-900">名前変更</h4>
        <div className="text-sm text-blue-700 mb-3">
          現在の名前: {participant?.chara?.chara_name?.name} (
          {participant?.chara?.chara_name?.short_name})
        </div>
        <Button
          onClick={handleOpenDialog}
          disabled={isChanging}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          名前を変更する
        </Button>
      </div>

      {/* 名前変更ダイアログ */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>名前変更</DialogTitle>
            <DialogDescription>
              キャラクターの名前を変更します。村内での表示名が変わります。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* フルネーム入力 */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                名前
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="フルネームを入力"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isChanging}
                maxLength={20}
              />
              <div className="text-xs text-gray-500">{name.length}/20文字</div>
            </div>

            {/* 短縮名入力 */}
            <div className="space-y-2">
              <label htmlFor="shortName" className="text-sm font-medium text-gray-700">
                短縮名
              </label>
              <input
                id="shortName"
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="短縮名を入力"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isChanging}
                maxLength={5}
              />
              <div className="text-xs text-gray-500">{shortName.length}/5文字</div>
            </div>

            {/* 注意事項 */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ 名前変更は村の設定によって制限される場合があります。
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={isChanging}>
              キャンセル
            </Button>
            <Button
              onClick={handleChangeName}
              disabled={isChanging || !isValid}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isChanging ? '変更中...' : '名前を変更'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

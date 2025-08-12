'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { useAuth } from '@/hooks/useAuth'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']
type MessageType = components['schemas']['MessageType']
type VillageSaySituationView = components['schemas']['VillageSaySituationView']

interface MessagePostFormProps {
  village: VillageView
  saySituation?: VillageSaySituationView | null
  onMessagePosted?: () => void
}

export function MessagePostForm({ village, saySituation, onMessagePosted }: MessagePostFormProps) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('')
  const [selectedMessageType, setSelectedMessageType] = useState<string>('')
  const [selectedFaceType, setSelectedFaceType] = useState<string>('')

  // メッセージ投稿のミューテーション
  const messageMutation = useMutation({
    mutationFn: async ({
      isConfirm,
      messageType,
      faceType,
    }: {
      isConfirm: boolean
      messageType: string
      faceType: string
    }) => {
      if (isConfirm) {
        const { data, error } = await apiClient.POST('/village/{villageId}/say-confirm', {
          params: {
            path: { villageId: village.id },
          },
          body: {
            message: message.trim(),
            message_type: messageType,
            face_type: faceType,
          },
        })
        if (error) {
          throw new Error('メッセージの投稿に失敗しました')
        }
        return data
      } else {
        const { data, error } = await apiClient.POST('/village/{villageId}/say', {
          params: {
            path: { villageId: village.id },
          },
          body: {
            message: message.trim(),
            message_type: messageType,
            face_type: faceType,
          },
        })
        if (error) {
          throw new Error('メッセージの投稿に失敗しました')
        }
        return data
      }
    },
    onSuccess: (_, { isConfirm }) => {
      // 送信成功時はメッセージをクリア（確認の場合を除く）
      if (!isConfirm) {
        setMessage('')
        // メッセージリストのキャッシュを無効化して再取得を促す
        queryClient.invalidateQueries({ queryKey: ['villageMessages', village.id.toString()] })
        // 親コンポーネントに通知
        onMessagePosted?.()
      }
    },
    onError: (error) => {
      console.error('Failed to post message:', error)
    },
  })

  // ログインしていない場合は表示しない
  if (!isAuthenticated) {
    return null
  }

  // 発言可能でない場合は表示しない
  if (!saySituation?.available_say) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-gray-500">
          <p>現在は発言できません</p>
        </CardContent>
      </Card>
    )
  }

  // デフォルトのメッセージタイプとキャラクタータイプを設定
  const defaultMessageType =
    saySituation.default_message_type?.code ||
    saySituation.selectable_message_type_list[0]?.message_type?.code ||
    ''

  const currentMessageType = selectedMessageType || defaultMessageType
  const currentFaceType = selectedFaceType || saySituation.selectable_face_type_list[0]?.type || ''

  // 文字数カウント
  const messageLength = message.length
  const currentMessageTypeInfo = saySituation?.selectable_message_type_list.find(
    (item) => item.message_type.code === currentMessageType
  )
  const maxLength = currentMessageTypeInfo?.restrict.max_length ?? 400

  // 送信処理
  const handleSubmit = (isConfirm: boolean = false) => {
    if (!message.trim()) return
    if (messageLength > maxLength) return

    messageMutation.mutate({
      isConfirm,
      messageType: currentMessageType,
      faceType: currentFaceType,
    })
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="text-sm font-medium text-gray-700">発言</div>

        {/* メッセージタイプ選択 */}
        {saySituation.selectable_message_type_list.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">発言種別</label>
            <Select
              value={currentMessageType}
              onChange={(e) => setSelectedMessageType(e.target.value)}
            >
              {saySituation.selectable_message_type_list.map(({ message_type }) => (
                <option key={message_type.code} value={message_type.code}>
                  {message_type.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* キャラクター表情選択 */}
        {saySituation.selectable_face_type_list.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">表情</label>
            <Select value={currentFaceType} onChange={(e) => setSelectedFaceType(e.target.value)}>
              {saySituation.selectable_face_type_list.map((face) => (
                <option key={face.type} value={face.type}>
                  {face.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* メッセージ入力欄 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">メッセージ</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージを入力してください..."
            className="min-h-[100px] font-mono"
            maxLength={maxLength}
          />
          <div className="flex justify-between items-center text-sm">
            <div className={`${messageLength > maxLength ? 'text-red-600' : 'text-gray-500'}`}>
              {messageLength} / {maxLength}
            </div>
            {messageLength > maxLength && (
              <div className="text-red-600">文字数が制限を超えています</div>
            )}
          </div>
        </div>

        {/* 発言時間情報は別の場所で表示される可能性があるためコメントアウト */}
        {/* {saySituation.sayableTime && (
          <div className="text-xs text-gray-500">
            発言可能時間: {saySituation.sayableTime}
          </div>
        )} */}

        {/* 送信ボタン */}
        <div className="flex gap-2">
          <Button
            onClick={() => handleSubmit(true)}
            disabled={!message.trim() || messageLength > maxLength || messageMutation.isPending}
            variant="outline"
            className="flex-1"
          >
            {messageMutation.isPending ? '確認中...' : '確認'}
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            disabled={!message.trim() || messageLength > maxLength || messageMutation.isPending}
            className="flex-1"
          >
            {messageMutation.isPending ? '送信中...' : '発言'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

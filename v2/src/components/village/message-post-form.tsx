'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']
type MessageType = components['schemas']['MessageType']
type VillageSaySituationView = components['schemas']['VillageSaySituationView']

interface MessagePostFormProps {
  village: VillageView
  saySituation?: VillageSaySituationView | null
}

export function MessagePostForm({ village, saySituation }: MessagePostFormProps) {
  const { isAuthenticated } = useAuth()
  const [message, setMessage] = useState('')
  const [selectedMessageType, setSelectedMessageType] = useState<string>('')
  const [selectedFaceType, setSelectedFaceType] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ログインしていない場合は表示しない
  if (!isAuthenticated) {
    return null
  }

  // 発言可能でない場合は表示しない
  if (!saySituation?.availableSay) {
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
    saySituation.defaultMessageType?.code ||
    saySituation.selectableMessageTypeList[0]?.messageType?.code ||
    ''

  const currentMessageType = selectedMessageType || defaultMessageType
  const currentFaceType = selectedFaceType || saySituation.selectableFaceTypeList[0]?.type || ''

  // 文字数カウント
  const messageLength = message.length
  const currentMessageTypeInfo = saySituation?.selectableMessageTypeList.find(
    (item) => item.messageType.code === currentMessageType
  )
  const maxLength = currentMessageTypeInfo?.restrict.maxLength ?? 400

  // 送信処理
  const handleSubmit = async (isConfirm: boolean = false) => {
    if (!message.trim()) return
    if (messageLength > maxLength) return

    setIsSubmitting(true)
    try {
      // TODO: API呼び出しの実装
      console.log('Message submission:', {
        message: message.trim(),
        messageType: currentMessageType,
        faceType: currentFaceType,
        isConfirm,
        villageId: village.id,
      })

      // 送信成功時はメッセージをクリア
      if (!isConfirm) {
        setMessage('')
      }
    } catch (error) {
      console.error('Failed to post message:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="text-sm font-medium text-gray-700">発言</div>

        {/* メッセージタイプ選択 */}
        {saySituation.selectableMessageTypeList.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">発言種別</label>
            <Select
              value={currentMessageType}
              onChange={(e) => setSelectedMessageType(e.target.value)}
            >
              {saySituation.selectableMessageTypeList.map(({ messageType }) => (
                <option key={messageType.code} value={messageType.code}>
                  {messageType.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* キャラクター表情選択 */}
        {saySituation.selectableFaceTypeList.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">表情</label>
            <Select value={currentFaceType} onChange={(e) => setSelectedFaceType(e.target.value)}>
              {saySituation.selectableFaceTypeList.map((face) => (
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
            disabled={!message.trim() || messageLength > maxLength || isSubmitting}
            variant="outline"
            className="flex-1"
          >
            {isSubmitting ? '確認中...' : '確認'}
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            disabled={!message.trim() || messageLength > maxLength || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '送信中...' : '発言'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

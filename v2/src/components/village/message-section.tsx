'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { useVillageMessagesQuery } from '@/hooks/useVillageMessagesQuery'
import { useVillageSaySituationQuery } from '@/hooks/useVillageSaySituationQuery'
import { VillageMessage } from '@/components/ui/village-message'
import { MessagePostForm } from '@/components/village/message-post-form'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']
type VillageDayView = components['schemas']['VillageDayView']
type MessageView = components['schemas']['MessageView']

interface MessageSectionProps {
  village: VillageView
}

interface DayTabProps {
  day: VillageDayView
  isActive: boolean
  onClick: () => void
}

function DayTab({ day, isActive, onClick }: DayTabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
      }`}
    >
      {day.day === 0 ? 'プロローグ' : `${day.day}日目`}
      <span className="ml-1 text-xs">({day.noonnight === 'noon' ? '昼' : '夜'})</span>
    </button>
  )
}

export function MessageSection({ village }: MessageSectionProps) {
  const queryClient = useQueryClient()
  const [selectedDay, setSelectedDay] = useState<VillageDayView | null>(null)

  // 最新の日を初期選択として設定
  useEffect(() => {
    if (village.day.dayList.length > 0 && !selectedDay) {
      const latestDay = village.day.dayList[village.day.dayList.length - 1]
      setSelectedDay(latestDay)
    }
  }, [village.day.dayList, selectedDay])

  const {
    data: messages,
    isLoading,
    error,
  } = useVillageMessagesQuery(
    village.id.toString(),
    selectedDay?.day ?? 0,
    selectedDay?.noonnight ?? 'noon',
    undefined,
    village.status
  )

  const { data: saySituation } = useVillageSaySituationQuery(village.id.toString())

  if (!selectedDay) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">日程情報がありません</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* 日程タブ */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">メッセージ</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 border-b border-gray-200 -mb-px">
            {village.day.dayList.map((day) => (
              <DayTab
                key={`${day.day}-${day.noonnight}`}
                day={day}
                isActive={selectedDay.id === day.id}
                onClick={() => setSelectedDay(day)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* メッセージリスト */}
      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">メッセージを読み込み中...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">メッセージの取得に失敗しました</p>
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:underline"
              >
                再読み込み
              </button>
            </div>
          )}

          {messages && (
            <>
              {messages.list.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>まだメッセージがありません</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {messages.list.map((message, index) => (
                    <div key={index} className="p-4">
                      <VillageMessage message={message} />
                    </div>
                  ))}
                </div>
              )}

              {/* ページネーション情報 */}
              {messages.allPageCount && messages.allPageCount > 1 && (
                <div className="p-4 border-t bg-gray-50 text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    {messages.currentPageNum} / {messages.allPageCount} ページ （全
                    {messages.allRecordCount}件）
                  </div>
                  <div className="flex justify-center gap-2">
                    {messages.existPrePage && (
                      <Button variant="outline" size="sm">
                        前のページ
                      </Button>
                    )}
                    {messages.existNextPage && (
                      <Button variant="outline" size="sm">
                        次のページ
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* メッセージ投稿フォーム */}
      <MessagePostForm
        village={village}
        saySituation={saySituation}
        onMessagePosted={() => {
          // 現在選択中の日のメッセージを再取得
          queryClient.invalidateQueries({
            queryKey: [
              'villageMessages',
              village.id.toString(),
              selectedDay?.day,
              selectedDay?.noonnight,
            ],
          })
        }}
      />
    </div>
  )
}

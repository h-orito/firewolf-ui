/**
 * 管理者専用アクションコンポーネント
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { CharacterIcon } from '@/components/common/CharacterIcon'
import type { components } from '@/types/generated/api'

type VillageView = components['schemas']['VillageView']

interface AdminActionsProps {
  /** 村情報 */
  village: VillageView
  /** ログインユーザー情報 */
  user?: any
}

/**
 * 管理者専用アクション
 *
 * 参加者情報表示、村の状態確認などの管理機能を提供
 */
export const AdminActions: React.FC<AdminActionsProps> = ({ village, user }) => {
  const [showParticipantInfo, setShowParticipantInfo] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null)

  // 管理者権限チェック（実際の実装では適切な権限チェックロジックを実装）
  const isAdmin = user && (user.role === 'admin' || user.isAdmin)

  const handleShowParticipantInfo = (participant: any) => {
    setSelectedParticipant(participant)
    setShowParticipantInfo(true)
  }

  const getParticipantDetailInfo = (participant: any) => {
    if (!participant) return null

    return {
      playerId: participant.player?.id,
      playerName: participant.player?.nickname,
      characterName: participant.chara?.chara_name?.name,
      characterId: participant.chara?.id,
      joinedAt: participant.created_datetime,
      lastActivity: participant.last_access_datetime,
      ipAddress: participant.player?.ip_address || '非表示',
      userAgent: participant.player?.user_agent || '非表示',
      status: participant.status,
      skillRequest: participant.skill_request,
      memo: participant.memo,
    }
  }

  if (!isAdmin) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">管理者権限が必要です</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 村情報 */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">村情報</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">村ID:</span>
            <span>{village.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">作成者ID:</span>
            <span>{village.creator_player?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">現在の状態:</span>
            <span>
              {typeof village.status === 'string' ? village.status : village.status?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">参加者数:</span>
            <span>{village.participant?.member_list?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">見学者数:</span>
            <span>{village.spectator?.member_list?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* 参加者一覧 */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">参加者管理</h4>
        <div className="space-y-2">
          {village.participant?.member_list?.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                <CharacterIcon participant={participant} size="sm" />
                <div>
                  <div className="text-sm font-medium">{participant.chara?.chara_name?.name}</div>
                  <div className="text-xs text-gray-500">
                    {participant.player?.nickname} (ID: {participant.player?.id})
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleShowParticipantInfo(participant)}
                variant="outline"
                size="sm"
              >
                詳細
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 見学者一覧 */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">見学者管理</h4>
        <div className="space-y-2">
          {village.spectator?.member_list?.map((spectator) => (
            <div
              key={spectator.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="text-sm">
                {spectator.player?.nickname} (ID: {spectator.player?.id})
              </div>
              <Button
                onClick={() => handleShowParticipantInfo(spectator)}
                variant="outline"
                size="sm"
              >
                詳細
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* システム情報 */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">システム情報</h4>
        <div className="space-y-2 text-sm"></div>
      </div>

      {/* 参加者詳細情報ダイアログ */}
      <Dialog open={showParticipantInfo} onOpenChange={setShowParticipantInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>参加者詳細情報</DialogTitle>
          </DialogHeader>
          {selectedParticipant && (
            <div className="space-y-4">
              {(() => {
                const info = getParticipantDetailInfo(selectedParticipant)
                if (!info) return null

                return (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CharacterIcon participant={selectedParticipant} size="md" />
                      <div>
                        <div className="font-medium">{info.characterName}</div>
                        <div className="text-sm text-gray-500">{info.playerName}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">プレイヤーID:</span>
                        <div>{info.playerId}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">キャラクターID:</span>
                        <div>{info.characterId}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">参加日時:</span>
                        <div>{info.joinedAt}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">最終アクセス:</span>
                        <div>{info.lastActivity}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">IPアドレス:</span>
                        <div className="font-mono text-xs">{info.ipAddress}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">UserAgent:</span>
                        <div className="font-mono text-xs truncate" title={info.userAgent}>
                          {info.userAgent}
                        </div>
                      </div>
                    </div>

                    {info.skillRequest && (
                      <div>
                        <span className="text-gray-600">役職希望:</span>
                        <div className="text-sm">
                          第1希望: {info.skillRequest.first || '未設定'}
                          <br />
                          第2希望: {info.skillRequest.second || '未設定'}
                        </div>
                      </div>
                    )}

                    {info.memo && (
                      <div>
                        <span className="text-gray-600">メモ:</span>
                        <div className="text-sm bg-gray-50 p-2 rounded">{info.memo}</div>
                      </div>
                    )}
                  </div>
                )
              })()}

              <div className="flex justify-end">
                <Button onClick={() => setShowParticipantInfo(false)} variant="outline">
                  閉じる
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { ToggleSlider } from '@/components/ui/ToggleSlider'
import React, { useState } from 'react'

import { useUserSettingsStore } from '@/stores/village'

interface UserSettingsModalProps {
  /** モーダルが開いているかどうか */
  isOpen: boolean
  /** モーダルを閉じるコールバック */
  onClose: () => void
}

/**
 * ユーザー設定詳細モーダル
 *
 * 詳細な表示設定、操作設定、Webhook設定を管理
 */
export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    display,
    operation,
    webhook,
    updateDisplaySettings,
    updateOperationSettings,
    updateWebhookSettings,
  } = useUserSettingsStore()

  const [activeTab, setActiveTab] = useState<'display' | 'operation' | 'webhook'>('display')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 設定保存処理（実際の実装では適切なAPI呼び出しを行う）
      console.log('設定を保存:', { display, operation, webhook })

      // Cookie保存は自動で行われる（user-settings-store内で実装済み）

      onClose()
    } catch (error) {
      console.error('設定保存エラー:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ユーザー設定"
      className="!max-w-5xl !max-h-[90vh]"
    >
      <div className="space-y-6">
        {/* タブナビゲーション */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'display', label: '表示設定', icon: 'fa-eye' },
              { id: 'operation', label: '操作設定', icon: 'fa-cog' },
              { id: 'webhook', label: 'Webhook設定', icon: 'fa-link' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 表示設定タブ */}
        {activeTab === 'display' && (
          <div className="space-y-6">
            {/* メッセージ表示設定 */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">メッセージ表示</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <ToggleSlider
                    checked={display.showCharacterIcon}
                    onChange={(checked) => updateDisplaySettings({ showCharacterIcon: checked })}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">キャラアイコン表示</span>
                    <p className="text-xs text-gray-500">
                      発言者のキャラクターアイコンを表示します
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ToggleSlider
                    checked={display.showLargeCharacterImage}
                    onChange={(checked) =>
                      updateDisplaySettings({ showLargeCharacterImage: checked })
                    }
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      キャラ画像を大きく表示する
                    </span>
                    <p className="text-xs text-gray-500">
                      キャラクター画像を1.5倍のサイズで表示します
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ToggleSlider
                    checked={display.showTimestamp}
                    onChange={(checked) => updateDisplaySettings({ showTimestamp: checked })}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">発言時刻表示</span>
                    <p className="text-xs text-gray-500">各発言の投稿時刻を表示します</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ToggleSlider
                    checked={display.showSystemMessage}
                    onChange={(checked) => updateDisplaySettings({ showSystemMessage: checked })}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      システムメッセージ表示
                    </span>
                    <p className="text-xs text-gray-500">
                      村の進行に関するシステムメッセージを表示します
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ページネーション設定 */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">ページネーション</h4>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">1ページあたりの発言数:</label>
                <select
                  value={display.messagesPerPage.toString()}
                  onChange={(e) =>
                    updateDisplaySettings({ messagesPerPage: parseInt(e.target.value) })
                  }
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="20">20件</option>
                  <option value="50">50件</option>
                  <option value="100">100件</option>
                  <option value="200">200件</option>
                  <option value="500">500件</option>
                </select>
              </div>
              <p className="text-xs text-gray-500">
                発言が多い村では、少ない件数に設定することで表示速度が向上します
              </p>
            </div>
          </div>
        )}

        {/* 操作設定タブ */}
        {activeTab === 'operation' && (
          <div className="space-y-6">
            {/* 確認ダイアログ設定 */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">確認ダイアログ</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ToggleSlider
                    checked={operation.showConfirmDialog}
                    onChange={(checked) => updateOperationSettings({ showConfirmDialog: checked })}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">発言確認ダイアログ</span>
                    <p className="text-xs text-gray-500">発言投稿前に確認ダイアログを表示します</p>
                  </div>
                </div>
              </div>
            </div>

            {/* パネル設定 */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">パネル表示</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ToggleSlider
                    checked={operation.fixedActionPanel}
                    onChange={(checked) => updateOperationSettings({ fixedActionPanel: checked })}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">アクションパネル固定</span>
                    <p className="text-xs text-gray-500">
                      アクションパネルを画面下部に固定表示します
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 自動更新設定 */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">自動更新</h4>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">更新間隔:</label>
                <select
                  value={operation.autoUpdateInterval.toString()}
                  onChange={(e) =>
                    updateOperationSettings({ autoUpdateInterval: parseInt(e.target.value) })
                  }
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="15">15秒</option>
                  <option value="30">30秒</option>
                  <option value="60">1分</option>
                  <option value="120">2分</option>
                  <option value="300">5分</option>
                  <option value="0">無効</option>
                </select>
              </div>
              <p className="text-xs text-gray-500">
                短い間隔に設定するとサーバーへの負荷が増加します
              </p>
            </div>

            {/* アンカークリック設定 */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">アンカークリック動作</h4>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">クリック時の動作:</label>
                <select
                  value={operation.anchorClickAction}
                  onChange={(e) =>
                    updateOperationSettings({
                      anchorClickAction: e.target.value as 'paste' | 'copy',
                    })
                  }
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="paste">貼り付け</option>
                  <option value="copy">コピー</option>
                </select>
              </div>
              <p className="text-xs text-gray-500">
                アンカーをクリックした際にテキストエリアに貼り付けるか、クリップボードにコピーするかを選択
              </p>
            </div>
          </div>
        )}

        {/* Webhook設定タブ */}
        {activeTab === 'webhook' && (
          <div className="space-y-6">
            {/* Webhook有効/無効 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ToggleSlider
                  checked={webhook.enabled}
                  onChange={(checked) => updateWebhookSettings({ enabled: checked })}
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Webhook通知を有効にする</span>
                  <p className="text-xs text-gray-500">村の更新情報を外部サービスに通知します</p>
                </div>
              </div>
            </div>

            {webhook.enabled && (
              <>
                {/* WebhookURL */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
                  <input
                    type="url"
                    value={webhook.url}
                    onChange={(e) => updateWebhookSettings({ url: e.target.value })}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    SlackやDiscordなどのWebhook URLを入力してください
                  </p>
                </div>

                {/* 通知イベント設定 */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-700">通知イベント</h4>
                  <div className="space-y-3">
                    {[
                      {
                        key: 'newMessage',
                        label: '新しい発言',
                        description: '自分以外の発言が投稿されたとき',
                      },
                      {
                        key: 'mentioned',
                        label: 'メンション',
                        description: '自分宛の発言が投稿されたとき',
                      },
                      {
                        key: 'dayChange',
                        label: '日付更新',
                        description: '村の日付が更新されたとき',
                      },
                      {
                        key: 'gameEnd',
                        label: 'ゲーム終了',
                        description: '村のゲームが終了したとき',
                      },
                    ].map((event) => (
                      <div key={event.key} className="flex items-center space-x-3">
                        <ToggleSlider
                          checked={
                            webhook.events[event.key as keyof typeof webhook.events] || false
                          }
                          onChange={(checked) =>
                            updateWebhookSettings({
                              events: { ...webhook.events, [event.key]: checked },
                            })
                          }
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">{event.label}</span>
                          <p className="text-xs text-gray-500">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* カスタムメッセージ設定 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    カスタムメッセージテンプレート
                  </label>
                  <Textarea
                    value={webhook.messageTemplate}
                    onChange={(e) => updateWebhookSettings({ messageTemplate: e.target.value })}
                    placeholder="{{village_name}}で新しい発言がありました: {{message}}"
                    rows={3}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    利用可能な変数: {'{{village_name}}, {{speaker_name}}, {{message}}, {{day}}'}
                  </p>
                </div>

                {/* テスト送信 */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      // テスト通知送信処理
                      console.log('Webhookテスト送信')
                    }}
                    variant="outline"
                  >
                    テスト送信
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* フッターボタン */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button onClick={onClose} variant="outline" disabled={isSaving}>
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? '保存中...' : '設定を保存'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

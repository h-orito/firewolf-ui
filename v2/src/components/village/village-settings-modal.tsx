'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useVillageSettingsStore } from '@/stores/village-settings'
import type { components } from '@/types/generated/api'

type Village = components['schemas']['VillageView']

interface VillageSettingsModalProps {
  village: Village
  isOpen: boolean
  onClose: () => void
}

export function VillageSettingsModal({ village, isOpen, onClose }: VillageSettingsModalProps) {
  const { settings, updateDisplaySettings, updateFilterSettings, resetSettings } =
    useVillageSettingsStore()

  const [activeTab, setActiveTab] = useState<'display' | 'filter'>('display')

  if (!isOpen) return null

  // 発言種別の選択肢
  const messageTypeOptions = [
    { value: 'say', label: '通常発言' },
    { value: 'werewolf_say', label: '人狼発言' },
    { value: 'grave_say', label: '墓下発言' },
    { value: 'monologue', label: '独り言' },
    { value: 'spectate_say', label: '観戦発言' },
    { value: 'system', label: 'システムメッセージ' },
  ]

  const handleMessageTypeToggle = (messageType: string) => {
    const currentTypes = settings.filter.visibleMessageTypes
    const newTypes = currentTypes.includes(messageType)
      ? currentTypes.filter((type) => type !== messageType)
      : [...currentTypes, messageType]

    updateFilterSettings({ visibleMessageTypes: newTypes })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">村内設定</h2>
          <Button variant="outline" onClick={onClose}>
            ×
          </Button>
        </div>

        {/* タブナビゲーション */}
        <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'display'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('display')}
          >
            表示設定
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'filter'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('filter')}
          >
            フィルター設定
          </button>
        </div>

        {/* 表示設定タブ */}
        {activeTab === 'display' && (
          <div className="space-y-6">
            {/* 文字サイズ設定 */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">文字サイズ</h3>
              <div className="flex gap-2">
                {[
                  { value: 'small', label: '小' },
                  { value: 'medium', label: '中' },
                  { value: 'large', label: '大' },
                ].map((size) => (
                  <Button
                    key={size.value}
                    variant={settings.display.fontSize === size.value ? 'default' : 'outline'}
                    onClick={() => updateDisplaySettings({ fontSize: size.value as any })}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </Card>

            {/* 表示オプション */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">表示オプション</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.display.showTimestamp}
                    onChange={(e) => updateDisplaySettings({ showTimestamp: e.target.checked })}
                    className="mr-2"
                  />
                  日時を表示する
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.display.showSpeakerName}
                    onChange={(e) => updateDisplaySettings({ showSpeakerName: e.target.checked })}
                    className="mr-2"
                  />
                  発言者名を表示する
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.display.showMessageNumber}
                    onChange={(e) => updateDisplaySettings({ showMessageNumber: e.target.checked })}
                    className="mr-2"
                  />
                  発言番号を表示する
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.display.compactView}
                    onChange={(e) => updateDisplaySettings({ compactView: e.target.checked })}
                    className="mr-2"
                  />
                  コンパクト表示
                </label>
              </div>
            </Card>

            {/* ページング設定 */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">表示件数設定</h3>
              <div className="flex gap-2">
                {[25, 50, 100, 200].map((count) => (
                  <Button
                    key={count}
                    variant={settings.display.messagesPerPage === count ? 'default' : 'outline'}
                    onClick={() => updateDisplaySettings({ messagesPerPage: count })}
                  >
                    {count}件
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* フィルター設定タブ */}
        {activeTab === 'filter' && (
          <div className="space-y-6">
            {/* 発言種別フィルター */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">表示する発言種別</h3>
              <div className="space-y-2">
                {messageTypeOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.filter.visibleMessageTypes.includes(option.value)}
                      onChange={() => handleMessageTypeToggle(option.value)}
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </Card>

            {/* 参加者フィルター */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">参加者フィルター</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">特定の参加者のみ表示</label>
                  <select
                    value={settings.filter.filterByParticipant || ''}
                    onChange={(e) =>
                      updateFilterSettings({
                        filterByParticipant: e.target.value || null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">すべての参加者</option>
                    {village.participant.member_list.map((participant) => (
                      <option key={participant.id} value={participant.id.toString()}>
                        {participant.chara.chara_name.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={resetSettings}>
            設定をリセット
          </Button>
          <Button onClick={onClose} className="flex-1">
            適用
          </Button>
        </div>
      </div>
    </div>
  )
}

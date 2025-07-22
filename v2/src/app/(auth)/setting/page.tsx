'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export default function SettingPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [profileSettings, setProfileSettings] = useState({
    displayName: user?.displayName || '',
    introduction: '',
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    gameStartNotification: true,
    dayChangeNotification: false,
    messageNotification: false,
  })

  const [gameSettings, setGameSettings] = useState({
    defaultMessageType: 'normal',
    autoSave: true,
    soundEffects: true,
    darkMode: false,
  })

  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      // TODO: API call to save profile settings
      console.log('Saving profile settings:', profileSettings)
      alert('プロフィール設定を保存しました')
    } catch (error) {
      console.error('Failed to save profile settings:', error)
      alert('保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationSave = async () => {
    setIsLoading(true)
    try {
      // TODO: API call to save notification settings
      console.log('Saving notification settings:', notificationSettings)
      alert('通知設定を保存しました')
    } catch (error) {
      console.error('Failed to save notification settings:', error)
      alert('保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGameSettingsSave = async () => {
    setIsLoading(true)
    try {
      // TODO: API call to save game settings
      localStorage.setItem('gameSettings', JSON.stringify(gameSettings))
      console.log('Saving game settings:', gameSettings)
      alert('ゲーム設定を保存しました')
    } catch (error) {
      console.error('Failed to save game settings:', error)
      alert('保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">設定</h1>

      <div className="space-y-8">
        {/* プロフィール設定 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">プロフィール設定</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                表示名
              </label>
              <input
                type="text"
                id="displayName"
                value={profileSettings.displayName}
                onChange={(e) =>
                  setProfileSettings((prev) => ({ ...prev, displayName: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="表示名を入力してください"
              />
            </div>

            <div>
              <label htmlFor="introduction" className="block text-sm font-medium mb-2">
                自己紹介
              </label>
              <textarea
                id="introduction"
                value={profileSettings.introduction}
                onChange={(e) =>
                  setProfileSettings((prev) => ({ ...prev, introduction: e.target.value }))
                }
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="自己紹介を入力してください（任意）"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleProfileSave} disabled={isLoading}>
              {isLoading ? '保存中...' : 'プロフィールを保存'}
            </Button>
          </div>
        </Card>

        {/* 通知設定 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">通知設定</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>メール通知</span>
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={(e) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    emailNotifications: e.target.checked,
                  }))
                }
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>プッシュ通知</span>
              <input
                type="checkbox"
                checked={notificationSettings.pushNotifications}
                onChange={(e) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    pushNotifications: e.target.checked,
                  }))
                }
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>ゲーム開始通知</span>
              <input
                type="checkbox"
                checked={notificationSettings.gameStartNotification}
                onChange={(e) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    gameStartNotification: e.target.checked,
                  }))
                }
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>日付更新通知</span>
              <input
                type="checkbox"
                checked={notificationSettings.dayChangeNotification}
                onChange={(e) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    dayChangeNotification: e.target.checked,
                  }))
                }
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>メッセージ通知</span>
              <input
                type="checkbox"
                checked={notificationSettings.messageNotification}
                onChange={(e) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    messageNotification: e.target.checked,
                  }))
                }
                className="h-4 w-4"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleNotificationSave} disabled={isLoading}>
              {isLoading ? '保存中...' : '通知設定を保存'}
            </Button>
          </div>
        </Card>

        {/* ゲーム設定 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">ゲーム設定</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="defaultMessageType" className="block text-sm font-medium mb-2">
                デフォルトメッセージタイプ
              </label>
              <select
                id="defaultMessageType"
                value={gameSettings.defaultMessageType}
                onChange={(e) =>
                  setGameSettings((prev) => ({ ...prev, defaultMessageType: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">通常発言</option>
                <option value="monologue">独り言</option>
                <option value="action">アクション</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span>自動保存</span>
              <input
                type="checkbox"
                checked={gameSettings.autoSave}
                onChange={(e) =>
                  setGameSettings((prev) => ({ ...prev, autoSave: e.target.checked }))
                }
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>効果音</span>
              <input
                type="checkbox"
                checked={gameSettings.soundEffects}
                onChange={(e) =>
                  setGameSettings((prev) => ({ ...prev, soundEffects: e.target.checked }))
                }
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>ダークモード</span>
              <input
                type="checkbox"
                checked={gameSettings.darkMode}
                onChange={(e) =>
                  setGameSettings((prev) => ({ ...prev, darkMode: e.target.checked }))
                }
                className="h-4 w-4"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleGameSettingsSave} disabled={isLoading}>
              {isLoading ? '保存中...' : 'ゲーム設定を保存'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

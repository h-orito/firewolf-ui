import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import type { UserSettings } from '@/types/village'

interface UserSettingsStoreState extends UserSettings {
  // Actions
  // Display Settings
  setShowCharacterIcon: (show: boolean) => void
  setShowLargeCharacterImage: (show: boolean) => void
  setShowTimestamp: (show: boolean) => void
  setShowMessageNumber: (show: boolean) => void
  setShowSystemMessage: (show: boolean) => void
  setMessagesPerPage: (count: number) => void
  setTheme: (theme: 'light' | 'dark' | 'auto') => void

  // Operation Settings
  setAnchorClickAction: (action: 'paste' | 'copy') => void
  setShowConfirmDialog: (show: boolean) => void
  setAutoUpdateInterval: (interval: number) => void
  setFixedActionPanel: (fixed: boolean) => void

  // Webhook Settings
  setWebhookUrl: (url: string) => void

  // Bulk Actions
  updateDisplaySettings: (settings: Partial<UserSettings['display']>) => void
  updateOperationSettings: (settings: Partial<UserSettings['operation']>) => void
  updateWebhookSettings: (settings: Partial<UserSettings['webhook']>) => void

  // Reset Actions
  resetDisplaySettings: () => void
  resetOperationSettings: () => void
  resetWebhookSettings: () => void
  resetAll: () => void
}

/**
 * デフォルトのユーザー設定
 */
const getDefaultSettings = (): UserSettings => ({
  display: {
    showCharacterIcon: true,
    showLargeCharacterImage: false,
    showTimestamp: true,
    showMessageNumber: true,
    showSystemMessage: true,
    messagesPerPage: 50,
    theme: 'auto',
  },
  operation: {
    anchorClickAction: 'paste',
    showConfirmDialog: true,
    autoUpdateInterval: 30,
    fixedActionPanel: false,
  },
  webhook: {
    enabled: false,
    url: '',
    events: {
      newMessage: false,
      mentioned: true,
      dayChange: true,
      gameEnd: true,
    },
    messageTemplate: '{{village_name}}で新しい発言がありました: {{message}}',
    keywords: [],
  },
})

/**
 * ユーザー設定を管理するストア
 *
 * 重要な設計方針：
 * - Cookie に永続化（ユーザー設定は永続化が必要）
 * - すべてのタブで同期される
 * - 設定変更は即座に反映される
 */
export const useUserSettingsStore = create<UserSettingsStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State (デフォルト設定)
        ...getDefaultSettings(),

        // Display Settings Actions
        setShowCharacterIcon: (showCharacterIcon) => {
          set(
            (state) => ({
              display: {
                ...state.display,
                showCharacterIcon,
              },
            }),
            false,
            'userSettings/setShowCharacterIcon'
          )
        },

        setShowLargeCharacterImage: (showLargeCharacterImage) => {
          set(
            (state) => ({
              display: {
                ...state.display,
                showLargeCharacterImage,
              },
            }),
            false,
            'userSettings/setShowLargeCharacterImage'
          )
        },

        setShowTimestamp: (showTimestamp) => {
          set(
            (state) => ({
              display: {
                ...state.display,
                showTimestamp,
              },
            }),
            false,
            'userSettings/setShowTimestamp'
          )
        },

        setShowMessageNumber: (showMessageNumber) => {
          set(
            (state) => ({
              display: {
                ...state.display,
                showMessageNumber,
              },
            }),
            false,
            'userSettings/setShowMessageNumber'
          )
        },

        setShowSystemMessage: (showSystemMessage) => {
          set(
            (state) => ({
              display: {
                ...state.display,
                showSystemMessage,
              },
            }),
            false,
            'userSettings/setShowSystemMessage'
          )
        },

        setMessagesPerPage: (messagesPerPage) => {
          // 10-200の範囲で制限
          const clampedCount = Math.max(10, Math.min(200, messagesPerPage))
          set(
            (state) => ({
              display: {
                ...state.display,
                messagesPerPage: clampedCount,
              },
            }),
            false,
            'userSettings/setMessagesPerPage'
          )
        },

        setTheme: (theme) => {
          set(
            (state) => ({
              display: {
                ...state.display,
                theme,
              },
            }),
            false,
            'userSettings/setTheme'
          )
        },

        // Operation Settings Actions
        setAnchorClickAction: (anchorClickAction) => {
          set(
            (state) => ({
              operation: {
                ...state.operation,
                anchorClickAction,
              },
            }),
            false,
            'userSettings/setAnchorClickAction'
          )
        },

        setShowConfirmDialog: (showConfirmDialog) => {
          set(
            (state) => ({
              operation: {
                ...state.operation,
                showConfirmDialog,
              },
            }),
            false,
            'userSettings/setShowConfirmDialog'
          )
        },

        setAutoUpdateInterval: (autoUpdateInterval) => {
          // 10-300秒の範囲で制限
          const clampedInterval = Math.max(10, Math.min(300, autoUpdateInterval))
          set(
            (state) => ({
              operation: {
                ...state.operation,
                autoUpdateInterval: clampedInterval,
              },
            }),
            false,
            'userSettings/setAutoUpdateInterval'
          )
        },

        setFixedActionPanel: (fixedActionPanel) => {
          set(
            (state) => ({
              operation: {
                ...state.operation,
                fixedActionPanel,
              },
            }),
            false,
            'userSettings/setFixedActionPanel'
          )
        },

        // Webhook Settings Actions
        setWebhookUrl: (url) => {
          set(
            (state) => ({
              webhook: {
                ...state.webhook,
                url,
              },
            }),
            false,
            'userSettings/setWebhookUrl'
          )
        },

        // Bulk Update Actions
        updateDisplaySettings: (settings) => {
          set(
            (state) => ({
              display: {
                ...state.display,
                ...settings,
              },
            }),
            false,
            'userSettings/updateDisplaySettings'
          )
        },

        updateOperationSettings: (settings) => {
          set(
            (state) => ({
              operation: {
                ...state.operation,
                ...settings,
              },
            }),
            false,
            'userSettings/updateOperationSettings'
          )
        },

        updateWebhookSettings: (settings) => {
          set(
            (state) => ({
              webhook: {
                ...state.webhook,
                ...settings,
              },
            }),
            false,
            'userSettings/updateWebhookSettings'
          )
        },

        // Reset Actions
        resetDisplaySettings: () => {
          const defaultSettings = getDefaultSettings()
          set(
            (state) => ({
              display: defaultSettings.display,
            }),
            false,
            'userSettings/resetDisplaySettings'
          )
        },

        resetOperationSettings: () => {
          const defaultSettings = getDefaultSettings()
          set(
            (state) => ({
              operation: defaultSettings.operation,
            }),
            false,
            'userSettings/resetOperationSettings'
          )
        },

        resetWebhookSettings: () => {
          const defaultSettings = getDefaultSettings()
          set(
            (state) => ({
              webhook: defaultSettings.webhook,
            }),
            false,
            'userSettings/resetWebhookSettings'
          )
        },

        resetAll: () => {
          set(getDefaultSettings(), false, 'userSettings/resetAll')
        },
      }),
      {
        name: 'firewolf-user-settings',
        storage: createJSONStorage(() => localStorage),
        // 永続化する項目を制限（大量のデータを保存しないため）
        partialize: (state) => ({
          display: state.display,
          operation: state.operation,
          webhook: {
            ...state.webhook,
            // Webhook URLは機密情報の可能性があるため、永続化しない場合は以下をコメントアウト
            url: state.webhook.url,
          },
        }),
        version: 1,
        // マイグレーション関数（将来的に設定構造が変わった場合に使用）
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            // 初期バージョンからのマイグレーション処理
            return {
              ...getDefaultSettings(),
              ...persistedState,
            }
          }
          return persistedState as UserSettingsStoreState
        },
      }
    ),
    {
      name: 'user-settings-store',
    }
  )
)

/**
 * ユーザー設定をエクスポート用のJSONに変換
 */
export const exportUserSettings = (): string => {
  const { display, operation, webhook } = useUserSettingsStore.getState()
  const exportData = {
    display,
    operation,
    webhook: {
      ...webhook,
      // エクスポート時はWebhook URLを除外（セキュリティのため）
      url: undefined,
    },
    exportedAt: new Date().toISOString(),
    version: 1,
  }
  return JSON.stringify(exportData, null, 2)
}

/**
 * エクスポートしたJSONからユーザー設定をインポート
 */
export const importUserSettings = (jsonString: string): boolean => {
  try {
    const importData = JSON.parse(jsonString)

    if (!importData || typeof importData !== 'object') {
      return false
    }

    const { updateDisplaySettings, updateOperationSettings, updateWebhookSettings } =
      useUserSettingsStore.getState()

    if (importData.display) {
      updateDisplaySettings(importData.display)
    }

    if (importData.operation) {
      updateOperationSettings(importData.operation)
    }

    if (importData.webhook) {
      // インポート時はWebhook URLは除外
      const { url, ...webhookSettings } = importData.webhook
      updateWebhookSettings(webhookSettings)
    }

    return true
  } catch (error) {
    console.error('Failed to import user settings:', error)
    return false
  }
}

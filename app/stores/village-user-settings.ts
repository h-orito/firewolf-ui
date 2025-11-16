import { defineStore } from 'pinia'
import type {
  VillageUserSettings,
  PagingSettings,
  ActionWindowSettings,
  MessageDisplaySettings,
  ThemeSettings,
  OperationSettings,
  AgeLimitSettings
} from '~/composables/village/useUserSettings'

/**
 * 村ページのユーザー設定状態管理Store
 */
export const useVillageUserSettingsStore = defineStore(
  'village-user-settings',
  () => {
    // State
    const settings = ref<VillageUserSettings | null>(null)

    // Actions
    /**
     * 設定を保存
     */
    const saveSettings = (userSettings: VillageUserSettings) => {
      // readonly配列をコピーして保存
      settings.value = {
        ...userSettings,
        ageLimit: userSettings.ageLimit
          ? {
              ...userSettings.ageLimit,
              confirmVillageIds: [...userSettings.ageLimit.confirmVillageIds]
            }
          : undefined
      }
    }

    /**
     * ページング設定を更新
     */
    const updatePaging = (paging: PagingSettings) => {
      if (settings.value) {
        settings.value.paging = paging
      }
    }

    /**
     * アクションウィンドウ設定を更新
     */
    const updateActionWindow = (actionWindow: ActionWindowSettings) => {
      if (settings.value) {
        settings.value.actionWindow = actionWindow
      }
    }

    /**
     * メッセージ表示設定を更新
     */
    const updateMessageDisplay = (messageDisplay: MessageDisplaySettings) => {
      if (settings.value) {
        settings.value.messageDisplay = messageDisplay
      }
    }

    /**
     * テーマ設定を更新
     */
    const updateTheme = (theme: ThemeSettings) => {
      if (settings.value) {
        settings.value.theme = theme
      }
    }

    /**
     * 操作設定を更新
     */
    const updateOperation = (operation: OperationSettings) => {
      if (settings.value) {
        settings.value.operation = operation
      }
    }

    /**
     * 年齢制限設定を更新
     */
    const updateAgeLimit = (ageLimit: AgeLimitSettings) => {
      if (settings.value) {
        settings.value.ageLimit = ageLimit
      }
    }

    /**
     * ストアをリセット
     */
    const reset = () => {
      settings.value = null
    }

    return {
      // State
      settings: readonly(settings),

      // Actions
      saveSettings,
      updatePaging,
      updateActionWindow,
      updateMessageDisplay,
      updateTheme,
      updateOperation,
      updateAgeLimit,
      reset
    }
  }
)

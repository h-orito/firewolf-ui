import { defineStore } from 'pinia'

// Village User Settings の型定義（既存実装に合わせて修正）
export interface VillageUserSettings {
  paging: {
    is_paging: boolean
    message_per_page: number
  }
  action_window?: {
    is_fixed?: boolean
    open_map?: Map<string, boolean>
  }
  message_display?: {
    is_disp_date: boolean
    is_char_large: boolean
    is_img_large: boolean
  }
  theme?: {
    is_dark: boolean
  }
  operation?: {
    is_open_filter_newtab: boolean
    is_paste_anchor: boolean
  }
  ageLimit?: {
    confirm_village_ids: string[]
  }
}

const defaultSettings: VillageUserSettings = {
  paging: {
    is_paging: true,
    message_per_page: 50
  },
  action_window: {
    is_fixed: false,
    open_map: new Map<string, boolean>()
  },
  message_display: {
    is_disp_date: false,
    is_char_large: false,
    is_img_large: false
  },
  theme: {
    is_dark: false
  },
  operation: {
    is_open_filter_newtab: false,
    is_paste_anchor: false
  },
  ageLimit: {
    confirm_village_ids: []
  }
}

export const useVillageSettingsStore = defineStore('villageSettings', () => {
  const settings = ref<VillageUserSettings | null>(null)
  const isLoaded = ref<boolean>(false)

  // Computed properties
  const getVillageUserSettings = computed(
    () => settings.value || defaultSettings
  )
  const getPaging = computed(
    () => settings.value?.paging || defaultSettings.paging
  )
  const getActionWindow = computed(
    () => settings.value?.action_window || defaultSettings.action_window
  )
  const getMessageDisplay = computed(
    () => settings.value?.message_display || defaultSettings.message_display
  )
  const getTheme = computed(
    () => settings.value?.theme || defaultSettings.theme
  )
  const isDarkTheme = computed(() => settings.value?.theme?.is_dark || false)
  const getOperation = computed(
    () => settings.value?.operation || defaultSettings.operation
  )
  const getAgeLimit = computed(
    () => settings.value?.ageLimit || defaultSettings.ageLimit
  )

  // Cookie key
  const COOKIE_KEY = 'village-user-settings'

  // Actions
  const initSettings = (settingsData?: VillageUserSettings) => {
    settings.value = settingsData || defaultSettings
    isLoaded.value = true
  }

  const updateSettings = (newSettings: Partial<VillageUserSettings>) => {
    if (!settings.value) {
      settings.value = { ...defaultSettings }
    }

    settings.value = {
      ...settings.value,
      ...newSettings
    }

    saveToCookie()
  }

  const updatePaging = (paging: Partial<VillageUserSettings['paging']>) => {
    const currentPaging = settings.value?.paging || defaultSettings.paging
    updateSettings({
      paging: {
        ...currentPaging,
        ...paging
      }
    })
  }

  const updateActionWindow = (
    actionWindow: Partial<VillageUserSettings['action_window']>
  ) => {
    const currentActionWindow =
      settings.value?.action_window || defaultSettings.action_window!
    updateSettings({
      action_window: {
        ...currentActionWindow,
        ...actionWindow
      }
    })
  }

  const updateMessageDisplay = (
    messageDisplay: Partial<VillageUserSettings['message_display']>
  ) => {
    const currentMessageDisplay =
      settings.value?.message_display || defaultSettings.message_display!
    updateSettings({
      message_display: {
        ...currentMessageDisplay,
        ...messageDisplay
      }
    })
  }

  const updateTheme = (theme: Partial<VillageUserSettings['theme']>) => {
    const currentTheme = settings.value?.theme || defaultSettings.theme!
    updateSettings({
      theme: {
        ...currentTheme,
        ...theme
      }
    })
  }

  const updateOperation = (
    operation: Partial<VillageUserSettings['operation']>
  ) => {
    const currentOperation =
      settings.value?.operation || defaultSettings.operation!
    updateSettings({
      operation: {
        ...currentOperation,
        ...operation
      }
    })
  }

  const updateAgeLimit = (
    ageLimit: Partial<VillageUserSettings['ageLimit']>
  ) => {
    const currentAgeLimit =
      settings.value?.ageLimit || defaultSettings.ageLimit!
    updateSettings({
      ageLimit: {
        ...currentAgeLimit,
        ...ageLimit
      }
    })
  }

  // Cookie operations
  const loadFromCookie = () => {
    try {
      const cookieValue = useCookie(COOKIE_KEY).value

      if (cookieValue && typeof cookieValue === 'string') {
        const parsedSettings = JSON.parse(cookieValue) as VillageUserSettings
        initSettings(parsedSettings)
      } else if (typeof cookieValue === 'object' && cookieValue !== null) {
        initSettings(cookieValue as VillageUserSettings)
      } else {
        initSettings()
      }
    } catch (error) {
      console.warn('Failed to load village settings from cookie:', error)
      initSettings()
    }
  }

  const saveToCookie = () => {
    try {
      const cookie = useCookie(COOKIE_KEY, {
        default: () => defaultSettings,
        maxAge: 60 * 60 * 24 * 365, // 1年
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      })

      cookie.value = settings.value || defaultSettings
    } catch (error) {
      console.error('Failed to save village settings to cookie:', error)
    }
  }

  const resetSettings = () => {
    settings.value = { ...defaultSettings }
    saveToCookie()
  }

  // Initialize from cookie on creation
  const init = () => {
    if (!isLoaded.value) {
      loadFromCookie()
    }
  }

  return {
    // State (readonly)
    settings: readonly(settings),
    isLoaded: readonly(isLoaded),

    // Computed
    getVillageUserSettings,
    getPaging,
    getActionWindow,
    getMessageDisplay,
    getTheme,
    isDarkTheme,
    getOperation,
    getAgeLimit,

    // Actions
    init,
    initSettings,
    updateSettings,
    updatePaging,
    updateActionWindow,
    updateMessageDisplay,
    updateTheme,
    updateOperation,
    updateAgeLimit,
    loadFromCookie,
    saveToCookie,
    resetSettings
  }
})

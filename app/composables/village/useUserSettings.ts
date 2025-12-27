// ユーザー設定の型定義
export interface VillageUserSettings {
  paging: PagingSettings
  actionWindow?: ActionWindowSettings
  messageDisplay?: MessageDisplaySettings
  theme?: ThemeSettings
  operation?: OperationSettings
  ageLimit?: AgeLimitSettings
}

export interface PagingSettings {
  isPaging: boolean
  messagePerPage: number
}

export interface ActionWindowSettings {
  isFixed?: boolean
  fixedPanelKey?: string | null
  openMap?: Record<string, boolean>
}

export interface MessageDisplaySettings {
  isDispDate: boolean
  isCharLarge: boolean
  isImgLarge: boolean
}

export interface ThemeSettings {
  isDark: boolean
}

export interface OperationSettings {
  isOpenFilterNewtab: boolean
  isPasteAnchor: boolean
}

export interface AgeLimitSettings {
  confirmVillageIds: string[]
}

// デフォルト設定
const DEFAULT_PAGING: PagingSettings = {
  isPaging: true,
  messagePerPage: 50
}

const DEFAULT_ACTION_WINDOW: ActionWindowSettings = {
  isFixed: false,
  openMap: {}
}

const DEFAULT_MESSAGE_DISPLAY: MessageDisplaySettings = {
  isDispDate: false,
  isCharLarge: false,
  isImgLarge: false
}

const DEFAULT_THEME: ThemeSettings = {
  isDark: false
}

const DEFAULT_OPERATION: OperationSettings = {
  isOpenFilterNewtab: false,
  isPasteAnchor: false
}

const DEFAULT_AGELIMIT: AgeLimitSettings = {
  confirmVillageIds: []
}

const DEFAULT_SETTINGS: VillageUserSettings = {
  paging: DEFAULT_PAGING,
  actionWindow: DEFAULT_ACTION_WINDOW,
  messageDisplay: DEFAULT_MESSAGE_DISPLAY,
  theme: DEFAULT_THEME,
  operation: DEFAULT_OPERATION,
  ageLimit: DEFAULT_AGELIMIT
}

const COOKIE_NAME = 'village-user-settings'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1年

/**
 * 村ページのユーザー設定管理(Cookie + Store)
 */
export const useUserSettings = () => {
  // Store
  const settingsStore = useVillageUserSettingsStore()

  // Cookie
  const settingsCookie = useCookie<VillageUserSettings>(COOKIE_NAME, {
    default: () => ({ ...DEFAULT_SETTINGS }),
    maxAge: COOKIE_MAX_AGE,
    path: '/'
  })

  /**
   * Cookieからstoreに設定を読み込む
   */
  const loadFromCookie = () => {
    if (!settingsCookie.value) {
      settingsCookie.value = JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
    }
    // プロキシオブジェクトを解除するためにディープコピーして渡す
    settingsStore.saveSettings(JSON.parse(JSON.stringify(settingsCookie.value)))
  }

  /**
   * 設定が存在しない場合はデフォルト設定で初期化
   */
  const initializeIfNeeded = () => {
    if (!settingsStore.settings) {
      loadFromCookie()
    }
  }

  /**
   * storeの設定をCookieに保存
   */
  const saveToCookie = () => {
    if (settingsStore.settings) {
      // オブジェクトをディープコピーしてCookieに保存
      settingsCookie.value = JSON.parse(JSON.stringify(settingsStore.settings))
    }
  }

  /**
   * ページング設定を取得
   */
  const getPaging = (): PagingSettings => {
    initializeIfNeeded()
    return settingsStore.settings?.paging || DEFAULT_PAGING
  }

  /**
   * ページング設定を保存
   */
  const setPaging = (pagingSettings: PagingSettings) => {
    initializeIfNeeded()
    settingsStore.updatePaging(pagingSettings)
    saveToCookie()
  }

  /**
   * アクションウィンドウ設定を取得
   */
  const getActionWindow = (): ActionWindowSettings => {
    initializeIfNeeded()
    if (settingsStore.settings?.actionWindow == null) {
      setActionWindow(DEFAULT_ACTION_WINDOW)
      return DEFAULT_ACTION_WINDOW
    }
    return settingsStore.settings.actionWindow
  }

  /**
   * アクションウィンドウ設定を保存
   */
  const setActionWindow = (actionWindowSettings: ActionWindowSettings) => {
    initializeIfNeeded()
    settingsStore.updateActionWindow(actionWindowSettings)
    saveToCookie()
  }

  /**
   * メッセージ表示設定を取得
   */
  const getMessageDisplay = (): MessageDisplaySettings => {
    initializeIfNeeded()
    if (settingsStore.settings?.messageDisplay) {
      return settingsStore.settings.messageDisplay
    }
    setMessageDisplay(DEFAULT_MESSAGE_DISPLAY)
    return DEFAULT_MESSAGE_DISPLAY
  }

  /**
   * メッセージ表示設定を保存
   */
  const setMessageDisplay = (
    messageDisplaySettings: MessageDisplaySettings
  ) => {
    initializeIfNeeded()
    settingsStore.updateMessageDisplay(messageDisplaySettings)
    saveToCookie()
  }

  /**
   * テーマ設定を取得
   */
  const getTheme = (): ThemeSettings => {
    initializeIfNeeded()
    if (settingsStore.settings?.theme) {
      return settingsStore.settings.theme
    }
    setTheme(DEFAULT_THEME)
    return DEFAULT_THEME
  }

  /**
   * テーマ設定を保存
   */
  const setTheme = (themeSettings: ThemeSettings) => {
    initializeIfNeeded()
    settingsStore.updateTheme(themeSettings)
    saveToCookie()
  }

  /**
   * 操作設定を取得
   */
  const getOperation = (): OperationSettings => {
    initializeIfNeeded()
    if (settingsStore.settings?.operation) {
      return settingsStore.settings.operation
    }
    setOperation(DEFAULT_OPERATION)
    return DEFAULT_OPERATION
  }

  /**
   * 操作設定を保存
   */
  const setOperation = (operationSettings: OperationSettings) => {
    initializeIfNeeded()
    settingsStore.updateOperation(operationSettings)
    saveToCookie()
  }

  /**
   * 年齢制限確認設定を取得
   */
  const getAgeLimit = (): AgeLimitSettings => {
    initializeIfNeeded()
    if (settingsStore.settings?.ageLimit) {
      // readonlyを避けるため配列をコピーして返す
      return {
        confirmVillageIds: [
          ...settingsStore.settings.ageLimit.confirmVillageIds
        ]
      }
    }
    // デフォルト値をコピーして設定
    const defaultCopy = {
      confirmVillageIds: [...DEFAULT_AGELIMIT.confirmVillageIds]
    }
    setAgeLimit(defaultCopy)
    return defaultCopy
  }

  /**
   * 年齢制限確認設定を保存
   */
  const setAgeLimit = (ageLimitSettings: AgeLimitSettings) => {
    initializeIfNeeded()
    // 配列をコピーして渡す
    settingsStore.updateAgeLimit({
      confirmVillageIds: [...ageLimitSettings.confirmVillageIds]
    })
    saveToCookie()
  }

  /**
   * 特定のアクションパネルの開閉状態を取得
   * @param panelKey パネルの識別キー（例: 'participate', 'say', 'ability'）
   * @param defaultOpen デフォルトの開閉状態（指定がない場合はtrue）
   */
  const getActionPanelOpen = (
    panelKey: string,
    defaultOpen: boolean = true
  ): boolean => {
    const actionWindow = getActionWindow()
    if (actionWindow.openMap && panelKey in actionWindow.openMap) {
      return actionWindow.openMap[panelKey] ?? defaultOpen
    }
    return defaultOpen
  }

  /**
   * 特定のアクションパネルの開閉状態を保存
   * @param panelKey パネルの識別キー
   * @param isOpen 開閉状態
   */
  const setActionPanelOpen = (panelKey: string, isOpen: boolean) => {
    const actionWindow = getActionWindow()
    const newOpenMap = { ...actionWindow.openMap, [panelKey]: isOpen }
    setActionWindow({
      ...actionWindow,
      openMap: newOpenMap
    })
  }

  /**
   * 固定中のパネルキーを取得
   */
  const getFixedPanelKey = (): string | null => {
    const actionWindow = getActionWindow()
    return actionWindow.fixedPanelKey ?? null
  }

  /**
   * パネルを固定（他のパネルの固定は自動解除）
   * @param panelKey 固定するパネルのキー（null で固定解除）
   */
  const setFixedPanelKey = (panelKey: string | null) => {
    const actionWindow = getActionWindow()
    setActionWindow({
      ...actionWindow,
      fixedPanelKey: panelKey
    })
  }

  return {
    // Settings (from store)
    settings: settingsStore.settings,

    // Methods
    initializeIfNeeded,
    loadFromCookie,
    getPaging,
    setPaging,
    getActionWindow,
    setActionWindow,
    getMessageDisplay,
    setMessageDisplay,
    getTheme,
    setTheme,
    getOperation,
    setOperation,
    getAgeLimit,
    setAgeLimit,
    getActionPanelOpen,
    setActionPanelOpen,
    getFixedPanelKey,
    setFixedPanelKey
  }
}

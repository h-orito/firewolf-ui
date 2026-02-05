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
 *
 * 使用方法:
 * 1. village.vue の初期化時に loadFromCookie() を1回だけ呼び出す
 * 2. 各コンポーネントでは computed プロパティ（paging, theme 等）を参照する
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
   * ※ village.vue の初期化時に1回だけ呼び出すこと
   */
  const loadFromCookie = () => {
    if (!settingsCookie.value) {
      settingsCookie.value = JSON.parse(JSON.stringify(DEFAULT_SETTINGS))
    }
    // プロキシオブジェクトを解除するためにディープコピーして渡す
    settingsStore.saveSettings(JSON.parse(JSON.stringify(settingsCookie.value)))
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

  // ========================================
  // Computed プロパティ（読み取り専用）
  // ========================================

  /** ページング設定 */
  const paging = computed<PagingSettings>(
    () => settingsStore.settings?.paging ?? DEFAULT_PAGING
  )

  /** アクションウィンドウ設定 */
  const actionWindow = computed<ActionWindowSettings>(
    () => settingsStore.settings?.actionWindow ?? DEFAULT_ACTION_WINDOW
  )

  /** メッセージ表示設定 */
  const messageDisplay = computed<MessageDisplaySettings>(
    () => settingsStore.settings?.messageDisplay ?? DEFAULT_MESSAGE_DISPLAY
  )

  /** テーマ設定 */
  const theme = computed<ThemeSettings>(
    () => settingsStore.settings?.theme ?? DEFAULT_THEME
  )

  /** 操作設定 */
  const operation = computed<OperationSettings>(
    () => settingsStore.settings?.operation ?? DEFAULT_OPERATION
  )

  /** 年齢制限確認設定 */
  const ageLimit = computed<AgeLimitSettings>(() => ({
    confirmVillageIds: [
      ...(settingsStore.settings?.ageLimit?.confirmVillageIds ?? [])
    ]
  }))

  /** 固定中のパネルキー */
  const fixedPanelKey = computed<string | null>(
    () => actionWindow.value.fixedPanelKey ?? null
  )

  /** 固定パネルが存在するか */
  const hasFixedPanel = computed<boolean>(() => fixedPanelKey.value !== null)

  /** 固定パネルが開いているか（固定パネルがない場合はfalse） */
  const isFixedPanelOpen = computed<boolean>(() => {
    const key = fixedPanelKey.value
    if (!key) return false
    const openMap = actionWindow.value.openMap
    if (openMap && key in openMap) {
      return openMap[key] ?? true
    }
    return true
  })

  // ========================================
  // Setter メソッド
  // ========================================

  /**
   * ページング設定を保存
   */
  const setPaging = (pagingSettings: PagingSettings) => {
    settingsStore.updatePaging(pagingSettings)
    saveToCookie()
  }

  /**
   * アクションウィンドウ設定を保存
   */
  const setActionWindow = (actionWindowSettings: ActionWindowSettings) => {
    settingsStore.updateActionWindow(actionWindowSettings)
    saveToCookie()
  }

  /**
   * メッセージ表示設定を保存
   */
  const setMessageDisplay = (
    messageDisplaySettings: MessageDisplaySettings
  ) => {
    settingsStore.updateMessageDisplay(messageDisplaySettings)
    saveToCookie()
  }

  /**
   * テーマ設定を保存
   */
  const setTheme = (themeSettings: ThemeSettings) => {
    settingsStore.updateTheme(themeSettings)
    saveToCookie()
  }

  /**
   * 操作設定を保存
   */
  const setOperation = (operationSettings: OperationSettings) => {
    settingsStore.updateOperation(operationSettings)
    saveToCookie()
  }

  /**
   * 年齢制限確認設定を保存
   */
  const setAgeLimit = (ageLimitSettings: AgeLimitSettings) => {
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
    const openMap = actionWindow.value.openMap
    if (openMap && panelKey in openMap) {
      return openMap[panelKey] ?? defaultOpen
    }
    return defaultOpen
  }

  /**
   * 特定のアクションパネルの開閉状態を保存
   * @param panelKey パネルの識別キー
   * @param isOpen 開閉状態
   */
  const setActionPanelOpen = (panelKey: string, isOpen: boolean) => {
    const currentActionWindow = actionWindow.value
    const newOpenMap = { ...currentActionWindow.openMap, [panelKey]: isOpen }
    setActionWindow({
      ...currentActionWindow,
      openMap: newOpenMap
    })
  }

  /**
   * パネルを固定（他のパネルの固定は自動解除）
   * @param panelKey 固定するパネルのキー（null で固定解除）
   */
  const setFixedPanelKey = (panelKey: string | null) => {
    const currentActionWindow = actionWindow.value
    setActionWindow({
      ...currentActionWindow,
      fixedPanelKey: panelKey
    })
  }

  return {
    // Settings (from store) - 直接参照が必要な場合用
    settings: settingsStore.settings,

    // Computed（読み取り専用）
    paging,
    actionWindow,
    messageDisplay,
    theme,
    operation,
    ageLimit,
    fixedPanelKey,
    hasFixedPanel,
    isFixedPanelOpen,

    // Methods
    loadFromCookie,
    setPaging,
    setActionWindow,
    setMessageDisplay,
    setTheme,
    setOperation,
    setAgeLimit,
    getActionPanelOpen,
    setActionPanelOpen,
    setFixedPanelKey
  }
}

/**
 * Form要素共通パターンユーティリティ
 *
 * 旧BuefyフォームコンポーネントからNuxt UIフォームコンポーネントへの移行パターンを定義
 */

// 基本的なInput設定パターン
export const inputPatterns = {
  // 標準的なテキスト入力
  text: {
    type: 'text' as const,
    size: 'sm' as const,
    variant: 'outline' as const
  },

  // パスワード入力
  password: {
    type: 'password' as const,
    size: 'sm' as const,
    variant: 'outline' as const
  },

  // メール入力
  email: {
    type: 'email' as const,
    size: 'sm' as const,
    variant: 'outline' as const
  },

  // 検索入力
  search: {
    type: 'text' as const,
    size: 'sm' as const,
    variant: 'outline' as const,
    icon: 'i-lucide-search' as const
  },

  // 数値入力
  number: {
    type: 'number' as const,
    size: 'sm' as const,
    variant: 'outline' as const
  },

  // 読み取り専用
  readonly: {
    type: 'text' as const,
    size: 'sm' as const,
    variant: 'outline' as const,
    readonly: true
  },

  // 無効化
  disabled: {
    type: 'text' as const,
    size: 'sm' as const,
    variant: 'outline' as const,
    disabled: true
  }
} as const

// Select設定パターン
export const selectPatterns = {
  // 標準的なSelect
  standard: {
    size: 'sm' as const,
    variant: 'outline' as const
  },

  // 複数選択可能なSelect
  multiple: {
    size: 'sm' as const,
    variant: 'outline' as const,
    multiple: true
  },

  // 検索可能なSelect
  searchable: {
    size: 'sm' as const,
    variant: 'outline' as const,
    searchable: true
  },

  // クリア可能なSelect
  clearable: {
    size: 'sm' as const,
    variant: 'outline' as const,
    clearable: true
  },

  // 無効化
  disabled: {
    size: 'sm' as const,
    variant: 'outline' as const,
    disabled: true
  }
} as const

// Checkbox設定パターン
export const checkboxPatterns = {
  // 標準的なCheckbox
  standard: {
    size: 'md' as const,
    color: 'primary' as const
  },

  // 必須項目
  required: {
    size: 'md' as const,
    color: 'primary' as const,
    required: true
  },

  // カードスタイル
  card: {
    size: 'md' as const,
    color: 'primary' as const,
    variant: 'card' as const
  },

  // リストスタイル
  list: {
    size: 'md' as const,
    color: 'primary' as const,
    variant: 'list' as const
  },

  // 無効化
  disabled: {
    size: 'md' as const,
    color: 'primary' as const,
    disabled: true
  }
} as const

// Textarea設定パターン
export const textareaPatterns = {
  // 標準的なTextarea
  standard: {
    size: 'sm' as const,
    variant: 'outline' as const,
    rows: 3
  },

  // 高さ自動調整
  autoresize: {
    size: 'sm' as const,
    variant: 'outline' as const,
    autoresize: true,
    rows: 3
  },

  // 最大行数制限付き自動調整
  autoResizeWithMax: {
    size: 'sm' as const,
    variant: 'outline' as const,
    autoresize: true,
    rows: 3,
    maxrows: 10
  },

  // 大きめのTextarea
  large: {
    size: 'md' as const,
    variant: 'outline' as const,
    rows: 6
  },

  // 無効化
  disabled: {
    size: 'sm' as const,
    variant: 'outline' as const,
    rows: 3,
    disabled: true
  }
} as const

// Switch設定パターン
export const switchPatterns = {
  // 標準的なSwitch
  standard: {
    size: 'md' as const,
    color: 'primary' as const
  },

  // 必須項目
  required: {
    size: 'md' as const,
    color: 'primary' as const,
    required: true
  },

  // 小さいサイズ（Buefy is-small相当）
  small: {
    size: 'sm' as const,
    color: 'primary' as const
  },

  // 大きいサイズ
  large: {
    size: 'lg' as const,
    color: 'primary' as const
  },

  // 読み込み中
  loading: {
    size: 'md' as const,
    color: 'primary' as const,
    loading: true
  },

  // 無効化
  disabled: {
    size: 'md' as const,
    color: 'primary' as const,
    disabled: true
  }
} as const

// RadioGroup設定パターン（b-radio-button風）
export const radioGroupPatterns = {
  // 標準的なRadioGroup（ボタン風） - 直接CSSクラスでスタイリング
  buttonStyle: {
    size: 'sm' as const,
    color: 'primary' as const,
    variant: 'list' as const,
    orientation: 'horizontal' as const,
    indicator: 'hidden' as const,
    class: 'radio-button-style' // カスタムCSSクラスを追加
  },

  // 縦並び（Buefy is-small相当）
  verticalSmall: {
    size: 'sm' as const,
    color: 'primary' as const,
    orientation: 'vertical' as const
  },

  // カードスタイル（横並び）
  cardHorizontal: {
    size: 'md' as const,
    color: 'primary' as const,
    variant: 'card' as const,
    orientation: 'horizontal' as const
  },

  // リストスタイル（縦並び）
  listVertical: {
    size: 'md' as const,
    color: 'primary' as const,
    variant: 'list' as const,
    orientation: 'vertical' as const
  },

  // 小さいボタンスタイル（Buefy size="is-small" type="is-primary"相当）
  smallButton: {
    size: 'xs' as const,
    color: 'primary' as const,
    variant: 'list' as const,
    orientation: 'horizontal' as const,
    indicator: 'hidden' as const,
    class: 'radio-button-small-style'
  },

  // 無効化
  disabled: {
    size: 'sm' as const,
    color: 'primary' as const,
    variant: 'table' as const,
    orientation: 'horizontal' as const,
    disabled: true
  }
} as const

// サイズパターン（共通）
export const formSizePatterns = {
  xs: { size: 'xs' as const },
  sm: { size: 'sm' as const }, // Buefy is-small相当
  md: { size: 'md' as const }, // デフォルト
  lg: { size: 'lg' as const },
  xl: { size: 'xl' as const }
} as const

// 一般的なフォームオプション
export interface FormOption {
  label: string
  value: string | number
  disabled?: boolean
  icon?: string
}

// よく使われるオプションセット
export const commonFormOptions = {
  // Yes/No選択
  yesNo: (): FormOption[] => [
    { label: 'はい', value: 'yes' },
    { label: 'いいえ', value: 'no' }
  ],

  // 性別選択
  gender: (): FormOption[] => [
    { label: '男性', value: 'male' },
    { label: '女性', value: 'female' },
    { label: 'その他', value: 'other' },
    { label: '回答しない', value: 'none' }
  ],

  // 優先度
  priority: (): FormOption[] => [
    { label: '高', value: 'high' },
    { label: '中', value: 'medium' },
    { label: '低', value: 'low' }
  ],

  // ステータス
  status: (): FormOption[] => [
    { label: '有効', value: 'active' },
    { label: '無効', value: 'inactive' },
    { label: '保留', value: 'pending' }
  ]
}

// バリデーション関連のヘルパー
export const validationPatterns = {
  // 必須項目
  required: 'required',

  // メールアドレス
  email: 'required|email',

  // パスワード（最小8文字）
  password: 'required|min:8',

  // 数値のみ
  numeric: 'required|numeric',

  // URL
  url: 'required|url',

  // 電話番号（日本）
  phoneJp: 'required|regex:^[0-9-+()\\s]*$',

  // 郵便番号（日本）
  postalJp: 'required|regex:^[0-9]{3}-?[0-9]{4}$'
} as const

// フォームフィールドの共通設定
export const formFieldDefaults = {
  // 水平レイアウト
  horizontal: false,

  // エラー時の色
  errorColor: 'error' as const,

  // 成功時の色
  successColor: 'success' as const
} as const

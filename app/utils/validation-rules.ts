/**
 * バリデーションルール定義
 *
 * vee-validate v4 + yup を使用したバリデーションスキーマ定義
 */
import * as yup from 'yup'

// 日本語エラーメッセージ設定
yup.setLocale({
  mixed: {
    required: '${path}は必須です',
    notType: '${path}の形式が正しくありません',
  },
  string: {
    min: '${path}は${min}文字以上で入力してください',
    max: '${path}は${max}文字以下で入力してください',
    email: '正しいメールアドレスを入力してください',
    url: '正しいURLを入力してください',
  },
  number: {
    min: '${path}は${min}以上の値を入力してください',
    max: '${path}は${max}以下の値を入力してください',
    positive: '${path}は正の数を入力してください',
    integer: '${path}は整数を入力してください',
  },
})

// 基本的なバリデーションルール
export const validationRules = {
  // 必須項目
  required: yup.string().required(),

  // メールアドレス
  email: yup.string().required().email(),

  // パスワード（最小8文字）
  password: yup.string().required().min(8),

  // 数値のみ
  number: yup.number().required(),

  // 正の整数
  positiveInteger: yup.number().required().positive().integer(),

  // URL
  url: yup.string().required().url(),

  // 電話番号（日本の形式）
  phoneJp: yup
    .string()
    .required()
    .matches(/^[0-9-+()\\s]*$/, '電話番号の形式が正しくありません'),

  // 郵便番号（日本の形式）
  postalJp: yup
    .string()
    .required()
    .matches(/^[0-9]{3}-?[0-9]{4}$/, '郵便番号の形式が正しくありません（例: 123-4567）'),

  // 文字数制限
  minLength: (min: number) => yup.string().required().min(min),
  maxLength: (max: number) => yup.string().required().max(max),
  lengthRange: (min: number, max: number) => yup.string().required().min(min).max(max),

  // 数値範囲
  numberRange: (min: number, max: number) => yup.number().required().min(min).max(max),

  // 選択必須
  selectRequired: yup.string().required('選択してください'),
  multiSelectRequired: yup.array().required().min(1, '少なくとも1つ選択してください'),

  // チェックボックス必須
  checkboxRequired: yup.boolean().required().oneOf([true], 'チェックが必要です'),
} as const

// 人狼ゲーム固有のバリデーションルール
export const firewolfValidationRules = {
  // 村名（1-40文字）
  villageName: yup.string().required().min(1).max(40),

  // キャラクター名（1-8文字程度）
  characterName: yup.string().required().min(1).max(8),

  // キャラクター短縮名（1-4文字程度）
  characterShortName: yup.string().required().min(1).max(4),

  // 参加メッセージ（最大1000文字程度）
  joinMessage: yup.string().max(1000),

  // 発言（最大1000文字程度）
  sayMessage: yup.string().required().max(1000),

  // 村パスワード（最大20文字）
  villagePassword: yup.string().max(20),

  // 人数設定（4-16人程度）
  personCapacity: yup.number().required().min(4).max(16),

  // 更新時間設定（分単位、30-1440分程度）
  dayTimeMinutes: yup.number().required().min(30).max(1440),

  // サイレント時間（0-23時間）
  silentHours: yup.number().min(0).max(23),
} as const

// よく使われるスキーマの組み合わせ
export const commonSchemas = {
  // ログインフォーム
  loginForm: yup.object({
    email: validationRules.email,
    password: validationRules.password,
  }),

  // ユーザー登録フォーム
  registerForm: yup.object({
    email: validationRules.email,
    password: validationRules.password,
    passwordConfirm: yup
      .string()
      .required()
      .oneOf([yup.ref('password')], 'パスワードが一致しません'),
    nickname: validationRules.lengthRange(1, 20),
    agreedToTerms: validationRules.checkboxRequired,
  }),

  // プロフィール編集フォーム
  profileForm: yup.object({
    nickname: validationRules.lengthRange(1, 20),
    introduction: yup.string().max(500),
    twitterUserName: yup.string().max(50),
    otherSiteName: yup.string().max(100),
  }),

  // 村参加フォーム
  villageParticipateForm: yup.object({
    charaId: validationRules.selectRequired,
    charaName: firewolfValidationRules.characterName,
    charaShortName: firewolfValidationRules.characterShortName,
    firstRequestSkill: validationRules.selectRequired,
    secondRequestSkill: validationRules.selectRequired,
    joinMessage: firewolfValidationRules.joinMessage,
    joinPassword: firewolfValidationRules.villagePassword,
  }),

  // 発言フォーム
  sayForm: yup.object({
    message: firewolfValidationRules.sayMessage,
    messageType: validationRules.selectRequired,
    faceType: validationRules.selectRequired,
    targetId: yup.number().nullable(),
  }),
} as const

// バリデーション状態タイプ定義
export interface ValidationState {
  errors: Record<string, string>
  isValid: boolean
  touched: Record<string, boolean>
}

// フィールド状態タイプ定義
export interface FieldState<T = unknown> {
  value: T
  error?: string
  touched: boolean
  valid: boolean
}

// カスタムバリデーション関数の例
export const customValidators = {
  // パスワード強度チェック
  passwordStrength: (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    return password.length >= 8 && 
           [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length >= 3
  },

  // 重複チェック（非同期）
  checkDuplicate: async (_value: string, _endpoint: string): Promise<boolean> => {
    // TODO: API呼び出しでの重複チェック実装
    // 実際の実装では$fetchを使用
    return true
  },

  // 日本語文字チェック
  hasJapanese: (text: string): boolean => {
    return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]/.test(text)
  },
} as const

// エラーメッセージのカスタマイズ
export const errorMessages = {
  required: (field: string) => `${field}は必須項目です`,
  email: () => '正しいメールアドレス形式で入力してください',
  minLength: (field: string, min: number) => `${field}は${min}文字以上で入力してください`,
  maxLength: (field: string, max: number) => `${field}は${max}文字以下で入力してください`,
  passwordMismatch: () => 'パスワードが一致しません',
  passwordWeak: () => 'パスワードは8文字以上で、大文字・小文字・数字・記号のうち3種類以上を含めてください',
  selectRequired: (field: string) => `${field}を選択してください`,
  checkboxRequired: (field: string) => `${field}にチェックを入れてください`,
} as const
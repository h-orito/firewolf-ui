// 村作成フォームのデータ型定義
export interface CreateVillageFormData {
  // 基本情報
  villageName: string

  // 時間設定
  startDatetime: Date
  silentHours: number

  // キャラチップ設定
  charachipIds: number[]
  dummyCharaId: number
  dummyCharaName: string
  dummyCharaShortName: string

  // ダミーキャラ発言
  day0Message: string
  day1Message: string

  // 編成
  organization: string
  availableDummySkill: boolean

  // 詳細ルール
  openVote: boolean
  availableSkillRequest: boolean
  availableSpectate: boolean
  openSkillInGrave: boolean
  visibleGraveMessage: boolean
  availableSuddenlyDeath: boolean
  availableCommit: boolean
  availableAction: boolean
  availableSecretSay: boolean
  availableGuardSameTarget: boolean

  // 発言制限
  normalCount: number
  normalLength: number
  whisperCount: number
  whisperLength: number
  sympathizeCount: number
  sympathizeLength: number
  loversCount: number
  loversLength: number
  graveCount: number
  graveLength: number
  monologueCount: number
  monologueLength: number
  spectateCount: number
  spectateLength: number
  actionCount: number
  actionLength: number

  // 参加パスワード
  joinPassword: string

  // RP設定
  ageLimit: string
  actionCountLimit: string
  actionCharacterLimit: string
}

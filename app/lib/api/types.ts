// API型定義のラッパー - 自動生成されたschema.tsを使用
import type { components } from './schema'

// キャラクター関連型
export type CharaFace = components['schemas']['CharaFace']
export type CharaSize = components['schemas']['CharaSize']
export type CharaName = components['schemas']['CharaName']
export type CharaNameView = components['schemas']['CharaNameView']
export type CharaDefaultMessage = components['schemas']['CharaDefaultMessage']
export type CharaView = components['schemas']['CharaView']
export type Chara = components['schemas']['Chara']
export type Charas = components['schemas']['Charas']

// キャラチップ関連型
export type CharachipView = components['schemas']['CharachipView']
export type CharachipsView = components['schemas']['CharachipsView']
export type Designer = components['schemas']['Designer']

// メッセージ関連型
export type MessageType = components['schemas']['MessageType']
export type MessageTimeView = components['schemas']['MessageTimeView']
export type MessageContent = components['schemas']['MessageContent']
export type MessageView = components['schemas']['MessageView']

// 参加者関連型
export type VillageParticipantView =
  components['schemas']['VillageParticipantView']
export type VillageParticipantName =
  components['schemas']['VillageParticipantName']
export type VillageParticipantStatus =
  components['schemas']['VillageParticipantStatus']

// スキル関連型
export type Skill = components['schemas']['Skill']
export type SkillsView = components['schemas']['SkillsView']
export type ComingOut = components['schemas']['ComingOut']
export type ComingOuts = components['schemas']['ComingOuts']
export type DeadView = components['schemas']['DeadView']

// 村関連型（必要な分のみ）
export type VillageView = components['schemas']['VillageView']
export type VillageParticipantsView =
  components['schemas']['VillageParticipantsView']
export type VillagesView = components['schemas']['VillagesView']
export type SimpleVillageView = components['schemas']['SimpleVillageView']
export type RecruitingVillagesView =
  components['schemas']['RecruitingVillagesView']
export type RecruitingVillageView =
  components['schemas']['RecruitingVillageView']
export type ReservedVillagesView = components['schemas']['ReservedVillagesView']
export type ReservedVillageView = components['schemas']['ReservedVillageView']
export type PlayerRecordsView = components['schemas']['PlayerRecordsView']
export type PlayerView = components['schemas']['PlayerView']
export type MyselfPlayerView = components['schemas']['MyselfPlayerView']
export type VillageSettingsView = components['schemas']['VillageSettingsView']
export type VillageStatus = components['schemas']['VillageStatus']

// 村参加関連型
export type VillageParticipateBody =
  components['schemas']['VillageParticipateBody']

// 発言関連型
export type VillageSayBody = components['schemas']['VillageSayBody']

// 村建て発言関連型
export type CreatorSayBody = components['schemas']['CreatorSayBody']

// アクション発言関連型
export type VillageActionBody = components['schemas']['VillageActionBody']

// カミングアウト関連型
export type VillageComingOutBody = components['schemas']['VillageComingOutBody']

// 村作成関連型
export type VillageRegisterBody = components['schemas']['VillageRegisterBody']
export type VillageSettingRegisterBody =
  components['schemas']['VillageSettingRegisterBody']
export type VillageTimeCreateBody =
  components['schemas']['VillageTimeCreateBody']
export type VillageOrganizationCreateBody =
  components['schemas']['VillageOrganizationCreateBody']
export type VillageCharachipCreateBody =
  components['schemas']['VillageCharachipCreateBody']
export type VillageRuleCreateBody =
  components['schemas']['VillageRuleCreateBody']
export type VillageTagCreateBody = components['schemas']['VillageTagCreateBody']
export type VillageMessageRestrictCreateBody =
  components['schemas']['VillageMessageRestrictCreateBody']

// 村の日付関連型
export type VillageDayView = components['schemas']['VillageDayView']
export type VillageDaysView = components['schemas']['VillageDaysView']

// 参加状況関連型
export type SituationAsParticipantView =
  components['schemas']['SituationAsParticipantView']

// メッセージ関連型
export type MessagesView = components['schemas']['MessagesView']

// 最新情報関連型
export type VillageLatestView = components['schemas']['VillageLatestView']
export type VillageLatestForm = components['schemas']['VillageLatestForm']

// その他
export type Camp = components['schemas']['Camp']
export type CampRecord = components['schemas']['CampRecord']
export type SkillRecord = components['schemas']['SkillRecord']
export type Record = components['schemas']['Record']
export type ParticipateVillageView =
  components['schemas']['ParticipateVillageView']

// デバッグ用村情報
export type DebugVillageView = components['schemas']['DebugVillageView']

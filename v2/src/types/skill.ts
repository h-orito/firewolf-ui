import type { components } from './generated/api'

// API自動生成型から適切な型を再定義
export type Skill = components['schemas']['Skill']
export type Camp = components['schemas']['Camp']
export type AbilityType = components['schemas']['AbilityType']
export type MessageType = components['schemas']['MessageType']
export type SkillsResponse = components['schemas']['SkillsView']

// 役職一覧の型
export interface SkillListItem extends Skill {
  // 必要に応じて拡張可能
}

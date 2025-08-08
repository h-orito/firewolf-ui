/**
 * 村作成関連の型定義
 * generated/api.tsから抽出した型を再エクスポート
 */

import { components, operations } from '@/types/generated/api'

// 村作成API関連の型
export type VillageRegisterOperation = operations['registerVillage']
export type VillageRegisterRequest = components['schemas']['VillageRegisterBody']
export type VillageRegisterResponse = components['schemas']['VillageRegisterView']

// 村作成確認API関連の型
export type VillageRegisterConfirmOperation = operations['confirmRegisterVillage']

// 村設定関連の型
export type VillageSettingRegisterBody = components['schemas']['VillageSettingRegisterBody']
export type VillageTimeCreateBody = components['schemas']['VillageTimeCreateBody']
export type VillageOrganizationCreateBody = components['schemas']['VillageOrganizationCreateBody']
export type VillageCharachipCreateBody = components['schemas']['VillageCharachipCreateBody']
export type VillageRuleCreateBody = components['schemas']['VillageRuleCreateBody']
export type VillageTagCreateBody = components['schemas']['VillageTagCreateBody']
export type VillageMessageRestrictCreateBody =
  components['schemas']['VillageMessageRestrictCreateBody']

// 使いやすいように型を組み合わせ
export interface VillageCreateFormData {
  village_name: string
  setting: VillageSettingRegisterBody
}

// 確認モーダルで使用する型
export type VillageConfirmData = VillageRegisterRequest
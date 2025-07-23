import type { components } from '@/types/generated/api'

type VillageVoteSituation = components['schemas']['VillageVoteSituationView']
type VillageAbilitySituationView = components['schemas']['VillageAbilitySituationView']
type VillageCommitSituation = components['schemas']['VillageCommitSituation']

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * 投票のバリデーション
 */
export function validateVote(
  voteSituation: VillageVoteSituation,
  selectedTargetId?: number
): ValidationResult {
  const errors: string[] = []

  // 投票可能かチェック
  if (!voteSituation.available_vote) {
    errors.push('現在投票することはできません')
  }

  // 対象が選択されているかチェック
  if (!selectedTargetId) {
    errors.push('投票対象を選択してください')
  }

  // 選択された対象が有効かチェック
  if (selectedTargetId && voteSituation.target_list) {
    const isValidTarget = voteSituation.target_list.some((target) => target.id === selectedTargetId)
    if (!isValidTarget) {
      errors.push('無効な投票対象が選択されています')
    }
  }

  // 対象リストが空でないかチェック
  if (!voteSituation.target_list || voteSituation.target_list.length === 0) {
    errors.push('投票可能な対象がありません')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 能力実行のバリデーション
 */
export function validateAbility(
  ability: VillageAbilitySituationView,
  selectedTargetId?: number
): ValidationResult {
  const errors: string[] = []

  // 能力使用可能かチェック
  if (!ability.usable) {
    errors.push('現在この能力を使用することはできません')
  }

  // 対象不要の能力の場合
  if (ability.available_no_target) {
    // 対象不要なので追加バリデーションは不要
    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  // 対象が必要な能力の場合
  if (!selectedTargetId) {
    errors.push('能力の対象を選択してください')
  }

  // 選択された対象が有効かチェック
  if (selectedTargetId && ability.target_list) {
    const isValidTarget = ability.target_list.some((target) => target.id === selectedTargetId)
    if (!isValidTarget) {
      errors.push('無効な能力対象が選択されています')
    }
  }

  // 対象リストが存在するかチェック（対象が必要な能力の場合）
  if (!ability.available_no_target && (!ability.target_list || ability.target_list.length === 0)) {
    errors.push('能力を実行できる対象がありません')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * コミットのバリデーション
 */
export function validateCommit(commitSituation: VillageCommitSituation): ValidationResult {
  const errors: string[] = []

  // コミット可能かチェック
  if (!commitSituation.available_commit) {
    errors.push('現在コミット操作はできません')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 一般的な入力値のバリデーション
 */
export function validateInput(value: unknown): ValidationResult {
  const errors: string[] = []

  if (value === null || value === undefined) {
    errors.push('値が設定されていません')
  }

  if (typeof value === 'string' && value.trim() === '') {
    errors.push('値が空です')
  }

  if (typeof value === 'number' && (isNaN(value) || value <= 0)) {
    errors.push('無効な数値です')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

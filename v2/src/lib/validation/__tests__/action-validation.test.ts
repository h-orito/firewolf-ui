import {
  validateVote,
  validateAbility,
  validateCommit,
  validateInput,
  ValidationResult,
} from '../action-validation'
import type { components } from '@/types/generated/api'

type VillageVoteSituation = components['schemas']['VillageVoteSituationView']
type VillageAbilitySituationView = components['schemas']['VillageAbilitySituationView']
type VillageCommitSituation = components['schemas']['VillageCommitSituation']

describe('validateVote', () => {
  const mockVoteSituation: VillageVoteSituation = {
    availableVote: true,
    targetList: [
      { id: 1, name: 'プレイヤー1' },
      { id: 2, name: 'プレイヤー2' },
    ],
  }

  test('有効な投票を正しくバリデーションする', () => {
    const result = validateVote(mockVoteSituation, 1)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('投票不可の状態でエラーを返す', () => {
    const disabledSituation = { ...mockVoteSituation, availableVote: false }
    const result = validateVote(disabledSituation, 1)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('現在投票することはできません')
  })

  test('対象が選択されていない場合エラーを返す', () => {
    const result = validateVote(mockVoteSituation)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('投票対象を選択してください')
  })

  test('無効な対象IDが選択された場合エラーを返す', () => {
    const result = validateVote(mockVoteSituation, 999)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('無効な投票対象が選択されています')
  })

  test('対象リストが空の場合エラーを返す', () => {
    const emptySituation = { ...mockVoteSituation, targetList: [] }
    const result = validateVote(emptySituation, 1)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('投票可能な対象がありません')
  })
})

describe('validateAbility', () => {
  const mockAbility: VillageAbilitySituationView = {
    usable: true,
    availableNoTarget: false,
    targetList: [
      { id: 1, name: 'プレイヤー1' },
      { id: 2, name: 'プレイヤー2' },
    ],
  }

  test('有効な能力実行を正しくバリデーションする', () => {
    const result = validateAbility(mockAbility, 1)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('使用不可の能力でエラーを返す', () => {
    const disabledAbility = { ...mockAbility, usable: false }
    const result = validateAbility(disabledAbility, 1)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('現在この能力を使用することはできません')
  })

  test('対象不要の能力を正しくバリデーションする', () => {
    const noTargetAbility = { ...mockAbility, availableNoTarget: true }
    const result = validateAbility(noTargetAbility)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('対象が必要な能力で対象未選択の場合エラーを返す', () => {
    const result = validateAbility(mockAbility)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('能力の対象を選択してください')
  })

  test('無効な対象IDが選択された場合エラーを返す', () => {
    const result = validateAbility(mockAbility, 999)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('無効な能力対象が選択されています')
  })

  test('対象リストが空の場合エラーを返す', () => {
    const emptyAbility = { ...mockAbility, targetList: [] }
    const result = validateAbility(emptyAbility, 1)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('能力を実行できる対象がありません')
  })
})

describe('validateCommit', () => {
  const mockCommitSituation: VillageCommitSituation = {
    availableCommit: true,
  }

  test('有効なコミット状況を正しくバリデーションする', () => {
    const result = validateCommit(mockCommitSituation)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('コミット不可の状態でエラーを返す', () => {
    const disabledSituation = { availableCommit: false }
    const result = validateCommit(disabledSituation)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('現在コミット操作はできません')
  })
})

describe('validateInput', () => {
  test('有効な文字列を正しくバリデーションする', () => {
    const result = validateInput('有効なテキスト')
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('有効な数値を正しくバリデーションする', () => {
    const result = validateInput(42)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('null値でエラーを返す', () => {
    const result = validateInput(null)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('値が設定されていません')
  })

  test('undefined値でエラーを返す', () => {
    const result = validateInput(undefined)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('値が設定されていません')
  })

  test('空文字列でエラーを返す', () => {
    const result = validateInput('')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('値が空です')
  })

  test('空白のみの文字列でエラーを返す', () => {
    const result = validateInput('   ')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('値が空です')
  })

  test('NaN値でエラーを返す', () => {
    const result = validateInput(NaN)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('無効な数値です')
  })

  test('0以下の数値でエラーを返す', () => {
    const result = validateInput(0)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('無効な数値です')
  })

  test('負の数値でエラーを返す', () => {
    const result = validateInput(-1)
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('無効な数値です')
  })
})

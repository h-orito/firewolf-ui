// Jest環境では describe, it, expect はグローバルに利用可能
import {
  parseSkillComposition,
  calculateTotalParticipants,
  validateSkillComposition,
  normalizeCompositionString,
  getSkillNameByShortName,
  getSkillByCode,
} from '../skill'
import type { Skill } from '@/types/skill'

// テスト用の役職データ
const mockSkills: Skill[] = [
  {
    code: 'WEREWOLF',
    name: '人狼',
    short_name: '狼',
    win_judge_camp: { name: '人狼陣営', code: 'WEREWOLF' },
    description: 'テスト用人狼',
  },
  {
    code: 'SEER',
    name: '占い師',
    short_name: '占',
    win_judge_camp: { name: '村人陣営', code: 'VILLAGER' },
    description: 'テスト用占い師',
  },
  {
    code: 'PSYCHIC',
    name: '霊能者',
    short_name: '霊',
    win_judge_camp: { name: '村人陣営', code: 'VILLAGER' },
    description: 'テスト用霊能者',
  },
  {
    code: 'HUNTER',
    name: '狩人',
    short_name: '狩',
    win_judge_camp: { name: '村人陣営', code: 'VILLAGER' },
    description: 'テスト用狩人',
  },
  {
    code: 'MADMAN',
    name: '狂人',
    short_name: '狂',
    win_judge_camp: { name: '人狼陣営', code: 'WEREWOLF' },
    description: 'テスト用狂人',
  },
  {
    code: 'VILLAGER',
    name: '村人',
    short_name: '村',
    win_judge_camp: { name: '村人陣営', code: 'VILLAGER' },
    description: 'テスト用村人',
  },
] as Skill[]

describe('skill utils', () => {
  describe('getSkillNameByShortName', () => {
    it('正しい略称で正式名称を取得できる', () => {
      expect(getSkillNameByShortName('狼', mockSkills)).toBe('人狼')
      expect(getSkillNameByShortName('占', mockSkills)).toBe('占い師')
      expect(getSkillNameByShortName('村', mockSkills)).toBe('村人')
    })

    it('存在しない略称の場合nullを返す', () => {
      expect(getSkillNameByShortName('X', mockSkills)).toBeNull()
    })
  })

  describe('getSkillByCode', () => {
    it('正しいコードで役職情報を取得できる', () => {
      const skill = getSkillByCode('WEREWOLF', mockSkills)
      expect(skill?.name).toBe('人狼')
      expect(skill?.short_name).toBe('狼')
    })

    it('存在しないコードの場合nullを返す', () => {
      expect(getSkillByCode('INVALID', mockSkills)).toBeNull()
    })
  })

  describe('parseSkillComposition', () => {
    it('基本的な編成文字列をパースできる', () => {
      const result = parseSkillComposition('狼狼占霊狩狂村村村村', mockSkills)

      expect(result).toHaveLength(6)

      const wolfItem = result.find((item) => item.shortName === '狼')
      expect(wolfItem?.count).toBe(2)
      expect(wolfItem?.skillName).toBe('人狼')
      expect(wolfItem?.isValid).toBe(true)

      const villagerItem = result.find((item) => item.shortName === '村')
      expect(villagerItem?.count).toBe(4)
      expect(villagerItem?.skillName).toBe('村人')
    })

    it('空文字列の場合空配列を返す', () => {
      expect(parseSkillComposition('')).toEqual([])
      expect(parseSkillComposition('   ')).toEqual([])
    })

    it('スキル一覧が提供されていない場合でもパースできる', () => {
      const result = parseSkillComposition('狼狼占村村')

      expect(result).toHaveLength(3)
      expect(result.every((item) => item.skillName === undefined)).toBe(true)
      expect(result.every((item) => item.isValid === true)).toBe(true)
    })

    it('無効な略称を検出できる', () => {
      const result = parseSkillComposition('狼X占村', mockSkills)

      const invalidItem = result.find((item) => item.shortName === 'X')
      expect(invalidItem?.isValid).toBe(false)
      expect(invalidItem?.skillName).toBeUndefined()
    })
  })

  describe('calculateTotalParticipants', () => {
    it('総人数を正しく計算できる', () => {
      const composition = parseSkillComposition('狼狼占霊狩狂村村村村', mockSkills)
      expect(calculateTotalParticipants(composition)).toBe(10)
    })

    it('空の編成の場合0を返す', () => {
      expect(calculateTotalParticipants([])).toBe(0)
    })
  })

  describe('validateSkillComposition', () => {
    it('有効な編成の場合エラーなし', () => {
      const composition = parseSkillComposition('狼狼占霊狩狂村村村村', mockSkills)
      const result = validateSkillComposition(composition, mockSkills)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.totalParticipants).toBe(10)
      expect(result.wolfCount).toBe(3) // 狼2 + 狂1
      expect(result.villagerSideCount).toBe(7) // 占1 + 霊1 + 狩1 + 村4
      expect(result.thirdPartyCount).toBe(0)
      expect(result.campBalance.wolf).toBe(3)
      expect(result.campBalance.villager).toBe(7)
      expect(result.skillCounts['人狼']).toBe(2)
      expect(result.skillCounts['村人']).toBe(4)
    })

    it('最小人数未満の場合エラー', () => {
      const composition = parseSkillComposition('狼占村', mockSkills)
      const result = validateSkillComposition(composition, mockSkills)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('最小人数は5人です')
    })

    it('狼系役職がない場合エラー', () => {
      const composition = parseSkillComposition('占霊狩村村村村村', mockSkills)
      const result = validateSkillComposition(composition, mockSkills)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('狼系役職を1名以上含めてください')
    })

    it('狼系役職が過半数の場合エラー', () => {
      const composition = parseSkillComposition('狼狼狼狂狂村', mockSkills)
      const result = validateSkillComposition(composition, mockSkills)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('狼系役職が過半数を超えています')
    })

    it('無効な略称がある場合エラー', () => {
      const composition = parseSkillComposition('狼X占村村村村村', mockSkills)
      const result = validateSkillComposition(composition, mockSkills)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('無効な役職略称: X')
    })

    it('役欠けなしの場合、村人が必要', () => {
      const composition = parseSkillComposition('狼狼占霊狩狂霊霊', mockSkills)
      const result = validateSkillComposition(composition, mockSkills, false)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('役欠けなしの場合、村人を1名以上含めてください')
    })

    it('役欠けありの場合、死亡可能な役職が必要', () => {
      const composition = parseSkillComposition('狼狼狂狂狂', mockSkills) // 狂人のみ
      const result = validateSkillComposition(composition, mockSkills, true)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain(
        '役欠けありの場合、噛まれて死亡する役職を1名以上含めてください'
      )
    })

    it('陣営バランスの警告チェック', () => {
      const composition = parseSkillComposition('狼占村村村村村村村村', mockSkills) // 狼10%
      const result = validateSkillComposition(composition, mockSkills)

      expect(result.isValid).toBe(true)
      expect(result.warnings).toContain('人狼陣営の比率が低すぎる可能性があります（推奨: 20-35%）')
    })
  })

  describe('normalizeCompositionString', () => {
    it('編成文字列を正規化できる', () => {
      const result = normalizeCompositionString('村村占狼狼霊狩')
      expect(result).toBe('狩占村村霊狼狼') // 実際の並び順（アルファベット順ソート後に各役職を連続出力）
    })

    it('スペースを除去できる', () => {
      const result = normalizeCompositionString('狼 狼 占 村 村')
      expect(result).toBe('占村村狼狼') // 実際の並び順
    })
  })
})

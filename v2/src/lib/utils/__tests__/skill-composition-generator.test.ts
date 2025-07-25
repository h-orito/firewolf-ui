import {
  basicCompositionPattern,
  balancedCompositionPattern,
  randomCompositionPattern,
  popularCompositionTemplates,
  generateComposition,
  generateCompositionsForRange,
  formatCompositionAsV1Style,
  generateV1StyleCompositions,
} from '../skill-composition-generator'
import type { Skill } from '@/types/skill'

// モックスキルデータ
const mockSkills: Skill[] = [
  {
    code: 'WEREWOLF',
    name: '人狼',
    short_name: '狼',
    win_judge_camp: { name: '人狼陣営' },
    ability_types: [],
  },
  {
    code: 'SEER',
    name: '占い師',
    short_name: '占',
    win_judge_camp: { name: '村人陣営' },
    ability_types: [],
  },
  {
    code: 'MEDIUM',
    name: '霊能者',
    short_name: '霊',
    win_judge_camp: { name: '村人陣営' },
    ability_types: [],
  },
  {
    code: 'HUNTER',
    name: '狩人',
    short_name: '狩',
    win_judge_camp: { name: '村人陣営' },
    ability_types: [],
  },
  {
    code: 'MADMAN',
    name: '狂人',
    short_name: '狂',
    win_judge_camp: { name: '人狼陣営' },
    ability_types: [],
  },
  {
    code: 'VILLAGER',
    name: '村人',
    short_name: '村',
    win_judge_camp: { name: '村人陣営' },
    ability_types: [],
  },
  {
    code: 'CAT',
    name: '猫又',
    short_name: '猫',
    win_judge_camp: { name: '村人陣営' },
    ability_types: [],
  },
] as Skill[]

describe('編成自動生成', () => {
  describe('basicCompositionPattern', () => {
    test('5人村の基本編成', () => {
      const result = basicCompositionPattern.generateComposition(5, mockSkills)
      expect(result).toBe('狼占村村村')
    })

    test('7人村の基本編成', () => {
      const result = basicCompositionPattern.generateComposition(7, mockSkills)
      expect(result).toBe('狼占村村村村村')
    })

    test('9人村の基本編成', () => {
      const result = basicCompositionPattern.generateComposition(9, mockSkills)
      expect(result).toBe('狼狼占霊狩狂村村村')
    })

    test('11人村の基本編成', () => {
      const result = basicCompositionPattern.generateComposition(11, mockSkills)
      expect(result).toBe('狼狼占霊狩狂村村村村村')
    })

    test('13人村の基本編成（狼3匹）', () => {
      const result = basicCompositionPattern.generateComposition(13, mockSkills)
      expect(result).toBe('狼狼狼占霊狩狂村村村村村村')
    })
  })

  describe('balancedCompositionPattern', () => {
    test('7人村のバランス編成', () => {
      const result = balancedCompositionPattern.generateComposition(7, mockSkills)
      // 狼30% = 2人、占霊狩で3人、残り2人が村人
      expect(result).toBe('狼狼占霊狩村村')
    })

    test('10人村のバランス編成', () => {
      const result = balancedCompositionPattern.generateComposition(10, mockSkills)
      // 狼30% = 3人、占霊狩で3人、狂人1人、残り3人が村人
      expect(result).toBe('狼狼狼占霊狩狂村村村')
    })
  })

  describe('randomCompositionPattern', () => {
    test('ランダム編成が基本編成をベースにしている', () => {
      const result = randomCompositionPattern.generateComposition(11, mockSkills)
      // 基本編成と同じ人数になることを確認
      expect(result.length).toBe(11)
      // 狼と占いは必ず含まれることを確認
      expect(result).toContain('狼')
      expect(result).toContain('占')
    })
  })

  describe('generateComposition', () => {
    test('正常な編成生成', () => {
      const result = generateComposition(11, basicCompositionPattern, mockSkills)

      expect(result.composition).toBe('狼狼占霊狩狂村村村村村')
      expect(result.pattern).toBe(basicCompositionPattern)
      expect(result.validation.isValid).toBe(true)
      expect(result.validation.totalParticipants).toBe(11)
    })

    test('最小人数未満でエラー', () => {
      expect(() => {
        generateComposition(3, basicCompositionPattern, mockSkills)
      }).toThrow('基本編成の最小人数は5人です')
    })
  })

  describe('generateCompositionsForRange', () => {
    test('人数範囲での編成生成', () => {
      const results = generateCompositionsForRange(5, 7, basicCompositionPattern, mockSkills)

      expect(results).toHaveLength(3)
      expect(results[0].participants).toBe(5)
      expect(results[0].composition).toBe('狼占村村村')
      expect(results[1].participants).toBe(6)
      expect(results[2].participants).toBe(7)
    })
  })

  describe('formatCompositionAsV1Style', () => {
    test('v1形式フォーマット', () => {
      const result = formatCompositionAsV1Style(11, '狼狼占霊狩狂村村村村村')
      expect(result).toBe('11人：狼狼占霊狩狂村村村村村')
    })
  })

  describe('generateV1StyleCompositions', () => {
    test('v1形式での一括生成', () => {
      const result = generateV1StyleCompositions(5, 7, basicCompositionPattern, mockSkills)
      const lines = result.split('\n')

      expect(lines).toHaveLength(3)
      expect(lines[0]).toBe('5人：狼占村村村')
      expect(lines[1]).toBe('6人：狼占村村村村')
      expect(lines[2]).toBe('7人：狼占村村村村村')
    })
  })

  describe('popularCompositionTemplates', () => {
    test('人気編成テンプレートの存在確認', () => {
      expect(popularCompositionTemplates).toHaveLength(4)

      const template = popularCompositionTemplates.find((t) => t.name === '11人村（標準）')
      expect(template).toBeDefined()
      expect(template?.participants).toBe(11)
      expect(template?.composition).toBe('狼狼占霊狩狂村村村村村')
    })
  })
})

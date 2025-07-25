import type { Skill } from '@/types/skill'
import { parseSkillComposition, validateSkillComposition } from './skill'

/**
 * 編成パターンの定義
 */
export interface CompositionPattern {
  name: string
  description: string
  minParticipants: number
  maxParticipants?: number
  generateComposition: (participants: number, skills: Skill[]) => string
}

/**
 * 基本編成パターン（v1準拠）
 * 人数に基づいて狼-占-霊-狩-狂-村の基本構成を生成
 */
export const basicCompositionPattern: CompositionPattern = {
  name: '基本編成',
  description: '狼系-占い-霊能-狩人-狂人-村人の標準的な構成',
  minParticipants: 5,
  maxParticipants: 999,
  generateComposition: (participants: number, skills: Skill[]) => {
    let composition = ''

    // 狼の数を決定
    let wolfCount = 1
    if (participants >= 9) wolfCount = 2
    if (participants >= 13) wolfCount = 3
    if (participants >= 17) wolfCount = 4
    if (participants >= 21) wolfCount = 5

    // 狼系役職
    composition += '狼'.repeat(wolfCount)

    // 占い師（必須）
    composition += '占'

    let remainingParticipants = participants - wolfCount - 1

    // 9人以上の場合は霊能、狩人、狂人を追加
    if (participants >= 9 && remainingParticipants >= 3) {
      composition += '霊狩狂'
      remainingParticipants -= 3
    }

    // 残りを村人で埋める
    composition += '村'.repeat(remainingParticipants)

    return composition
  },
}

/**
 * ランダム編成パターン
 * 基本編成をベースに、一部の役職をランダムに変更
 */
export const randomCompositionPattern: CompositionPattern = {
  name: 'ランダム編成',
  description: '基本編成をベースに、一部の役職をランダムに配置',
  minParticipants: 5,
  maxParticipants: 999,
  generateComposition: (participants: number, skills: Skill[]) => {
    // 基本編成を取得
    let baseComposition = basicCompositionPattern.generateComposition(participants, skills)

    // 村人の一部をランダムな役職に変更
    const villagerSkills = skills.filter(
      (skill) =>
        skill.win_judge_camp.name === '村人陣営' &&
        skill.short_name !== '村' &&
        skill.short_name !== '占' &&
        skill.short_name !== '霊' &&
        skill.short_name !== '狩'
    )

    if (villagerSkills.length > 0 && baseComposition.includes('村')) {
      // 村人の30%程度をランダム役職に変更
      const villagerCount = (baseComposition.match(/村/g) || []).length
      const replaceCount = Math.floor(villagerCount * 0.3)

      for (let i = 0; i < replaceCount; i++) {
        const randomSkill = villagerSkills[Math.floor(Math.random() * villagerSkills.length)]
        baseComposition = baseComposition.replace('村', randomSkill.short_name)
      }
    }

    return baseComposition
  },
}

/**
 * バランス重視編成パターン
 * 陣営バランスを考慮した編成
 */
export const balancedCompositionPattern: CompositionPattern = {
  name: 'バランス編成',
  description: '陣営バランスを重視した編成構成',
  minParticipants: 7,
  maxParticipants: 999,
  generateComposition: (participants: number, skills: Skill[]) => {
    // 狼系役職の割合を30-35%に調整
    const wolfCount = Math.floor(participants * 0.3)
    let composition = '狼'.repeat(wolfCount)

    // 占い師（必須）
    composition += '占'

    let remainingParticipants = participants - wolfCount - 1

    // 対抗役職を追加
    if (remainingParticipants >= 1) {
      composition += '霊'
      remainingParticipants--
    }

    if (remainingParticipants >= 1) {
      composition += '狩'
      remainingParticipants--
    }

    // 狂人系を少し追加
    const madCount = Math.min(Math.floor(participants * 0.1), remainingParticipants)
    if (madCount > 0) {
      composition += '狂'.repeat(madCount)
      remainingParticipants -= madCount
    }

    // 残りを村人で埋める
    composition += '村'.repeat(remainingParticipants)

    return composition
  },
}

/**
 * 人気編成テンプレート
 */
export const popularCompositionTemplates = [
  {
    name: '7人村（初心者向け）',
    participants: 7,
    composition: '狼占霊狩狂村村',
    description: '初心者にも分かりやすい基本的な7人構成',
  },
  {
    name: '11人村（標準）',
    participants: 11,
    composition: '狼狼占霊狩狂村村村村村',
    description: '最も一般的な11人村の構成',
  },
  {
    name: '15人村（大規模）',
    participants: 15,
    composition: '狼狼狼占霊狩狂村村村村村村村村',
    description: '大規模村でよく使われる15人構成',
  },
  {
    name: '9人猫又村',
    participants: 9,
    composition: '狼狼占霊狩猫村村村',
    description: '猫又入りの変則的な構成',
  },
]

/**
 * 利用可能な編成パターン一覧
 */
export const compositionPatterns: CompositionPattern[] = [
  basicCompositionPattern,
  balancedCompositionPattern,
  randomCompositionPattern,
]

/**
 * 指定された人数と設定で編成を自動生成する
 */
export function generateComposition(
  participants: number,
  pattern: CompositionPattern,
  skills: Skill[]
): {
  composition: string
  validation: any
  pattern: CompositionPattern
} {
  // 人数制限チェック
  if (participants < pattern.minParticipants) {
    throw new Error(`${pattern.name}の最小人数は${pattern.minParticipants}人です`)
  }

  if (pattern.maxParticipants && participants > pattern.maxParticipants) {
    throw new Error(`${pattern.name}の最大人数は${pattern.maxParticipants}人です`)
  }

  // 編成生成
  const composition = pattern.generateComposition(participants, skills)

  // バリデーション
  const parsed = parseSkillComposition(composition, skills)
  const validation = validateSkillComposition(parsed, skills)

  return {
    composition,
    validation,
    pattern,
  }
}

/**
 * 人数範囲で複数の編成を一括生成する
 */
export function generateCompositionsForRange(
  minParticipants: number,
  maxParticipants: number,
  pattern: CompositionPattern,
  skills: Skill[]
): Array<{
  participants: number
  composition: string
  validation: any
}> {
  const results = []

  for (let i = minParticipants; i <= maxParticipants; i++) {
    try {
      const result = generateComposition(i, pattern, skills)
      results.push({
        participants: i,
        composition: result.composition,
        validation: result.validation,
      })
    } catch (error) {
      // エラーの場合はスキップ
      continue
    }
  }

  return results
}

/**
 * 編成からv1形式の文字列を生成する（「10人：狼狼占霊狩狂村村村村」形式）
 */
export function formatCompositionAsV1Style(participants: number, composition: string): string {
  return `${participants}人：${composition}`
}

/**
 * 人数範囲での編成一括生成（v1互換形式）
 */
export function generateV1StyleCompositions(
  minParticipants: number,
  maxParticipants: number,
  pattern: CompositionPattern,
  skills: Skill[]
): string {
  const compositions = generateCompositionsForRange(
    minParticipants,
    maxParticipants,
    pattern,
    skills
  )

  return compositions
    .map((result) => formatCompositionAsV1Style(result.participants, result.composition))
    .join('\n')
}

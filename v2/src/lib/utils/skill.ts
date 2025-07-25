import type { Skill } from '@/types/skill'

/**
 * 役職の略称から正式名称を取得する
 */
export function getSkillNameByShortName(shortName: string, skills: Skill[]): string | null {
  const skill = skills.find((s) => s.short_name === shortName)
  return skill ? skill.name : null
}

/**
 * 役職コードから役職情報を取得する
 */
export function getSkillByCode(code: string, skills: Skill[]): Skill | null {
  return skills.find((s) => s.code === code) || null
}

/**
 * 役職編成文字列をパースする
 * 例: "狼狼占霊狩狂村村村村" -> [{ shortName: "狼", count: 2 }, { shortName: "占", count: 1 }, ...]
 */
export interface ParsedSkillComposition {
  shortName: string
  count: number
  skillName?: string // 正式名称（スキル一覧が提供されている場合）
  isValid: boolean // 有効な略称かどうか
}

export function parseSkillComposition(
  compositionStr: string,
  skills?: Skill[]
): ParsedSkillComposition[] {
  if (!compositionStr.trim()) {
    return []
  }

  // 略称ごとの出現回数を集計
  const shortNameCounts = new Map<string, number>()

  for (const char of compositionStr.trim()) {
    if (char === ' ') continue // スペースは無視
    const currentCount = shortNameCounts.get(char) || 0
    shortNameCounts.set(char, currentCount + 1)
  }

  // 結果を構築
  const result: ParsedSkillComposition[] = []

  for (const [shortName, count] of shortNameCounts.entries()) {
    const skillName = skills ? (getSkillNameByShortName(shortName, skills) ?? undefined) : undefined
    const isValid = skills ? skillName !== undefined : true

    result.push({
      shortName,
      count,
      skillName,
      isValid,
    })
  }

  return result.sort((a, b) => a.shortName.localeCompare(b.shortName))
}

/**
 * パース結果から総人数を計算する
 */
export function calculateTotalParticipants(composition: ParsedSkillComposition[]): number {
  return composition.reduce((total, item) => total + item.count, 0)
}

/**
 * 編成文字列から役職部分のみを抽出する
 */
export function extractSkillStringsFromComposition(compositionStr: string): string[] {
  const lines = compositionStr.split('\n').filter((line) => line.trim())
  const skillStrings: string[] = []

  for (const line of lines) {
    const match = line.match(/^(\d+)人[：:](.+)$/)
    if (match) {
      skillStrings.push(match[2]) // 役職部分のみ
    } else {
      // xx人:形式でない場合は全体を役職として扱う
      skillStrings.push(line.trim())
    }
  }

  return skillStrings
}

/**
 * 人数ごとの詳細情報を計算する
 */
export function calculateParticipantDetails(
  compositionLines: string[],
  skills?: Skill[],
  isDummySkillMissing?: boolean
): ParticipantDetail[] {
  const details: ParticipantDetail[] = []

  for (const line of compositionLines) {
    const match = line.match(/^(\d+)人[：:](.+)$/)
    if (!match) continue

    const participants = parseInt(match[1])
    const skillString = match[2]

    // 役職文字列をパースして陣営カウント
    const composition = parseSkillComposition(skillString, skills)
    let wolfCount = 0
    let humanCount = 0

    for (const item of composition) {
      if (!skills) {
        // スキル情報がない場合は略称で判定
        if (['狼', '狂', '背'].includes(item.shortName)) {
          wolfCount += item.count
        } else {
          humanCount += item.count
        }
      } else {
        const skill = skills.find((s) => s.short_name === item.shortName)
        if (skill && skill.count_camp) {
          if (skill.count_camp.code === 'WEREWOLF') {
            wolfCount += item.count
          } else if (skill.count_camp.code === 'VILLAGER') {
            humanCount += item.count
          }
          // count_camp.codeがnullの場合はどちらにもカウントしない
        }
      }
    }

    // 縄数計算: (人狼カウント+人間カウント-2)/2の切り上げ
    const ropeCount = Math.ceil((wolfCount + humanCount - 2) / 2)

    // 人数ごとのバリデーション
    const errors: string[] = []
    const warnings: string[] = []

    // 編成人数の整合性チェック
    const totalCompositionCount = composition.reduce((total, item) => total + item.count, 0)
    if (totalCompositionCount !== participants) {
      errors.push(
        `編成人数が合いません（指定: ${participants}人、実際: ${totalCompositionCount}人）`
      )
    }

    // 狼カウント役職チェック
    if (wolfCount === 0) {
      errors.push('狼系役職を1名以上含めてください')
    }

    // 陣営バランスチェック: (村人カウント + 1) > 人狼カウント
    if (!(humanCount + 1 > wolfCount)) {
      errors.push('村人陣営が人狼陣営に対して少なすぎます')
    }

    // 役欠け設定に応じたチェック
    if (isDummySkillMissing === false) {
      // 役欠けなしの場合は村人を1名以上含める必要がある
      const villagerCount = composition.find((item) => item.shortName === '村')?.count || 0
      if (villagerCount === 0) {
        errors.push('役欠けなしの場合、村人を1名以上含めてください')
      }
    } else if (isDummySkillMissing === true) {
      // 役欠けありの場合は噛まれて死亡する役職を1名以上含める必要がある
      const hasDeadableRole = composition.some((item) => {
        if (!skills) return item.shortName !== '猫' // スキル情報がない場合は猫以外
        const skill = skills.find((s) => s.short_name === item.shortName)
        return skill && skill.count_camp?.code === 'VILLAGER' && skill.short_name !== '猫'
      })
      if (!hasDeadableRole) {
        errors.push('役欠けありの場合、噛まれて死亡する役職を1名以上含めてください')
      }
    }

    details.push({
      participants,
      wolfCount,
      humanCount,
      ropeCount,
      errors,
      warnings,
    })
  }

  return details.sort((a, b) => a.participants - b.participants)
}

/**
 * 人数ごとの詳細情報
 */
export interface ParticipantDetail {
  participants: number
  wolfCount: number
  humanCount: number
  ropeCount: number
  errors: string[]
  warnings: string[]
}

/**
 * 編成の妥当性をチェックする
 */
export interface CompositionValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  totalParticipants: number
  wolfCount: number
  villagerSideCount: number
  thirdPartyCount: number
  campBalance: {
    wolf: number
    villager: number
    thirdParty: number
  }
  skillCounts: { [skillName: string]: number }
  participantDetails: ParticipantDetail[]
}

export function validateSkillComposition(
  composition: ParsedSkillComposition[],
  skills?: Skill[],
  isDummySkillMissing?: boolean,
  originalCompositionText?: string,
  minParticipants?: number,
  maxParticipants?: number
): CompositionValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // 総人数計算
  const totalParticipants = calculateTotalParticipants(composition)

  // 無効な略称チェック
  const invalidShortNames = composition.filter((item) => !item.isValid)
  if (invalidShortNames.length > 0) {
    errors.push(`無効な役職略称: ${invalidShortNames.map((item) => item.shortName).join(', ')}`)
  }

  // 最小・最大人数チェック
  if (totalParticipants < 5) {
    errors.push('最小人数は5人です')
  }
  if (totalParticipants > 999) {
    errors.push('最大人数は999人です')
  }

  let wolfCount = 0
  let villagerSideCount = 0
  let thirdPartyCount = 0
  const skillCounts: { [skillName: string]: number } = {}

  if (skills) {
    // 陣営バランスチェック（役職データがある場合）
    for (const item of composition) {
      if (item.skillName) {
        const skill = skills.find((s) => s.name === item.skillName)
        if (skill) {
          // 役職別カウント
          skillCounts[skill.name] = (skillCounts[skill.name] || 0) + item.count

          // 陣営別カウント
          const campName = skill.win_judge_camp.name
          if (campName === '人狼陣営') {
            wolfCount += item.count
          } else if (campName === '村人陣営') {
            villagerSideCount += item.count
          } else {
            // 恋人陣営、妖狐陣営など第三陣営
            thirdPartyCount += item.count
          }
        }
      }
    }

    // 人狼系役職の存在チェック
    if (wolfCount === 0) {
      errors.push('狼系役職を1名以上含めてください')
    }

    // 人狼系役職が過半数チェック
    if (wolfCount >= totalParticipants / 2) {
      errors.push('狼系役職が過半数を超えています')
    }

    // ダミー役欠け設定に応じたチェック
    if (isDummySkillMissing === false) {
      // 役欠けなしの場合は村人を1名以上含める必要がある
      const villagerCount = skillCounts['村人'] || 0
      if (villagerCount === 0) {
        errors.push('役欠けなしの場合、村人を1名以上含めてください')
      }
    } else if (isDummySkillMissing === true) {
      // 役欠けありの場合は噛まれて死亡する役職を1名以上含める必要がある
      const hasDeadableRole = composition.some((item) => {
        const skill = skills.find((s) => s.name === item.skillName)
        return skill && skill.win_judge_camp.name === '村人陣営' && skill.short_name !== '猫'
      })
      if (!hasDeadableRole) {
        errors.push('役欠けありの場合、噛まれて死亡する役職を1名以上含めてください')
      }
    }

    // 村人系役職の存在チェック
    if (villagerSideCount === 0) {
      warnings.push('村人陣営の役職が含まれていません')
    }

    // 特殊役職の重複チェックは削除（人数制限なし）

    // 陣営バランスの推奨チェック
    const wolfRatio = wolfCount / totalParticipants
    if (wolfRatio < 0.2) {
      warnings.push('人狼陣営の比率が低すぎる可能性があります（推奨: 20-35%）')
    } else if (wolfRatio > 0.4) {
      warnings.push('人狼陣営の比率が高すぎる可能性があります（推奨: 20-35%）')
    }

    // 第三陣営が多すぎるチェック
    if (thirdPartyCount > totalParticipants / 3) {
      warnings.push('第三陣営が多すぎる可能性があります')
    }
  }

  // 人数ごとの詳細情報を計算
  const participantDetails = originalCompositionText
    ? calculateParticipantDetails(
        originalCompositionText.split('\n').filter((line) => line.trim()),
        skills,
        isDummySkillMissing
      )
    : []

  // 人数範囲の完全性チェック
  if (minParticipants && maxParticipants && participantDetails.length > 0) {
    const presentParticipants = new Set(participantDetails.map((detail) => detail.participants))
    const missingParticipants: number[] = []

    for (let i = minParticipants; i <= maxParticipants; i++) {
      if (!presentParticipants.has(i)) {
        missingParticipants.push(i)
      }
    }

    if (missingParticipants.length > 0) {
      errors.push(`以下の人数の編成が不足しています: ${missingParticipants.join(', ')}人`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalParticipants,
    wolfCount,
    villagerSideCount,
    thirdPartyCount,
    campBalance: {
      wolf: wolfCount,
      villager: villagerSideCount,
      thirdParty: thirdPartyCount,
    },
    skillCounts,
    participantDetails,
  }
}

/**
 * 編成文字列を正規化する（スペース除去、順序統一など）
 */
export function normalizeCompositionString(compositionStr: string): string {
  const parsed = parseSkillComposition(compositionStr)
  return parsed.flatMap((item) => Array(item.count).fill(item.shortName)).join('')
}

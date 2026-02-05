import { MESSAGE_TYPE } from '~/lib/api/message-constants'

/**
 * URL形式のアンカー変換ユーティリティ
 */

// MESSAGE_TYPE → URL接頭辞のマッピング
const typeToUrlPrefixMap = new Map<string, string>([
  [MESSAGE_TYPE.NORMAL_SAY, 'n'],
  [MESSAGE_TYPE.WEREWOLF_SAY, 'w'],
  [MESSAGE_TYPE.SECRET_SAY, 'S'],
  [MESSAGE_TYPE.SYMPATHIZE_SAY, 'm'],
  [MESSAGE_TYPE.LOVERS_SAY, 'l'],
  [MESSAGE_TYPE.SPECTATE_SAY, 's'],
  [MESSAGE_TYPE.MONOLOGUE_SAY, 'M'],
  [MESSAGE_TYPE.GRAVE_SAY, 'g'],
  [MESSAGE_TYPE.ACTION, 'a']
])

// URL接頭辞 → MESSAGE_TYPEのマッピング
const urlPrefixToTypeMap = new Map<string, string>([
  ['n', MESSAGE_TYPE.NORMAL_SAY],
  ['w', MESSAGE_TYPE.WEREWOLF_SAY],
  ['S', MESSAGE_TYPE.SECRET_SAY],
  ['m', MESSAGE_TYPE.SYMPATHIZE_SAY],
  ['l', MESSAGE_TYPE.LOVERS_SAY],
  ['s', MESSAGE_TYPE.SPECTATE_SAY],
  ['M', MESSAGE_TYPE.MONOLOGUE_SAY],
  ['g', MESSAGE_TYPE.GRAVE_SAY],
  ['a', MESSAGE_TYPE.ACTION]
])

export interface ParsedAnchor {
  typeCode: string
  number: number
}

/**
 * MESSAGE_TYPEからURL接頭辞に変換
 */
export const convertToUrlPrefix = (typeCode: string): string | null => {
  return typeToUrlPrefixMap.get(typeCode) ?? null
}

/**
 * URL接頭辞からMESSAGE_TYPEに変換
 */
export const convertToMessageType = (prefix: string): string | null => {
  return urlPrefixToTypeMap.get(prefix) ?? null
}

/**
 * URLアンカー文字列をパース（例: "n1_w5_S10" → [{typeCode: "NORMAL_SAY", number: 1}, ...]）
 */
export const parseAnchorsFromUrl = (anchorsStr: string): ParsedAnchor[] => {
  if (!anchorsStr) return []

  const result: ParsedAnchor[] = []

  for (const str of anchorsStr.split('_')) {
    if (str.length < 2) continue

    const prefix = str.charAt(0)
    const typeCode = convertToMessageType(prefix)
    if (!typeCode) continue

    const numberStr = str.substring(1)
    const number = parseInt(numberStr, 10)
    if (isNaN(number)) continue

    result.push({ typeCode, number })
  }

  return result
}

/**
 * アンカー配列をURL文字列に変換（例: [{typeCode: "NORMAL_SAY", number: 1}, ...] → "n1_w5"）
 */
export const encodeAnchorsToUrl = (anchors: ParsedAnchor[]): string => {
  return anchors
    .map((anchor) => {
      const prefix = convertToUrlPrefix(anchor.typeCode)
      if (!prefix) return null
      return `${prefix}${anchor.number}`
    })
    .filter((s): s is string => s !== null)
    .join('_')
}

/**
 * 新しいアンカーをURL文字列に追加
 */
export const appendAnchorToUrl = (
  currentAnchorsStr: string,
  typeCode: string,
  number: number
): string | null => {
  const prefix = convertToUrlPrefix(typeCode)
  if (!prefix) return null

  const newAnchor = `${prefix}${number}`
  return currentAnchorsStr ? `${currentAnchorsStr}_${newAnchor}` : newAnchor
}

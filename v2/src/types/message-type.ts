/**
 * メッセージ種別の定数定義
 */
export const MESSAGE_TYPE_LABELS = {
  NORMAL_SAY: '通常発言',
  WEREWOLF_SAY: '人狼の囁き',
  SYMPATHIZE_SAY: '共鳴発言',
  GRAVE_SAY: '死者の呻き',
  MONOLOGUE_SAY: '独り言',
  SPECTATE_SAY: '見学発言',
} as const

export type MessageTypeLabel = (typeof MESSAGE_TYPE_LABELS)[keyof typeof MESSAGE_TYPE_LABELS]

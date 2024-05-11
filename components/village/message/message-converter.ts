import Chara from '~/components/type/chara'
import Message from '~/components/type/message'
import { MESSAGE_TYPE } from '~/components/const/consts'

export interface SayMessage {
  unix_time_milli: number // idに使う
  message_class: string
  is_anchor_message: boolean
  is_disp_anchor: boolean
  anchor_string: string
  anchor_copy_string: string
  day: number
  chara_name: string
  target_chara_name: string | null
  comingout: string | null
  nickname: string | null
  twitter_user_name: string | null
  current_count: number | null
  max_count: number
  datetime: string
  chara: Chara
  face_type_code: string
  message_text: string
  can_reply: boolean
  can_secret: boolean
}

export interface SayMessageSentence {
  is_anchor: boolean
  text: string
}

export interface ActionMessage {
  unix_time_milli: number // idに使う
  message_class: string
  is_anchor_message: boolean
  is_disp_anchor: boolean
  anchor_string: string
  anchor_copy_string: string
  day: number
  datetime: string
  chara: Chara
  message_text: string
}

export interface SystemMessage {
  unix_time_milli: number // idに使う
  message_class: string
  message_text: string
}

export const convertToSayMessage = (
  message: Message,
  isAnchorMessage: boolean,
  isProgress: boolean,
  maxCount: number,
  isDispDate: boolean,
  canReply: boolean,
  canSecret: boolean
): SayMessage => {
  const typeCode: string = message.content.type.code
  const isDispAnchor: boolean = _isDispAnchor(isProgress, typeCode)
  const anchorString = createAnchorString(typeCode, message.content.num!)
  const anchorCopyString: string = createAnchorCopyString(
    typeCode,
    anchorString,
    message.from!.chara_name.short_name
  )
  return {
    unix_time_milli: message.time.unix_time_milli,
    message_class: sayMessageClassMap.get(message.content.type.code) || '',
    is_anchor_message: isAnchorMessage,
    is_disp_anchor: isDispAnchor,
    anchor_string: isDispAnchor ? anchorString : '',
    anchor_copy_string: anchorCopyString,
    day: message.time.day,
    chara_name: message.from!.name,
    target_chara_name: message.to?.chara?.chara_name?.full_name,
    comingout:
      message.from!.comming_outs.list.length === 0
        ? null
        : message
            .from!.comming_outs.list.map(co => co.skill.short_name)
            .join(',') + 'CO',
    nickname: message.from!.player?.nickname,
    twitter_user_name: message.from!.player?.twitter_user_name,
    current_count: message.content.count,
    max_count: maxCount,
    datetime: isDispDate
      ? message.time.datetime
      : message.time.datetime.substring(11),
    chara: message.from!.chara,
    face_type_code: message.content.face_code,
    message_text: convertToMessageText(message.content.text),
    can_reply: canReply && isDispAnchor,
    can_secret: canSecret
  } as SayMessage
}

export const convertToActionMessage = (
  message: Message,
  isAnchorMessage: boolean,
  isProgress: boolean,
  isDispDate: boolean
): ActionMessage => {
  const typeCode: string = message.content.type.code
  const isDispAnchor: boolean = _isDispAnchor(isProgress, typeCode)
  const anchorString = createAnchorString(typeCode, message.content.num!)
  const anchorCopyString: string = createAnchorCopyString(
    typeCode,
    anchorString,
    message.from!.chara_name.short_name
  )
  return {
    unix_time_milli: message.time.unix_time_milli,
    message_class: sayMessageClassMap.get(message.content.type.code) || '',
    is_anchor_message: isAnchorMessage,
    is_disp_anchor: isDispAnchor,
    anchor_string: isDispAnchor ? anchorString : '',
    anchor_copy_string: anchorCopyString,
    day: message.time.day,
    datetime: isDispDate
      ? message.time.datetime
      : message.time.datetime.substring(11),
    chara: message.from!.chara,
    message_text: convertToMessageText(message.content.text)
  } as ActionMessage
}

const _isDispAnchor = (isProgress: boolean, sayType: string): boolean => {
  // 独り言、秘話以外なら表示
  if (
    sayType !== MESSAGE_TYPE.MONOLOGUE_SAY &&
    sayType !== MESSAGE_TYPE.SECRET_SAY
  ) {
    return true
  }
  // 独り言、秘話は進行中なら表示しない
  return !isProgress
}

const createAnchorString = (typeCode: string, num: number): string => {
  const prefix = anchorPrefixMap.get(typeCode)
  if (prefix == null) return ''
  return `>>${prefix}${num}`
}

const createAnchorCopyString = (
  typeCode: string,
  anchorString: string,
  shortName: string
): string => {
  if (typeCode === MESSAGE_TYPE.WEREWOLF_SAY) return anchorString
  return shortName + anchorString
}

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const convertToMessageText = (text: string): string => {
  return convertToAnchorTag(convertToDecoratedText(escapeHtml(text)))
}

const colorRegex = /\[\[(#[0-9a-fA-F]{6})\]\]([\s\S]*?)\[\[\/#\]\]/g
const boldRegex = /\[\[b\]\]([\s\S]*?)\[\[\/b\]\]/g
const strikeRegex = /\[\[s\]\]([\s\S]*?)\[\[\/s\]\]/g
const largeRegex = /\[\[large\]\]([\s\S]*?)\[\[\/large\]\]/g
const smallRegex = /\[\[small\]\]([\s\S]*?)\[\[\/small\]\]/g
const rubyRegex = /\[\[ruby\]\]([\s\S]*?)\[\[rt\]\]([\s\S]*?)\[\[\/rt\]\]\[\[\/ruby\]\]/g

const convertToDecoratedText = (text: string): string => {
  let t = String(text)
  t = t.replace(colorRegex, '<span style="color: $1">$2</span>')
  t = t.replace(boldRegex, '<strong>$1</strong>')
  t = t.replace(
    strikeRegex,
    '<span style="text-decoration: line-through;">$1</span>'
  )
  t = t.replace(largeRegex, '<span style="font-size: 150%;">$1</span>')
  t = t.replace(smallRegex, '<span style="font-size: 80%;">$1</span>')
  t = t.replace(rubyRegex, '<ruby>$1<rt>$2</rt></ruby>')
  return t
}

export const convertToSystemMessage = (message: Message): SystemMessage => {
  return {
    unix_time_milli: message.time.unix_time_milli,
    message_class: systemMessageClassMap.get(message.content.type.code) || '',
    message_text: convertToMessageText(message.content.text)
  } as SystemMessage
}

const anchorRegexps: RegExp[] = [
  /(&gt;&gt;\d{1,5})/g,
  /(&gt;&gt;\+\d{1,5})/g,
  /(&gt;&gt;=\d{1,5})/g,
  /(&gt;&gt;@\d{1,5})/g,
  /(&gt;&gt;-\d{1,5})/g,
  /(&gt;&gt;\*\d{1,5})/g,
  /(&gt;&gt;#\d{1,5})/g,
  /(&gt;&gt;a\d{1,5})/g,
  /(&gt;&gt;s\d{1,5})/g
]

const convertToAnchorTag = (text: string): string => {
  let t = String(text)
  anchorRegexps.forEach(regex => {
    t = t.replace(regex, '<a href="javascript:void(0);" class="anchor">$1</a>')
  })
  return t
}

export const getAnchorType = (mes: string): string | null => {
  const text = escapeHtml(mes)
  if (text.match(/(&gt;&gt;\d{1,5})/)) {
    return MESSAGE_TYPE.NORMAL_SAY
  } else if (text.match(/(&gt;&gt;-\d{1,5})/)) {
    return MESSAGE_TYPE.MONOLOGUE_SAY
  } else if (text.match(/(&gt;&gt;\*\d{1,5})/)) {
    return MESSAGE_TYPE.WEREWOLF_SAY
  } else if (text.match(/(&gt;&gt;\+\d{1,5})/)) {
    return MESSAGE_TYPE.GRAVE_SAY
  } else if (text.match(/(&gt;&gt;=\d{1,5})/)) {
    return MESSAGE_TYPE.SYMPATHIZE_SAY
  } else if (text.match(/(&gt;&gt;@\d{1,5})/)) {
    return MESSAGE_TYPE.SPECTATE_SAY
  } else if (text.match(/(&gt;&gt;#\d{1,5})/)) {
    return MESSAGE_TYPE.CREATOR_SAY
  } else if (text.match(/(&gt;&gt;a\d{1,5})/)) {
    return MESSAGE_TYPE.ACTION
  } else if (text.match(/(&gt;&gt;s\d{1,5})/)) {
    return MESSAGE_TYPE.SECRET_SAY
  }
  return null
}

export const getAnchorNum = (text: string): number =>
  parseInt(RegExp(/\d{1,5}/).exec(text)![0])

const sayMessageClassMap: Map<string, string> = new Map([
  [MESSAGE_TYPE.NORMAL_SAY, 'normal-say'],
  [MESSAGE_TYPE.WEREWOLF_SAY, 'werewolf-say'],
  [MESSAGE_TYPE.MONOLOGUE_SAY, 'monologue-say'],
  [MESSAGE_TYPE.SYMPATHIZE_SAY, 'sympathize-say'],
  [MESSAGE_TYPE.GRAVE_SAY, 'grave-say'],
  [MESSAGE_TYPE.SPECTATE_SAY, 'spectate-say'],
  [MESSAGE_TYPE.ACTION, 'action-say'],
  [MESSAGE_TYPE.SECRET_SAY, 'secret-say']
])

const systemMessageClassMap: Map<string, string> = new Map([
  [MESSAGE_TYPE.PUBLIC_SYSTEM, ''],
  [MESSAGE_TYPE.PRIVATE_SYSTEM, 'message-system-private'],
  [MESSAGE_TYPE.PRIVATE_SEER, 'message-system-private-seer'],
  [MESSAGE_TYPE.PRIVATE_WISE, 'message-system-private-seer'],
  [MESSAGE_TYPE.PRIVATE_PSYCHIC, 'message-system-private-psychic'],
  [MESSAGE_TYPE.PRIVATE_GURU, 'message-system-private-psychic'],
  [MESSAGE_TYPE.PRIVATE_CORONER, 'message-system-private-psychic'],
  [MESSAGE_TYPE.PRIVATE_WEREWOLF, 'message-system-private-werewolf'],
  [MESSAGE_TYPE.PRIVATE_FANATIC, 'message-system-private-werewolf'],
  [MESSAGE_TYPE.PRIVATE_MASON, 'message-system-private-mason'],
  [MESSAGE_TYPE.PRIVATE_FOX, 'message-system-private-fox'],
  [MESSAGE_TYPE.PRIVATE_SYMPATHIZER, 'message-system-private-mason'],
  [MESSAGE_TYPE.CREATOR_SAY, 'message-system-creator'],
  [MESSAGE_TYPE.PARTICIPANTS, '']
])

const anchorPrefixMap: Map<string, string> = new Map([
  [MESSAGE_TYPE.NORMAL_SAY, ''],
  [MESSAGE_TYPE.MONOLOGUE_SAY, '-'],
  [MESSAGE_TYPE.GRAVE_SAY, '+'],
  [MESSAGE_TYPE.WEREWOLF_SAY, '*'],
  [MESSAGE_TYPE.SYMPATHIZE_SAY, '='],
  [MESSAGE_TYPE.SPECTATE_SAY, '@'],
  [MESSAGE_TYPE.CREATOR_SAY, '#'],
  [MESSAGE_TYPE.ACTION, 'a'],
  [MESSAGE_TYPE.SECRET_SAY, 's']
])

<template>
  <div class="say-message">
    <!-- 1段目: アンカー、名前、発言時間 -->
    <div class="mb-1 flex items-center text-xs">
      <!-- 左側: アンカー、名前、CO、プレイヤー名 -->
      <div class="flex flex-1 items-center gap-1">
        <!-- アンカー -->
        <span v-if="isDispAnchor && anchorString">
          <a
            href="javascript:void(0);"
            class="cursor-pointer text-blue-600 hover:underline dark:text-[#14b4ff]"
            @click="handleCopyAnchor"
          >
            {{ anchorString }} </a
          >.
        </span>

        <!-- キャラクター名 -->
        <span class="font-bold dark:text-[#eee]">
          {{ characterName }}
          <span v-if="targetCharacterName">→ {{ targetCharacterName }}</span>
        </span>

        <!-- カミングアウト -->
        <span
          v-if="comingOutString"
          class="rounded border border-gray-300 px-1 py-0.5 text-xs"
        >
          {{ comingOutString }}
        </span>

        <!-- プレイヤー名 -->
        <span v-if="twitterUserName" class="text-xs">
          [<a
            :href="`https://twitter.com/${twitterUserName}`"
            target="_blank"
            class="text-blue-600 hover:underline dark:text-[#14b4ff]"
          >
            {{ twitterUserName }} </a
          >]
        </span>
        <span v-else-if="nickname" class="text-xs"> [{{ nickname }}] </span>
      </div>

      <!-- 右側: 発言回数と時間 -->
      <div
        class="flex items-center gap-2 text-xs text-gray-400 dark:text-[#ddd]"
      >
        <span v-if="isAnchorMessage"> {{ message.time.day }}d </span>
        <span v-if="message.content.count && maxCount">
          ({{ message.content.count }}/{{ maxCount }})
        </span>
        <span>{{ displayTime }}</span>
      </div>
    </div>

    <!-- 2段目: キャラクター画像と発言内容 -->
    <div class="flex gap-2">
      <!-- 左側: キャラクター画像 -->
      <div class="shrink-0">
        <CharaImage
          v-if="message.from?.chara"
          :chara="message.from.chara"
          :face-type="message.content.face_code || 'NORMAL'"
          :width="imageWidth"
          :height="imageHeight"
        />
      </div>

      <!-- 右側: 発言内容とアクションボタン -->
      <div class="flex-1">
        <!-- 発言内容（装飾・アンカー含む） -->
        <div
          class="rounded border p-2 text-left whitespace-pre-wrap"
          :class="[messageClass, isLargeText ? 'text-sm' : 'text-xs']"
          :style="{ minHeight: `${imageHeight}px`, wordBreak: 'break-word' }"
          v-html="formattedMessageText"
        />

        <!-- 3段目: 返信と秘話ボタン -->
        <div class="mt-1 flex justify-end gap-3">
          <a
            v-if="canReply && isDispAnchor"
            href="javascript:void(0);"
            class="cursor-pointer text-xs text-blue-600 hover:underline dark:text-[#14b4ff]"
            @click="handleReply"
          >
            >>返信
          </a>
          <a
            v-if="canSecret"
            href="javascript:void(0);"
            class="cursor-pointer text-xs text-blue-600 hover:underline dark:text-[#14b4ff]"
            @click="handleSecret"
          >
            >>秘話
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessageView } from '~/lib/api/types'
import CharaImage from '../CharaImage.vue'
import {
  createAnchorString,
  createAnchorCopyString,
  convertToMessageText,
  isDispAnchor as checkDispAnchor,
  getComingOutString
} from './message-converter'

interface Props {
  message: DeepReadonly<MessageView> | MessageView
  isImgLarge?: boolean
  isLargeText?: boolean
  maxCount?: number
  isProgress?: boolean
  isAnchorMessage?: boolean
  isDispDate?: boolean
  canReply?: boolean
  canSecret?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isImgLarge: false,
  isLargeText: false,
  maxCount: 20,
  isProgress: false,
  isAnchorMessage: false,
  isDispDate: false,
  canReply: true,
  canSecret: true
})

// 画像サイズの計算
const imageWidth = computed(() => {
  const baseWidth = props.message.from?.chara?.display?.width || 60
  return props.isImgLarge ? Math.floor(baseWidth * 1.5) : baseWidth
})

const imageHeight = computed(() => {
  const baseHeight = props.message.from?.chara?.display?.height || 80
  return props.isImgLarge ? Math.floor(baseHeight * 1.5) : baseHeight
})

// アンカー表示判定
const isDispAnchor = computed(() =>
  checkDispAnchor(props.isProgress, props.message.content.type.code)
)

// アンカー文字列
const anchorString = computed(() => {
  if (!props.message.content.num) return ''
  return createAnchorString(
    props.message.content.type.code,
    props.message.content.num
  )
})

// アンカーコピー文字列
const anchorCopyString = computed(() => {
  const shortName =
    props.message.from_character_name?.short_name ||
    props.message.from?.chara_name?.short_name ||
    ''
  return createAnchorCopyString(
    props.message.content.type.code,
    anchorString.value,
    shortName
  )
})

// キャラクター名
const characterName = computed(() => {
  const shortName =
    props.message.from_character_name?.short_name ||
    props.message.from?.chara_name?.short_name ||
    ''
  const name =
    props.message.from_character_name?.name ||
    props.message.from?.chara_name?.name ||
    props.message.from?.name ||
    ''

  if (shortName && name) {
    return `[${shortName}] ${name}`
  }
  return name
})

// 秘話の宛先キャラクター名
const targetCharacterName = computed(() => {
  const shortName = props.message.to_character_name?.short_name || ''
  const name = props.message.to_character_name?.name || ''

  if (!name) return null
  if (shortName) {
    return `[${shortName}] ${name}`
  }
  return name
})

// カミングアウト文字列
const comingOutString = computed(() => getComingOutString(props.message))

// プレイヤー情報
const twitterUserName = computed(
  () => props.message.from?.player?.twitter_user_name
)
const nickname = computed(() => props.message.from?.player?.nickname)

// 表示時刻
const displayTime = computed(() => {
  const datetime = props.message.time.datetime
  if (!datetime) return ''

  // datetimeが既に適切なフォーマット（YYYY/MM/DD HH:mm:ss）の場合
  if (datetime.includes('/')) {
    if (props.isDispDate) {
      return datetime
    }
    // 時刻部分のみ表示
    const timePart = datetime.split(' ')[1]
    return timePart || ''
  }

  // ISO形式の場合の処理（後方互換）
  if (props.isDispDate) {
    return datetime
  }
  return datetime.substring(11, 19)
})

// フォーマット済みメッセージテキスト
const formattedMessageText = computed(() =>
  convertToMessageText(props.message.content.text)
)

// メッセージクラス（背景色と文字色用）
const messageClass = computed(() => {
  const typeCode = props.message.content.type.code
  switch (typeCode) {
    case 'NORMAL_SAY':
      return 'bg-white dark:bg-white text-[#0a0a0a] dark:text-[#0a0a0a] border-gray-300 dark:border-gray-300'
    case 'WEREWOLF_SAY':
      return 'bg-[#f2cece] dark:bg-[#f2aeae] text-[#0a0a0a] dark:text-[#0a0a0a] border-gray-300 dark:border-[#f2aeae]'
    case 'SYMPATHIZE_SAY':
      return 'bg-[#cef2ce] dark:bg-[#aef2ae] text-[#0a0a0a] dark:text-[#0a0a0a] border-gray-300 dark:border-[#aef2ae]'
    case 'LOVERS_SAY':
      return 'bg-[#f2dede] dark:bg-[#edcece] text-[#cc2222] dark:text-[#cc2222] border-gray-300 dark:border-[#edcece]'
    case 'MONOLOGUE_SAY':
      return 'bg-[#dddddd] dark:bg-[#aaa] text-[#0a0a0a] dark:text-[#0a0a0a] border-gray-300 dark:border-[#aaa]'
    case 'GRAVE_SAY':
      return 'bg-[#ceedf2] dark:bg-[#a9edf7] text-[#0a0a0a] dark:text-[#0a0a0a] border-gray-300 dark:border-[#a9edf7]'
    case 'SPECTATE_SAY':
      return 'bg-[#f2f2ce] dark:bg-[#f2f2ae] text-[#0a0a0a] dark:text-[#0a0a0a] border-gray-300 dark:border-[#f2f2ae]'
    case 'SECRET_SAY':
      return 'bg-[#cecef2] dark:bg-[#a9a] text-[#0a0a0a] dark:text-[#0a0a0a] border-gray-300 dark:border-[#a9a]'
    default:
      return 'bg-white dark:bg-white text-[#0a0a0a] dark:text-[#0a0a0a] border-gray-300 dark:border-gray-300'
  }
})

// アンカー文字列をコピー
const handleCopyAnchor = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(anchorCopyString.value)
  }
  // TODO: コピー成功通知
}

// 返信ボタンのハンドラー
const handleReply = () => {
  // TODO: 返信機能の実装（発言入力欄にアンカー文字列を挿入）
  console.log('Reply with anchor:', anchorString.value)
}

// 秘話ボタンのハンドラー
const handleSecret = () => {
  // TODO: 秘話機能の実装（秘話モードに切り替え、宛先設定）
  console.log('Secret to:', props.message.from?.id)
}
</script>

<style scoped>
/* ネタバレ用スタイル */
:deep(.netabare) {
  background-color: #333;
  color: #333;
  cursor: pointer;
}

:deep(.netabare:hover) {
  background-color: #444;
}

/* アンカーメッセージの場合はインデント */
.anchor-message {
  margin-left: 3rem;
}

/* 発言内容のテキストスタイル */
:deep(p) {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>

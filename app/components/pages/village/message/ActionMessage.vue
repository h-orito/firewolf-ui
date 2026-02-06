<template>
  <div class="action-message">
    <!-- アンカーのみ表示（名前やプレイヤー名は表示しない） -->
    <div class="mb-1 flex items-center text-xs">
      <!-- 左側: アンカーのみ -->
      <div class="flex flex-1 items-center gap-1">
        <!-- アンカー -->
        <span v-if="isDispAnchor && anchorString">
          <a
            href="javascript:void(0);"
            class="cursor-pointer text-blue-600 hover:underline dark:text-(--ui-primary)"
            @click="handleCopyAnchor"
          >
            {{ anchorString }} </a
          >.
        </span>
      </div>

      <!-- 右側: 発言回数と時間 -->
      <div
        class="flex items-center gap-2 text-xs text-gray-500 dark:text-[#ddd]"
      >
        <span v-if="isAnchorMessage"> {{ message.time.day }}d </span>
        <span v-if="message.content.count && maxCount">
          ({{ message.content.count }}/{{ maxCount }})
        </span>
        <span>{{ displayTime }}</span>
      </div>
    </div>

    <!-- アクション内容（画像なし、背景色あり） -->
    <div
      class="message-text rounded border p-2.5 text-left whitespace-pre-wrap"
      :class="[
        messageClass,
        isLargeText ? 'text-sm leading-5.5' : 'text-xs leading-4.5'
      ]"
      :style="{ wordBreak: 'break-word' }"
      @click="handleMessageClick"
      v-html="formattedMessageText"
    />

    <!-- 返信と秘話ボタン -->
    <div class="mt-1 flex justify-end gap-3">
      <a
        v-if="canReply && isDispAnchor"
        href="javascript:void(0);"
        class="cursor-pointer text-xs text-blue-600 hover:underline dark:text-(--ui-primary)"
        @click="handleReply"
      >
        >>返信
      </a>
      <a
        v-if="canSecret"
        href="javascript:void(0);"
        class="cursor-pointer text-xs text-blue-600 hover:underline dark:text-(--ui-primary)"
        @click="handleSecret"
      >
        >>秘話
      </a>
    </div>

    <!-- アンカーメッセージ表示 -->
    <div
      v-if="anchorMessages.length > 0"
      :class="['mt-2 space-y-2', isAnchorMessage ? '' : 'ml-6']"
    >
      <MessageCard
        v-for="mes in anchorMessages"
        :key="mes.time.unix_time_milli"
        :message="mes"
        :is-anchor-message="true"
        :is-progress="isProgress"
        :is-disp-date="true"
        :is-large-text="isLargeText"
        :can-reply="false"
        :can-secret="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessageView } from '~/lib/api/types'
import {
  createAnchorString,
  createAnchorCopyString,
  convertToMessageText,
  isDispAnchor as checkDispAnchor,
  getAnchorType,
  getAnchorNum
} from './message-converter'
import { useAnchorMessage } from '~/composables/village/useAnchorMessage'
import { useSayInput } from '~/composables/village/useSayInput'
import { useUserSettings } from '~/composables/village/useUserSettings'

// 循環参照対策: defineAsyncComponentでMessageCardをインポート
const MessageCard = defineAsyncComponent(() => import('./MessageCard.vue'))

interface Props {
  message: DeepReadonly<MessageView> | MessageView
  isLargeText?: boolean
  maxCount?: number
  isProgress?: boolean
  isAnchorMessage?: boolean
  isDispDate?: boolean
  canReply?: boolean
  canSecret?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLargeText: false,
  maxCount: 20,
  isProgress: false,
  isAnchorMessage: false,
  isDispDate: false,
  canReply: true,
  canSecret: true
})

// Composables
const sayInput = useSayInput()
const { operation } = useUserSettings()
const { loadAnchorMessage } = useAnchorMessage()

// アンカーメッセージの状態管理
const anchorMessages = ref<MessageView[]>([])

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
// アクション発言のcontent.textには既に「{キャラ名}は、{対象}に向けて、{メッセージ}」の形式でテキストが含まれている
const formattedMessageText = computed(() => {
  return convertToMessageText(props.message.content.text)
})

// メッセージクラス（背景色用）
const messageClass = computed(() => {
  return 'bg-[#dfdfc9] dark:bg-[#232355] text-[#0a0a0a] dark:text-white border-gray-300 dark:border-white'
})

// 返信ボタンのハンドラー
const handleReply = () => {
  sayInput?.insertAnchor(anchorCopyString.value)
  sayInput?.setReplyTarget(props.message as MessageView)
}

// 秘話ボタンのハンドラー
const handleSecret = () => {
  if (props.message.from?.id) {
    sayInput?.switchToSecret(props.message.from.id)
    sayInput?.setReplyTarget(props.message as MessageView)
  }
}

// アンカー文字列をコピーまたは発言欄に挿入
const handleCopyAnchor = () => {
  if (operation.value.isPasteAnchor) {
    sayInput?.insertAnchor(anchorCopyString.value)
    showInfoToast('発言欄に挿入しました')
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(anchorCopyString.value)
    showInfoToast(`${anchorCopyString.value} をコピーしました`)
  }
}

// イベントデリゲーションでアンカークリックを検出
const handleMessageClick = async (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.classList.contains('anchor')) return

  event.preventDefault()
  const anchorString = target.textContent || ''
  await clickAnchorMessage(anchorString)
}

// アンカーメッセージのトグル処理
const clickAnchorMessage = async (anchorStr: string): Promise<void> => {
  const typeCode = getAnchorType(anchorStr)
  if (!typeCode) return

  const number = getAnchorNum(anchorStr)

  // 既に表示中ならトグルで非表示に
  const existingIndex = anchorMessages.value.findIndex(
    (mes) => mes.content.type.code === typeCode && mes.content.num === number
  )
  if (existingIndex >= 0) {
    anchorMessages.value.splice(existingIndex, 1)
    return
  }

  // APIからメッセージ取得して追加
  const message = await loadAnchorMessage(typeCode, number)
  if (message) {
    anchorMessages.value.unshift(message)
  }
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

/* 発言内容のフォント */
.message-text {
  font-family: sans-serif;
}

/* 発言内容のテキストスタイル */
:deep(p) {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>

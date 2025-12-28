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
            class="cursor-pointer text-blue-600 hover:underline dark:text-[#14b4ff]"
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
      class="rounded border p-2.5 text-left leading-4.5 whitespace-pre-wrap"
      :class="[messageClass, isLargeText ? 'text-sm' : 'text-xs']"
      :style="{ wordBreak: 'break-word' }"
      v-html="formattedMessageText"
    />
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessageView } from '~/lib/api/types'
import {
  createAnchorString,
  createAnchorCopyString,
  convertToMessageText,
  isDispAnchor as checkDispAnchor
} from './message-converter'

interface Props {
  message: DeepReadonly<MessageView> | MessageView
  isLargeText?: boolean
  maxCount?: number
  isProgress?: boolean
  isAnchorMessage?: boolean
  isDispDate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLargeText: false,
  maxCount: 20,
  isProgress: false,
  isAnchorMessage: false,
  isDispDate: false
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

// アンカー文字列をコピー
const handleCopyAnchor = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(anchorCopyString.value)
  }
  // TODO: コピー成功通知
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

/* 発言内容のテキストスタイル */
:deep(p) {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>

<template>
  <div class="system-message">
    <!-- システムメッセージのラベルと時刻は表示しない -->
    <!-- 発言内容をborderで囲む、左揃え -->
    <div
      class="rounded border text-left text-xs"
      :class="messageClass"
      style="padding: 10px"
      v-html="formattedMessageText"
    />
  </div>
</template>

<script setup lang="ts">
import type { MessageView } from '~/lib/api/types'
import { convertToMessageText } from './message-converter'

interface Props {
  message: MessageView
}

const props = defineProps<Props>()

// フォーマット済みメッセージテキスト
const formattedMessageText = computed(() =>
  convertToMessageText(props.message.content.text)
)

// メッセージクラス（背景色とボーダー色用）
const messageClass = computed(() => {
  const typeCode = props.message.content.type.code
  switch (typeCode) {
    case 'PUBLIC_SYSTEM':
      return 'border-gray-300 dark:border-white text-black dark:text-white'
    case 'PRIVATE_SYSTEM':
      return 'bg-[#eee] dark:bg-[#404040] border-[#ccc] dark:border-[#ccc] text-black dark:text-white'
    case 'PRIVATE_ABILITY':
      return 'bg-[#eee] dark:bg-[#404040] border-[#ccc] dark:border-[#ccc] text-black dark:text-white'
    case 'PRIVATE_SEER':
      return 'bg-[#efe] dark:bg-[#334033] border-[#0f0] dark:border-[#0f0] text-black dark:text-white'
    case 'PRIVATE_WISE':
      return 'bg-[#efe] dark:bg-[#334033] border-[#0f0] dark:border-[#0f0] text-black dark:text-white'
    case 'PRIVATE_PSYCHIC':
      return 'bg-[#eef] dark:bg-[#333340] border-[#00f] dark:border-[#00f] text-black dark:text-white'
    case 'PRIVATE_GURU':
      return 'bg-[#eef] dark:bg-[#333340] border-[#00f] dark:border-[#00f] text-black dark:text-white'
    case 'PRIVATE_CORONER':
      return 'bg-[#eef] dark:bg-[#333340] border-[#00f] dark:border-[#00f] text-black dark:text-white'
    case 'PRIVATE_WEREWOLF':
      return 'bg-[#fee] dark:bg-[#403333] border-[#f00] dark:border-[#f00] text-black dark:text-white'
    case 'PRIVATE_FANATIC':
      return 'bg-[#fee] dark:bg-[#403333] border-[#f00] dark:border-[#f00] text-black dark:text-white'
    case 'PRIVATE_MASON':
      return 'bg-[#fec] dark:bg-[#404033] border-[#fa0] dark:border-[#fa0] text-black dark:text-white'
    case 'PRIVATE_LOVERS':
      return 'bg-[#fef] dark:bg-[#404033] border-[#f0a] dark:border-[#f0a] text-black dark:text-white'
    case 'PRIVATE_FOX':
      return 'bg-[#ffc] dark:bg-[#404033] border-[#fa0] dark:border-[#ff0] text-black dark:text-white'
    case 'PRIVATE_SYMPATHIZER':
      return 'bg-[#fec] dark:bg-[#404033] border-[#fa0] dark:border-[#fa0] text-black dark:text-white'
    case 'CREATOR_SAY':
      return 'bg-[#fef] dark:bg-[#403340] border-[#c0f] dark:border-[#c0f] text-black dark:text-white'
    default:
      return 'border-gray-300 dark:border-white text-black dark:text-white'
  }
})
</script>

<style scoped>
/* 発言内容のテキストスタイル */
:deep(p) {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>

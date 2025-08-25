<template>
  <div :id="`mc-${message.time.unix_time_milli}`">
    <UCard 
      :class="{ 'dark:bg-gray-800 dark:text-gray-100': isDarkTheme }"
      class="border-0 shadow-none p-1"
    >
      <!-- 通常の発言 -->
      <div v-if="isSayType" class="say-message">
        <div class="flex items-start gap-3 p-2">
          <!-- キャラクター画像 -->
          <div class="flex-shrink-0">
            <CharaImage
              v-if="message.from?.chara"
              :chara="message.from.chara"
              :face-type="message.content.face_code || 'NORMAL'"
              :is-large="isImgLarge"
              :is-small="false"
            />
          </div>
          <!-- メッセージ内容 -->
          <div class="flex-1 min-w-0">
            <!-- 発言者情報 -->
            <div class="flex items-center gap-2 mb-1">
              <span 
                class="font-medium text-sm"
                :class="getMessageColor(message.content.type.code)"
              >
                {{ message.from_character_name?.name || message.from?.chara_name?.name || message.from?.name }}
              </span>
              <span class="text-xs text-gray-500">
                {{ formatTime(message.time.datetime) }}
              </span>
              <span 
                v-if="message.content.count"
                class="text-xs px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded"
              >
                {{ message.content.count }}
              </span>
            </div>
            <!-- メッセージテキスト -->
            <div 
              class="text-sm leading-relaxed"
              v-html="formatMessageText(message.content.text)"
            />
          </div>
        </div>
      </div>

      <!-- システムメッセージ -->
      <div v-else-if="isSystemType" class="system-message p-2">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <span class="font-medium">{{ message.content.type.name }}</span>
          <span class="ml-2 text-xs">{{ formatTime(message.time.datetime) }}</span>
        </div>
        <div class="mt-1 text-sm" v-html="formatMessageText(message.content.text)" />
      </div>

      <!-- アクションメッセージ -->
      <div v-else-if="isActionType" class="action-message p-2">
        <div class="flex items-center gap-2">
          <CharaImage
            v-if="message.from?.chara"
            :chara="message.from.chara"
            :face-type="message.content.face_code || 'NORMAL'"
            :is-large="isImgLarge"
            :is-small="true"
          />
          <div class="text-sm">
            <span class="font-medium">{{ message.from_character_name?.name || message.from?.chara_name?.name || message.from?.name }}</span>
            <span v-html="formatMessageText(message.content.text)" />
            <span class="ml-2 text-xs text-gray-500">
              {{ formatTime(message.time.datetime) }}
            </span>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Message, Chara } from '~/lib/api/types'
import { MESSAGE_TYPE_MAP } from '~/lib/api/message-constants'
import CharaImage from './CharaImage.vue'

interface Props {
  message: Message
  isProgress?: boolean
  isAnchorMessage?: boolean
  index?: number
  isDarkTheme?: boolean
  isDispDate?: boolean
  isImgLarge?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isProgress: false,
  isAnchorMessage: false,
  isDarkTheme: false,
  isDispDate: true,
  isImgLarge: false
})

// メッセージタイプ判定
const isSayType = computed(() => {
  const type = MESSAGE_TYPE_MAP.get(props.message.content.type.code)
  return type === 'say'
})

const isActionType = computed(() => {
  const type = MESSAGE_TYPE_MAP.get(props.message.content.type.code)
  return type === 'action'
})

const isSystemType = computed(() => {
  const type = MESSAGE_TYPE_MAP.get(props.message.content.type.code)
  return type === 'system'
})

// 時間フォーマット
const formatTime = (datetime: string): string => {
  const date = new Date(datetime)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// メッセージテキストのフォーマット（基本的なHTMLエスケープ＋改行変換）
const formatMessageText = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
}

// 実際の型構造を使用するため、getCharaFromParticipant関数は削除

// メッセージタイプ別の色設定
const getMessageColor = (messageTypeCode: string): string => {
  switch (messageTypeCode) {
    case 'NORMAL_SAY':
      return 'text-gray-800 dark:text-gray-200'
    case 'WEREWOLF_SAY':
      return 'text-red-600 dark:text-red-400'
    case 'SPECTATE_SAY':
      return 'text-blue-600 dark:text-blue-400'
    case 'GRAVE_SAY':
      return 'text-purple-600 dark:text-purple-400'
    case 'MONOLOGUE_SAY':
      return 'text-green-600 dark:text-green-400'
    case 'SECRET_SAY':
      return 'text-orange-600 dark:text-orange-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}
</script>
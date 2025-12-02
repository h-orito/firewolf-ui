<template>
  <div
    v-if="messages && messages.all_page_count && messages.all_page_count > 1"
    class="mx-1.5 my-2.5 flex items-center gap-2"
  >
    <!-- ページネーション -->
    <nav class="flex flex-1 items-center justify-end gap-1" aria-label="ページ">
      <!-- 前へボタン -->
      <button
        type="button"
        :disabled="!messages.exist_pre_page"
        :class="prevButtonClass"
        aria-label="前のページ"
        @click="handlePrev"
      >
        <Icon name="chevron-left" class="h-3.5 w-3.5" />
      </button>

      <!-- ページ番号ボタン -->
      <template v-for="page in visiblePages" :key="page">
        <span
          v-if="page === 'ellipsis-start'"
          class="px-1"
          :class="isDarkTheme ? 'text-gray-500' : 'text-gray-400'"
        >
          ...
        </span>
        <span
          v-else-if="page === 'ellipsis-end'"
          class="px-1"
          :class="isDarkTheme ? 'text-gray-500' : 'text-gray-400'"
        >
          ...
        </span>
        <button
          v-else
          type="button"
          :class="getPageButtonClass(page as number)"
          :aria-current="
            page === messages.current_page_num ? 'page' : undefined
          "
          @click="handleChangePage(page as number)"
        >
          {{ page }}
        </button>
      </template>

      <!-- 次へボタン -->
      <button
        type="button"
        :disabled="!messages.exist_next_page"
        :class="nextButtonClass"
        aria-label="次のページ"
        @click="handleNext"
      >
        <Icon name="chevron-right" class="h-3.5 w-3.5" />
      </button>
    </nav>

    <!-- 最新ボタン -->
    <button
      type="button"
      :class="latestButtonClass"
      @click="$emit('disp-latest')"
    >
      最新
    </button>
  </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessagesView } from '~/lib/api/types'
import Icon from '~/components/ui/icon/Icon.vue'
import { useUserSettings } from '~/composables/village/useUserSettings'

interface Props {
  messages: DeepReadonly<MessagesView> | MessagesView | null
  isLatestActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLatestActive: false
})

// ユーザー設定
const { getTheme } = useUserSettings()
const isDarkTheme = computed(() => getTheme().isDark)

const emit = defineEmits<{
  'change-page': [pageNum: number]
  'disp-latest': []
}>()

// ページ表示用の型
type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

// ボタンの基本クラス
const baseButtonClass =
  'flex h-6 min-w-6 items-center justify-center rounded border px-2 text-xs transition-colors'

// 前へボタンのクラス
const prevButtonClass = computed(() => {
  const isDisabled = !props.messages?.exist_pre_page
  if (isDisabled) {
    return isDarkTheme.value
      ? `${baseButtonClass} cursor-not-allowed border-gray-700 bg-gray-800 text-gray-600`
      : `${baseButtonClass} cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400`
  }
  return isDarkTheme.value
    ? `${baseButtonClass} border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700`
    : `${baseButtonClass} border-gray-300 bg-white text-gray-700 hover:bg-gray-100`
})

// 次へボタンのクラス
const nextButtonClass = computed(() => {
  const isDisabled = !props.messages?.exist_next_page
  if (isDisabled) {
    return isDarkTheme.value
      ? `${baseButtonClass} cursor-not-allowed border-gray-700 bg-gray-800 text-gray-600`
      : `${baseButtonClass} cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400`
  }
  return isDarkTheme.value
    ? `${baseButtonClass} border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700`
    : `${baseButtonClass} border-gray-300 bg-white text-gray-700 hover:bg-gray-100`
})

// ページ番号ボタンのクラス
const getPageButtonClass = (page: number) => {
  const isActive = page === props.messages?.current_page_num
  if (isActive) {
    return `${baseButtonClass} border-blue-500 bg-blue-500 text-white`
  }
  return isDarkTheme.value
    ? `${baseButtonClass} border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700`
    : `${baseButtonClass} border-gray-300 bg-white text-gray-700 hover:bg-gray-100`
}

// 最新ボタンのクラス
const latestButtonClass = computed(() => {
  const baseClass = 'rounded border px-3 py-1 text-xs transition-colors'
  if (props.isLatestActive) {
    return `${baseClass} border-blue-500 bg-blue-500 text-white`
  }
  return isDarkTheme.value
    ? `${baseClass} border-gray-600 bg-transparent text-blue-400 hover:bg-gray-700`
    : `${baseClass} border-gray-300 bg-white text-blue-600 hover:bg-gray-100`
})

// 表示するページ番号を計算
const visiblePages = computed((): PageItem[] => {
  if (!props.messages || !props.messages.all_page_count) return []

  const totalPages = props.messages.all_page_count
  const currentPage = props.messages.current_page_num ?? 1
  const range = 2 // 前後に表示するページ数

  const pages: PageItem[] = []

  // 最初のページ
  pages.push(1)

  // 省略記号（開始）
  if (currentPage - range > 2) {
    pages.push('ellipsis-start')
  }

  // 現在のページの前後
  for (
    let i = Math.max(2, currentPage - range);
    i <= Math.min(totalPages - 1, currentPage + range);
    i++
  ) {
    pages.push(i)
  }

  // 省略記号（終了）
  if (currentPage + range < totalPages - 1) {
    pages.push('ellipsis-end')
  }

  // 最後のページ（1ページのみの場合は追加しない）
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  // 重複を除去
  return [...new Set(pages)]
})

const handleChangePage = (pageNum: number) => {
  emit('change-page', pageNum)
}

const handlePrev = () => {
  if (props.messages?.current_page_num && props.messages.current_page_num > 1) {
    emit('change-page', props.messages.current_page_num - 1)
  }
}

const handleNext = () => {
  if (
    props.messages?.current_page_num &&
    props.messages?.all_page_count &&
    props.messages.current_page_num < props.messages.all_page_count
  ) {
    emit('change-page', props.messages.current_page_num + 1)
  }
}
</script>

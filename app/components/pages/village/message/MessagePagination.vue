<template>
  <div
    v-if="messages && messages.all_page_count && messages.all_page_count > 1"
    class="mx-1.5 my-2.5 flex items-center gap-2"
  >
    <!-- ページネーション -->
    <nav class="flex flex-1 items-center justify-end gap-1" aria-label="ページ">
      <!-- 先頭へボタン -->
      <button
        type="button"
        :disabled="
          !messages.current_page_num || messages.current_page_num === 1
        "
        :class="firstButtonClass"
        aria-label="最初のページ"
        @click="handleFirst"
      >
        &lt;&lt;
      </button>

      <!-- 前へボタン -->
      <button
        type="button"
        :disabled="!canGoPrev"
        :class="prevButtonClass"
        aria-label="前のページ"
        @click="handlePrev"
      >
        <Icon name="i-heroicons-chevron-left-20-solid" class="h-3.5 w-3.5" />
      </button>

      <!-- ページ番号ボタン -->
      <template v-for="page in visiblePages" :key="page">
        <button
          type="button"
          :class="getPageButtonClass(page)"
          :aria-current="
            page === messages.current_page_num ? 'page' : undefined
          "
          @click="handleChangePage(page)"
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
        <Icon name="i-heroicons-chevron-right-20-solid" class="h-3.5 w-3.5" />
      </button>

      <!-- 末尾へボタン -->
      <button
        type="button"
        :disabled="
          !messages.current_page_num ||
          !messages.all_page_count ||
          messages.current_page_num === messages.all_page_count
        "
        :class="lastButtonClass"
        aria-label="最後のページ"
        @click="handleLast"
      >
        &gt;&gt;
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
type PageItem = number

// ボタンの基本クラス
const baseButtonClass =
  'flex h-6 min-w-6 items-center justify-center rounded border px-2 text-xs transition-colors'

// 前へボタンが有効かどうか（最新状態のときも有効）
const canGoPrev = computed(() => {
  return props.isLatestActive || props.messages?.exist_pre_page
})

// 前へボタンのクラス
const prevButtonClass = computed(() => {
  if (!canGoPrev.value) {
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

// 先頭ボタンのクラス
const firstButtonClass = computed(() => {
  const isDisabled =
    !props.messages?.current_page_num || props.messages.current_page_num === 1
  if (isDisabled) {
    return isDarkTheme.value
      ? `${baseButtonClass} cursor-not-allowed border-gray-700 bg-gray-800 text-gray-600`
      : `${baseButtonClass} cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400`
  }
  return isDarkTheme.value
    ? `${baseButtonClass} border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700`
    : `${baseButtonClass} border-gray-300 bg-white text-gray-700 hover:bg-gray-100`
})

// 末尾ボタンのクラス
const lastButtonClass = computed(() => {
  const isDisabled =
    !props.messages?.current_page_num ||
    !props.messages?.all_page_count ||
    props.messages.current_page_num === props.messages.all_page_count
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
  const maxVisible = 5

  // 総ページ数が5以下の場合は全て表示
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // 総ページ数が6以上の場合
  const pages: number[] = []

  // 現在ページが1-3の場合: 1, 2, 3, 4, 5
  if (currentPage <= 3) {
    for (let i = 1; i <= maxVisible; i++) {
      pages.push(i)
    }
  }
  // 現在ページが最後から3つ以内の場合
  else if (currentPage >= totalPages - 2) {
    for (let i = totalPages - 4; i <= totalPages; i++) {
      pages.push(i)
    }
  }
  // それ以外: current-2, current-1, current, current+1, current+2
  else {
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      pages.push(i)
    }
  }

  return pages
})

const handleChangePage = (pageNum: number) => {
  emit('change-page', pageNum)
}

const handlePrev = () => {
  // 最新状態のときは最終ページを開く
  if (props.isLatestActive && props.messages?.all_page_count) {
    emit('change-page', props.messages.all_page_count)
    return
  }
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

const handleFirst = () => {
  emit('change-page', 1)
}

const handleLast = () => {
  if (props.messages?.all_page_count) {
    emit('change-page', props.messages.all_page_count)
  }
}
</script>

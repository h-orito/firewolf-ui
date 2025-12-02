<template>
  <div>
    <!-- ローディング -->
    <div v-if="loading" class="flex justify-center py-4">
      <Icon name="spinner" class="h-6 w-6 animate-spin text-gray-500" />
    </div>

    <!-- エラー表示 -->
    <div
      v-else-if="error"
      class="mx-2 my-4 rounded border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600"
      :class="{ 'border-red-700 bg-red-900/20 text-red-400': isDarkTheme }"
    >
      発言の取得に失敗しました
    </div>

    <template v-else>
      <!-- 上部ページネーション -->
      <MessagePagination
        v-if="showPagination"
        :messages="messages"
        :is-latest-active="isLatestActive"
        @change-page="handleChangePage"
        @disp-latest="handleDispLatest"
      />

      <!-- 発言リスト -->
      <div v-if="messages && messages.list.length > 0">
        <MessageCard
          v-for="message in messages.list"
          :key="message.time.unix_time_milli"
          :message="message"
          :is-img-large="messageDisplay.isImgLarge"
          class="my-3"
        />
      </div>

      <!-- 発言がない場合 -->
      <div
        v-else
        class="mx-2 my-4 rounded border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500"
        :class="{ 'border-gray-700 bg-gray-800 text-gray-400': isDarkTheme }"
      >
        発言がありません
      </div>

      <!-- 下部ページネーション -->
      <MessagePagination
        v-if="showPagination"
        :messages="messages"
        :is-latest-active="isLatestActive"
        @change-page="handleChangePage"
        @disp-latest="handleDispLatest"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from '~/composables/village/useMessage'
import { useVillage } from '~/composables/village/useVillage'
import { useUserSettings } from '~/composables/village/useUserSettings'
import Icon from '~/components/ui/icon/Icon.vue'
import MessageCard from './MessageCard.vue'
import MessagePagination from './MessagePagination.vue'

// Composables
const { messages, loading, error, isDispLatest, setPageNum, setDispLatest } =
  useMessage()
const { isCurrentVillageDayLatest } = useVillage()
const { getTheme, getMessageDisplay } = useUserSettings()

// ユーザー設定
const isDarkTheme = computed(() => getTheme().isDark)
const messageDisplay = computed(() => getMessageDisplay())

// ページネーション表示判定
const showPagination = computed(() => {
  return (
    messages.value &&
    messages.value.all_page_count != null &&
    messages.value.all_page_count > 1
  )
})

// 最新ボタンがアクティブか
const isLatestActive = computed(() => {
  return isCurrentVillageDayLatest.value && isDispLatest.value
})

// ページ変更ハンドラ
const handleChangePage = (pageNum: number) => {
  setPageNum(pageNum)
}

// 最新表示ハンドラ
const handleDispLatest = () => {
  setDispLatest(true)
}
</script>

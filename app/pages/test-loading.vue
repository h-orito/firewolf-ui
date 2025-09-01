<template>
  <div class="p-8">
    <h1 class="mb-6 text-2xl font-bold">Loading Component Test</h1>

    <div class="space-y-6">
      <!-- 通常のLoading -->
      <div class="rounded-lg border p-4">
        <h2 class="mb-4 text-lg font-semibold">Normal Loading</h2>
        <div class="relative h-40 rounded border-2 border-gray-200">
          <LoadingSpinner v-if="showNormalLoading" />
          <div v-else class="p-4">
            <p>コンテンツが表示されます</p>
          </div>
        </div>
        <UButton class="mt-4" @click="showNormalLoading = !showNormalLoading">
          {{ showNormalLoading ? '完了' : '読み込み開始' }}
        </UButton>
      </div>

      <!-- Fixed Loading -->
      <div class="rounded-lg border p-4">
        <h2 class="mb-4 text-lg font-semibold">Fixed Loading</h2>
        <UButton @click="showFixedLoading = !showFixedLoading">
          {{ showFixedLoading ? '完了' : '全画面読み込み開始' }}
        </UButton>
        <LoadingSpinner
          v-if="showFixedLoading"
          :fixed="true"
          message="村情報を読み込み中..."
        />
      </div>

      <!-- Custom Message Loading -->
      <div class="rounded-lg border p-4">
        <h2 class="mb-4 text-lg font-semibold">Custom Message Loading</h2>
        <div class="relative h-40 rounded border-2 border-gray-200">
          <LoadingSpinner
            v-if="showCustomLoading"
            message="発言を読み込み中..."
          />
          <div v-else class="p-4">
            <p>発言リストが表示されます</p>
          </div>
        </div>
        <UButton class="mt-4" @click="showCustomLoading = !showCustomLoading">
          {{ showCustomLoading ? '完了' : 'カスタムメッセージ読み込み開始' }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from '~/components/ui/feedback/LoadingSpinner.vue'

const showNormalLoading = ref(false)
const showFixedLoading = ref(false)
const showCustomLoading = ref(false)
</script>

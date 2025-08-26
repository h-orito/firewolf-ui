<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-8 text-center text-3xl font-bold">Village Layout テスト</h1>

    <div class="mx-auto max-w-2xl">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">VillageLayout テスト</h2>
        </template>

        <div class="space-y-4">
          <p>
            このページはVillageLayoutを使用しています（ナビゲーションバーなし）。
          </p>

          <UAlert
            icon="i-lucide-info"
            color="info"
            variant="subtle"
            title="Village Layout特徴"
            description="人狼ゲーム中はナビゲーションを隠し、ゲームに集中できるレイアウトです。Google Adsのみが表示されます。"
          />

          <div class="mt-6">
            <NuxtLink
              to="/layout-test"
              class="bg-primary-500 hover:bg-primary-600 inline-flex items-center rounded-lg px-4 py-2 text-white transition-colors"
            >
              ← Default Layout テストに戻る
            </NuxtLink>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use village layout
definePageMeta({
  layout: 'village'
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-8 text-center text-3xl font-bold">Village Layout テスト</h1>

    <div class="mx-auto max-w-2xl">
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow">
        <h2 class="mb-4 text-xl font-semibold">VillageLayout テスト</h2>

        <div class="space-y-4">
          <p>
            このページはVillageLayoutを使用しています（ナビゲーションバーなし）。
          </p>

          <div
            class="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800"
          >
            <p class="font-medium">Village Layout特徴</p>
            <p class="mt-1">
              人狼ゲーム中はナビゲーションを隠し、ゲームに集中できるレイアウトです。Google
              Adsのみが表示されます。
            </p>
          </div>

          <div class="mt-6">
            <NuxtLink
              to="/layout-test"
              class="bg-primary-500 hover:bg-primary-600 inline-flex items-center rounded-lg px-4 py-2 text-white transition-colors"
            >
              ← Default Layout テストに戻る
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use village layout
definePageMeta({
  layout: 'village'
})
</script>

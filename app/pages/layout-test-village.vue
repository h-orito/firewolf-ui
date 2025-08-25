<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">Village Layout テスト</h1>
    
    <div class="max-w-2xl mx-auto">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">VillageLayout テスト</h2>
        </template>
        
        <div class="space-y-4">
          <p>このページはVillageLayoutを使用しています（ナビゲーションバーなし）。</p>
          
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
              class="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
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
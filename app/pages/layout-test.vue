<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">レイアウトテスト</h1>

    <div class="max-w-2xl mx-auto">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">DefaultLayout テスト</h2>
        </template>

        <div class="space-y-4">
          <p>このページはDefaultLayoutを使用しています。</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UCard>
              <h3 class="font-medium mb-2">ナビゲーション確認</h3>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li>左上のハンバーガーメニューをクリック</li>
                <li>サイドメニューが表示される</li>
                <li>メニュー項目のリンクが動作する</li>
                <li>背景をクリックでメニューが閉じる</li>
              </ul>
            </UCard>

            <UCard>
              <h3 class="font-medium mb-2">レスポンシブ確認</h3>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li>モバイルサイズでの表示</li>
                <li>タブレットサイズでの表示</li>
                <li>デスクトップサイズでの表示</li>
              </ul>
            </UCard>
          </div>

          <div class="mt-6">
            <NuxtLink
              to="/layout-test-village"
              class="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Village Layout テスト →
            </NuxtLink>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use default layout (explicitly specified for clarity)
definePageMeta({
  layout: 'default'
})
</script>

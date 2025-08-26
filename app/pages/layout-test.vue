<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="mb-8 text-center text-3xl font-bold">レイアウトテスト</h1>

    <div class="mx-auto max-w-2xl">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">DefaultLayout テスト</h2>
        </template>

        <div class="space-y-4">
          <p>このページはDefaultLayoutを使用しています。</p>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UCard>
              <h3 class="mb-2 font-medium">ナビゲーション確認</h3>
              <ul class="list-inside list-disc space-y-1 text-sm">
                <li>左上のハンバーガーメニューをクリック</li>
                <li>サイドメニューが表示される</li>
                <li>メニュー項目のリンクが動作する</li>
                <li>背景をクリックでメニューが閉じる</li>
              </ul>
            </UCard>

            <UCard>
              <h3 class="mb-2 font-medium">レスポンシブ確認</h3>
              <ul class="list-inside list-disc space-y-1 text-sm">
                <li>モバイルサイズでの表示</li>
                <li>タブレットサイズでの表示</li>
                <li>デスクトップサイズでの表示</li>
              </ul>
            </UCard>
          </div>

          <div class="mt-6">
            <NuxtLink
              to="/layout-test-village"
              class="bg-primary-500 hover:bg-primary-600 inline-flex items-center rounded-lg px-4 py-2 text-white transition-colors"
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

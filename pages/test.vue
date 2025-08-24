<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">@nuxt/ui コンポーネントテスト</h1>

    <!-- Primary color test -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">カスタムプライマリカラー</h2>
      <div class="bg-primary text-white p-4 rounded mb-2">
        プライマリカラー (#3991f4)
      </div>
      <div class="bg-primary-dark text-white p-4 rounded">
        プライマリダークカラー (rgb(20, 180, 255))
      </div>
    </div>

    <!-- @nuxt/ui components -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">@nuxt/ui コンポーネント</h2>

      <!-- Alerts -->
      <div class="space-y-4 mb-6">
        <UAlert
          icon="i-heroicons-information-circle"
          title="Information"
          description="This is an information alert"
          color="primary"
        />
        <UAlert
          icon="i-heroicons-check-circle"
          title="Success"
          description="This is a success alert"
          color="green"
        />
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          title="Warning"
          description="This is a warning alert"
          color="yellow"
        />
      </div>

      <!-- Buttons -->
      <div class="space-x-2 mb-6">
        <UButton color="primary" variant="solid">Primary</UButton>
        <UButton color="gray" variant="outline">Secondary</UButton>
        <UButton color="red" variant="soft">Danger</UButton>
        <UButton color="green" variant="ghost">Success</UButton>
      </div>

      <!-- Card -->
      <UCard class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold">Card Header</h3>
        </template>

        <p>This is a card content area with some example text.</p>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton variant="outline" size="sm">Cancel</UButton>
            <UButton color="primary" size="sm">Save</UButton>
          </div>
        </template>
      </UCard>

      <!-- Input -->
      <div class="mb-6">
        <UInput placeholder="Type something..." />
      </div>

      <!-- Badge -->
      <div class="mb-6">
        <UBadge color="primary" variant="solid">Badge</UBadge>
        <UBadge color="green" variant="soft" class="ml-2">Success</UBadge>
        <UBadge color="red" variant="outline" class="ml-2">Error</UBadge>
      </div>
    </div>

    <!-- 人狼ゲーム固有の色テスト -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">人狼ゲーム固有カラー</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Say colors -->
        <div>
          <h3 class="font-bold mb-2">発言色</h3>
          <div class="space-y-2">
            <div class="bg-say-normal border p-3 rounded">通常発言</div>
            <div class="bg-say-werewolf p-3 rounded">人狼発言</div>
            <div class="bg-say-sympathize p-3 rounded">共鳴発言</div>
            <div class="bg-say-grave p-3 rounded">墓場発言</div>
            <div class="bg-say-spectate p-3 rounded">見学発言</div>
            <div class="bg-say-action p-3 rounded">アクション発言</div>
            <div class="bg-say-monologue p-3 rounded">独り言</div>
          </div>
        </div>

        <!-- System colors -->
        <div>
          <h3 class="font-bold mb-2">システムメッセージ色</h3>
          <div class="space-y-2">
            <div
              class="bg-system-private-bg border-system-private-border border-l-4 p-3 rounded"
            >
              プライベートシステム
            </div>
            <div
              class="bg-system-seer-bg border-system-seer-border border-l-4 p-3 rounded"
            >
              占い師システム
            </div>
            <div
              class="bg-system-werewolf-bg border-system-werewolf-border border-l-4 p-3 rounded"
            >
              人狼システム
            </div>
            <div
              class="bg-system-mason-bg border-system-mason-border border-l-4 p-3 rounded"
            >
              共鳴者システム
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: '@nuxt/ui Component Test - FIREWOLF'
})
</script>

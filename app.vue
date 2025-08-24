<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">@nuxt/ui Nuxt 4 動作確認</h1>

    <!-- Buttonテスト -->
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-2">UButton コンポーネント</h2>
      <UButton>Primary Button</UButton>
      <UButton color="error" class="ml-2">Error Button</UButton>
      <UButton variant="ghost" class="ml-2">Ghost Button</UButton>
    </div>

    <!-- Inputテスト -->
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-2">UInput コンポーネント</h2>
      <UInput v-model="inputValue" placeholder="テキストを入力してください" />
      <p class="mt-2">入力値: {{ inputValue }}</p>
    </div>

    <!-- Selectテスト -->
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-2">USelect コンポーネント</h2>
      <USelect v-model="selectedOption" :options="options" />
      <p class="mt-2">選択値: {{ selectedOption }}</p>
    </div>

    <!-- Modalテスト -->
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-2">UModal コンポーネント</h2>
      <UButton @click="isModalOpen = true">モーダルを開く</UButton>
      <UModal v-model="isModalOpen">
        <div class="p-4">
          <h3 class="text-lg font-bold mb-2">モーダルテスト</h3>
          <p class="mb-4">これは@nuxt/uiのUModalコンポーネントです。</p>
          <UButton @click="isModalOpen = false">閉じる</UButton>
        </div>
      </UModal>
    </div>

    <!-- Tableテスト -->
    <!--
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-2">UTable コンポーネント</h2>
      <UTable :columns="columns" :rows="rows" />
    </div>
    -->

    <!-- 人狼ゲーム固有色のテスト -->
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-2">カスタムカラーテスト</h2>
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-werewolf-say p-2 rounded">人狼発言色</div>
        <div class="bg-normal-say p-2 rounded border">通常発言色</div>
        <div class="bg-spectate-say p-2 rounded">見学発言色</div>
        <div class="bg-grave-say p-2 rounded">墓場発言色</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const inputValue = ref('')
const selectedOption = ref('')
const isModalOpen = ref(false)

const options = [
  { label: 'オプション1', value: 'option1' },
  { label: 'オプション2', value: 'option2' },
  { label: 'オプション3', value: 'option3' }
]

// const columns = [
//   { key: 'name', label: '名前' },
//   { key: 'role', label: '役職' },
//   { key: 'status', label: '状態' }
// ]

// const rows = [
//   { name: 'プレイヤー1', role: '村人', status: '生存' },
//   { name: 'プレイヤー2', role: '人狼', status: '生存' },
//   { name: 'プレイヤー3', role: '占い師', status: '死亡' }
// ]
</script>

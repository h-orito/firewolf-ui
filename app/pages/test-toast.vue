<template>
  <div class="p-8 space-y-4">
    <h1 class="text-2xl font-bold">Toast/Notification テスト</h1>

    <div class="space-y-2">
      <h2 class="text-lg font-semibold">新しいToast API</h2>
      <div class="space-x-2">
        <UButton color="primary" @click="testInfo">情報Toast</UButton>
        <UButton color="success" @click="testSuccess">成功Toast</UButton>
        <UButton color="error" @click="testError">エラーToast</UButton>
      </div>
    </div>

    <div class="space-y-2">
      <h2 class="text-lg font-semibold">旧村Toast互換API</h2>
      <div class="space-x-2">
        <UButton color="primary" variant="outline" @click="testLegacyInfo"
          >レガシー情報</UButton
        >
        <UButton color="success" variant="outline" @click="testLegacySuccess"
          >レガシー成功</UButton
        >
        <UButton color="error" variant="outline" @click="testLegacyDanger"
          >レガシー危険</UButton
        >
      </div>
    </div>

    <div class="space-y-2">
      <h2 class="text-lg font-semibent">カスタムToast</h2>
      <div class="space-x-2">
        <UButton color="neutral" @click="testCustom">カスタムToast</UButton>
        <UButton color="neutral" variant="outline" @click="testWithActions"
          >アクション付きToast</UButton
        >
      </div>
    </div>

    <div class="space-y-2">
      <h2 class="text-lg font-semibold">Toast管理</h2>
      <div class="space-x-2">
        <UButton color="neutral" variant="soft" @click="clearAllToasts"
          >全て消去</UButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  showInfoToast,
  showSuccessToast,
  showErrorToast,
  villageToast
} from '~/utils/toast'

const toast = useToast()

const testInfo = () => {
  showInfoToast('これは情報メッセージです。')
}

const testSuccess = () => {
  showSuccessToast('操作が正常に完了しました！')
}

const testError = () => {
  showErrorToast('エラーが発生しました。もう一度お試しください。')
}

const testLegacyInfo = () => {
  villageToast.info('レガシー情報メッセージ')
}

const testLegacySuccess = () => {
  villageToast.success('レガシー成功メッセージ')
}

const testLegacyDanger = () => {
  villageToast.danger('レガシー危険メッセージ')
}

const testCustom = () => {
  toast.add({
    title: 'カスタムToast',
    description: '人狼ゲーム特有のメッセージです。',
    color: 'neutral',
    icon: 'i-lucide-zap',
    duration: 6000
  })
}

const testWithActions = () => {
  toast.add({
    title: '確認が必要です',
    description: 'この操作を続行しますか？',
    color: 'warning',
    icon: 'i-lucide-alert-triangle',
    actions: [
      {
        label: '続行',
        onClick: () => console.log('続行が選択されました')
      },
      {
        label: 'キャンセル',
        onClick: () => console.log('キャンセルが選択されました')
      }
    ]
  })
}

const clearAllToasts = () => {
  toast.clear()
}
</script>

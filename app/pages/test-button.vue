<template>
  <div class="space-y-8 p-8">
    <h1 class="text-2xl font-bold">Button コンポーネント群テスト</h1>

    <!-- 基本的なボタンパターン -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">基本パターン</h2>
      <div class="flex flex-wrap gap-2">
        <UButton v-bind="buttonPatterns.primary">プライマリ</UButton>
        <UButton v-bind="buttonPatterns.secondary">セカンダリ</UButton>
        <UButton v-bind="buttonPatterns.danger">危険</UButton>
        <UButton v-bind="buttonPatterns.info">情報</UButton>
        <UButton v-bind="buttonPatterns.success">成功</UButton>
      </div>
    </div>

    <!-- サイズバリエーション -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">サイズパターン</h2>
      <div class="flex flex-wrap items-center gap-2">
        <UButton v-bind="{ ...buttonPatterns.primary, ...sizePatterns.xs }"
          >XS</UButton
        >
        <UButton v-bind="{ ...buttonPatterns.primary, ...sizePatterns.sm }"
          >SM</UButton
        >
        <UButton v-bind="{ ...buttonPatterns.primary, ...sizePatterns.md }"
          >MD</UButton
        >
        <UButton v-bind="{ ...buttonPatterns.primary, ...sizePatterns.lg }"
          >LG</UButton
        >
        <UButton v-bind="{ ...buttonPatterns.primary, ...sizePatterns.xl }"
          >XL</UButton
        >
      </div>
    </div>

    <!-- アイコン付きボタン -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">アイコン付きボタン</h2>
      <div class="flex flex-wrap gap-2">
        <UButton v-bind="iconButtonPatterns.copy" />
        <UButton v-bind="iconButtonPatterns.edit" />
        <UButton v-bind="iconButtonPatterns.delete" />
        <UButton v-bind="iconButtonPatterns.save" />
        <UButton v-bind="iconButtonPatterns.settings" />
        <UButton v-bind="iconButtonPatterns.close" />
      </div>
    </div>

    <!-- ステート別ボタン -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">ステート別</h2>
      <div class="flex flex-wrap gap-2">
        <UButton v-bind="buttonPatterns.primary">通常</UButton>
        <UButton v-bind="buttonPatterns.primary" disabled>無効化</UButton>
        <UButton v-bind="buttonPatterns.primary" loading>読み込み中</UButton>
      </div>
    </div>

    <!-- 旧Buefyパターンとの比較 -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">旧Buefy対応表</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="rounded border p-4">
          <h3 class="mb-2 font-medium">旧 type="is-primary"</h3>
          <UButton color="primary" variant="solid" size="sm"
            >新プライマリ</UButton
          >
        </div>
        <div class="rounded border p-4">
          <h3 class="mb-2 font-medium">旧 type="is-secondary"</h3>
          <UButton color="neutral" variant="outline" size="sm"
            >新セカンダリ</UButton
          >
        </div>
        <div class="rounded border p-4">
          <h3 class="mb-2 font-medium">旧 type="is-danger"</h3>
          <UButton color="error" variant="solid" size="sm">新危険</UButton>
        </div>
        <div class="rounded border p-4">
          <h3 class="mb-2 font-medium">旧 size="is-small"</h3>
          <UButton size="sm">新小サイズ</UButton>
        </div>
      </div>
    </div>

    <!-- 実際のUIパターン -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">実用的なUIパターン</h2>

      <!-- モーダルフッター風 -->
      <div class="rounded border p-4">
        <h3 class="mb-2 font-medium">モーダルフッター</h3>
        <div class="flex justify-end gap-2">
          <UButton v-bind="modalButtons.cancel" />
          <UButton v-bind="modalButtons.confirm" />
        </div>
      </div>

      <!-- フォーム送信風 -->
      <div class="rounded border p-4">
        <h3 class="mb-2 font-medium">フォーム送信</h3>
        <div class="flex gap-2">
          <UButton v-bind="formButtons.cancel" />
          <UButton v-bind="formButtons.save" />
        </div>
      </div>

      <!-- 削除確認風 -->
      <div class="rounded border p-4">
        <h3 class="mb-2 font-medium">削除確認</h3>
        <div class="flex gap-2">
          <UButton v-bind="deleteButtons.cancel" />
          <UButton v-bind="deleteButtons.delete" />
        </div>
      </div>
    </div>

    <!-- インタラクションテスト -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">インタラクション確認</h2>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-bind="buttonPatterns.primary"
          @click="showAlert('プライマリクリック')"
        >
          プライマリ
        </UButton>
        <UButton
          v-bind="buttonPatterns.secondary"
          @click="showAlert('セカンダリクリック')"
        >
          セカンダリ
        </UButton>
        <UButton
          v-bind="buttonPatterns.danger"
          @click="showAlert('危険クリック')"
        >
          危険
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  buttonPatterns,
  sizePatterns,
  iconButtonPatterns,
  commonButtonSets
} from '~/utils/button-patterns'
import { showInfoToast } from '~/utils/toast'

// 共通ボタンセットのサンプル
const modalButtons = commonButtonSets.modalFooter(
  () => showInfoToast('キャンセルされました'),
  () => showInfoToast('確認されました')
)

const formButtons = commonButtonSets.saveForm(
  () => showInfoToast('フォームがキャンセルされました'),
  () => showInfoToast('フォームが保存されました')
)

const deleteButtons = commonButtonSets.deleteConfirm(
  () => showInfoToast('削除がキャンセルされました'),
  () => showInfoToast('削除が実行されました')
)

const showAlert = (message: string) => {
  showInfoToast(message)
}
</script>

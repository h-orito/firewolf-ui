<template>
  <Modal v-model="isOpen" title="名前変更確認">
    <!-- 確認メッセージ -->
    <p class="text-sm text-gray-700 dark:text-gray-300">
      以下の名前に変更しますか？
    </p>
    <p class="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">
      [{{ newShortName }}] {{ newName }}
    </p>

    <template #footer>
      <UiButton color="secondary" variant="outline" @click="close">
        キャンセル
      </UiButton>
      <UiButton
        :disabled="submitting"
        :loading="submitting"
        @click="handleConfirm"
      >
        名前変更する
      </UiButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/modal/Modal.vue'
import UiButton from '~/components/ui/button/index.vue'

interface Props {
  modelValue: boolean
  submitting: boolean
  newName: string
  newShortName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

// モーダル開閉状態
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// モーダルを閉じる
const close = () => {
  isOpen.value = false
}

// 確認処理
const handleConfirm = () => {
  emit('confirm')
}
</script>

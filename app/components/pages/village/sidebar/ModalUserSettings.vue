<template>
  <Modal v-model="isModalOpen" title="ユーザ設定">
    <div class="p-4">
      <p class="text-gray-500">ユーザ設定を表示（後続タスクで実装予定）</p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/modal/Modal.vue'

// Props
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  // TODO: 後続タスクでユーザ設定変更時のリフレッシュ機能実装時に使用予定
  refresh: []
}>()

// State
const isModalOpen = computed({
  get: () => props.isOpen,
  set: (value) => {
    if (!value) {
      emit('close')
    }
  }
})
</script>

<template>
  <Modal v-model="isModalOpen" title="村の設定">
    <div class="p-4">
      <p class="text-gray-500">村の設定情報を表示（後続タスクで実装予定）</p>
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

// 後続タスクで村の設定情報表示時に使用予定
// const { charachips } = useVillage()

// Emits
const emit = defineEmits<{
  close: []
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

<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">投げ銭</h3>
        </div>
      </template>

      <div class="space-y-4">
        <p>投げ銭機能は実装予定です。</p>
        <p class="text-sm text-gray-600">
          現在Nuxt4移行作業中のため、この機能は後日実装されます。
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton @click="isOpen = false">
            閉じる
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  open: boolean
}

interface Emits {
  'update:open': [value: boolean]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})
</script>
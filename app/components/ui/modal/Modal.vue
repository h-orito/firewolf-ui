<template>
  <UModal
    v-model:open="isModalOpen"
    :ui="{
      wrapper: 'max-h-[calc(100vh-6.5rem)]',
      content: 'sm:max-w-lg md:max-w-[80vw] overflow-y-auto',
      overlay: 'bg-black/75'
    }"
  >
    <template #content>
      <div class="modal-card">
        <!-- Header -->
        <div v-if="title || $slots.title" class="modal-card-head">
          <div class="flex items-center justify-between">
            <h3 class="modal-card-title text-left text-lg font-semibold">
              <slot name="title">{{ title }}</slot>
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="closeModal"
            />
          </div>
        </div>

        <!-- Body -->
        <div class="modal-card-body px-4 py-4 text-left sm:px-6">
          <slot />
        </div>

        <!-- Footer -->
        <div
          v-if="$slots.footer"
          class="modal-card-foot flex justify-end gap-2 border-t border-gray-200 px-4 py-4 sm:px-6"
        >
          <slot name="footer" />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  trapFocus?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close' | 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  trapFocus: true
})

const emit = defineEmits<Emits>()

const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
    if (!value) {
      emit('close')
      emit('cancel')
    }
  }
})

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<style scoped>
.modal-card {
  color: #333;
  font-family: sans-serif;
}

.modal-card-title {
  margin: 0;
  line-height: 1.25;
}

.modal-card-head {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.modal-card-body {
  background-color: #fff;
  overflow-y: auto;
}

.modal-card-foot {
  background-color: #f9fafb;
}
</style>

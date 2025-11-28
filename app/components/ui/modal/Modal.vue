<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isModalOpen"
        class="modal-overlay"
        @click.self="handleOverlayClick"
      >
        <div
          ref="modalRef"
          class="modal-container"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? 'modal-title' : undefined"
          tabindex="-1"
        >
          <div class="modal-card">
            <!-- Header -->
            <div v-if="title || $slots.title" class="modal-card-head">
              <div class="flex items-center justify-between">
                <h3
                  id="modal-title"
                  class="modal-card-title text-left text-lg font-semibold"
                >
                  <slot name="title">{{ title }}</slot>
                </h3>
                <UiButton
                  color="secondary"
                  variant="outline"
                  icon="i-heroicons-x-mark-20-solid"
                  class="-my-1"
                  aria-label="閉じる"
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
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/button/index.vue'

interface Props {
  modelValue: boolean
  title?: string
  closeOnOverlayClick?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close' | 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  closeOnOverlayClick: true
})

const emit = defineEmits<Emits>()

const modalRef = ref<HTMLElement | null>(null)

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

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    closeModal()
  }
}

// ESCキーでモーダルを閉じる
const handleEscKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal()
  }
}

// Body scroll lock and ESC key listener
watch(isModalOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscKey)
    nextTick(() => {
      modalRef.value?.focus()
    })
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleEscKey)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.75);
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 80vw;
  max-height: calc(100vh - 6.5rem);
  overflow-y: auto;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
  }
}

@media (min-width: 640px) {
  .modal-container {
    max-width: 32rem;
  }
}

@media (min-width: 768px) {
  .modal-container {
    max-width: 80vw;
  }
}

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
  border-radius: 0.5rem 0.5rem 0 0;
}

.modal-card-body {
  background-color: #fff;
  overflow-y: auto;
}

.modal-card-foot {
  background-color: #f9fafb;
  border-radius: 0 0 0.5rem 0.5rem;
}

/* Transition styles */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.95);
}
</style>

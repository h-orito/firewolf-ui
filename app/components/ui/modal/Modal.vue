<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        @click.self="handleOverlayClick"
      >
        <Transition
          enter-active-class="transition-transform duration-200 ease-out"
          enter-from-class="scale-95"
          enter-to-class="scale-100"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-from-class="scale-100"
          leave-to-class="scale-95"
        >
          <div
            v-if="isModalOpen"
            ref="modalRef"
            class="relative w-full max-w-full overflow-y-auto rounded-lg bg-white shadow-xl sm:max-w-lg md:max-w-[80vw]"
            :style="{ maxHeight: 'calc(100vh - 6.5rem)' }"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? 'modal-title' : undefined"
            tabindex="-1"
          >
            <div class="font-sans text-gray-700">
              <!-- Header -->
              <div
                v-if="title || $slots.title"
                class="rounded-t-lg border-b border-gray-200 bg-gray-50 px-6 py-4"
              >
                <div class="flex items-center justify-between">
                  <h3
                    id="modal-title"
                    class="m-0 text-left text-lg leading-tight font-semibold"
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
              <div class="overflow-y-auto bg-white px-4 py-4 text-left sm:px-6">
                <slot />
              </div>

              <!-- Footer -->
              <div
                v-if="$slots.footer"
                class="flex justify-end gap-2 rounded-b-lg border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6"
              >
                <slot name="footer" />
              </div>
            </div>
          </div>
        </Transition>
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

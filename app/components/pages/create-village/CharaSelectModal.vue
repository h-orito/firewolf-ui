<template>
  <BaseModal :model-value="isOpen" title="画像から選択" @close="handleClose">
    <p id="modal-description" class="sr-only">
      キャラクター一覧から選択してください
    </p>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      <button
        v-for="chara in charas"
        :key="chara.id"
        type="button"
        class="hover:border-primary-500 focus:ring-primary-500 flex flex-col items-center rounded-lg border border-gray-300 p-3 transition-all hover:font-semibold focus:ring-2 focus:outline-none"
        @click="selectChara(chara)"
      >
        <img
          v-if="chara.face_list?.[0]?.image_url"
          :src="chara.face_list[0].image_url"
          :alt="chara.chara_name.name"
          class="mb-2 h-20 w-20 object-contain"
        />
        <div
          v-else
          class="mb-2 flex h-20 w-20 items-center justify-center bg-gray-100"
        >
          <Icon name="mdi:account" class="text-3xl text-gray-400" />
        </div>
        <p class="text-center text-xs">{{ chara.chara_name.name }}</p>
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '~/components/ui/modal/Modal.vue'
import type { Chara } from '~/lib/api/types'

interface Props {
  isOpen: boolean
  charas: Chara[]
}

defineProps<Props>()

const emit = defineEmits<{
  select: [chara: Chara]
  close: []
}>()

const selectChara = (chara: Chara) => {
  emit('select', chara)
}

const handleClose = () => {
  emit('close')
}
</script>

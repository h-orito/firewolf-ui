<template>
  <Modal
    v-model="isModalOpen"
    title="年齢制限確認"
    :close-on-overlay-click="false"
    :close-on-escape="false"
    :show-close-button="false"
  >
    <p>
      この村は年齢制限が
      <strong class="text-lg text-red-500 dark:text-red-400">{{
        ageLimit
      }}</strong>
      に設定されており、<br />
      暴力表現{{
        ageLimit === 'R18' ? 'や性描写' : ''
      }}などが含まれる可能性があります。
    </p>

    <template #footer>
      <UiButton color="secondary" @click="handleBack"> 表示せず戻る </UiButton>
      <UiButton color="primary" @click="handleConfirm"> 表示する </UiButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/modal/Modal.vue'
import { useVillage } from '~/composables/village/useVillage'
import { useUserSettings } from '~/composables/village/useUserSettings'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()

// 村情報
const { village, villageId } = useVillage()

// ユーザー設定
const { ageLimit: ageLimitSettings, setAgeLimit } = useUserSettings()

// モーダルの開閉状態
const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
  }
})

// 年齢制限タグを取得（R15 または R18）
const ageLimit = computed<string | null>(() => {
  return (
    village.value?.setting?.tags?.list?.find((t: string) =>
      t.startsWith('R')
    ) ?? null
  )
})

/**
 * 表示せず戻る
 */
const handleBack = () => {
  router.push('/')
}

/**
 * 表示する
 */
const handleConfirm = () => {
  if (!villageId.value) {
    closeModal()
    return
  }

  // 既に確認済みかチェック
  const villageIdStr = villageId.value.toString()
  if (ageLimitSettings.value.confirmVillageIds.includes(villageIdStr)) {
    closeModal()
    return
  }

  // 確認済みリストに追加
  const updatedIds = [...ageLimitSettings.value.confirmVillageIds, villageIdStr]
  setAgeLimit({
    confirmVillageIds: updatedIds
  })

  closeModal()
}

/**
 * モーダルを閉じる
 */
const closeModal = () => {
  isModalOpen.value = false
}
</script>

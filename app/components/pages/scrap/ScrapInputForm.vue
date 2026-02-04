<template>
  <div class="space-y-4">
    <Alert type="default">
      アンカーを貼り付けて「追加」すると、発言が読み込まれます。<br />
      <span v-if="isProgress" class="font-bold text-red-600 dark:text-red-400">
        進行中に推理に利用するためにこの画面を共有するのは禁止です。
      </span>
    </Alert>

    <div class="flex gap-2">
      <FormInput
        v-model="inputValue"
        placeholder=">>1"
        size="sm"
        class="flex-1"
        @keyup.enter="handleAdd"
      />
      <UiButton
        color="primary"
        size="sm"
        :disabled="!isValidInput || loading"
        :loading="loading"
        @click="handleAdd"
      >
        追加
      </UiButton>
    </div>

    <div class="flex gap-2">
      <UiButton
        color="secondary"
        size="sm"
        class="flex-1"
        :disabled="!hasMessages"
        @click="handleCopyUrl"
      >
        URLコピー
      </UiButton>
      <UiButton
        color="error"
        size="sm"
        class="flex-1"
        :disabled="!hasMessages"
        @click="handleDelete"
      >
        全削除
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import Alert from '~/components/ui/feedback/Alert.vue'
import FormInput from '~/components/ui/form/FormInput.vue'
import UiButton from '~/components/ui/button/index.vue'

interface Props {
  isProgress?: boolean
  loading?: boolean
  hasMessages?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isProgress: false,
  loading: false,
  hasMessages: false
})

const emit = defineEmits<{
  addScrap: [value: string]
  deleteScrap: []
  copyUrl: []
}>()

const inputValue = ref('')

const isValidInput = computed(() => {
  return inputValue.value.trim() !== ''
})

const handleAdd = () => {
  if (!isValidInput.value || props.loading) return
  emit('addScrap', inputValue.value)
  inputValue.value = ''
}

const handleDelete = () => {
  emit('deleteScrap')
}

const handleCopyUrl = () => {
  emit('copyUrl')
}
</script>

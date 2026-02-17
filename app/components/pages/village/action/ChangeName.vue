<template>
  <ActionPanel title="名前変更" panel-key="change-name">
    <!-- 現在の名前表示 -->
    <p class="mb-3 text-sm">現在の名前: {{ currentName }}</p>

    <!-- エラーメッセージ -->
    <div
      v-if="error"
      class="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ error }}
    </div>

    <!-- キャラ名 -->
    <FormGroup label="キャラ名" class="mb-3">
      <FormInput
        v-model="form.name"
        :maxlength="40"
        placeholder="名前を入力してください"
        size="sm"
      />
      <template #help>
        <div class="text-right">
          <span class="text-xs text-gray-500">{{ form.name.length }}/40</span>
        </div>
      </template>
    </FormGroup>

    <!-- 1文字略称 -->
    <FormGroup label="キャラ名1文字略称" class="mb-3">
      <FormInput
        v-model="form.shortName"
        :maxlength="1"
        placeholder="1文字"
        size="sm"
      />
    </FormGroup>

    <!-- 変更ボタン -->
    <div class="flex justify-end">
      <UiButton
        :disabled="!canSubmit"
        :loading="submitting"
        color="primary"
        block
        @click="handleChangeName"
      >
        名前変更する
      </UiButton>
    </div>
  </ActionPanel>

  <!-- 確認モーダル -->
  <ChangeNameConfirmModal
    v-model="showConfirmModal"
    :submitting="submitting"
    :new-name="form.name"
    :new-short-name="form.shortName"
    @confirm="executeChangeName"
  />
</template>

<script setup lang="ts">
import ActionPanel from './ActionPanel.vue'
import FormGroup from '~/components/ui/form/FormGroup.vue'
import FormInput from '~/components/ui/form/FormInput.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useChangeName } from '~/composables/village/action/useChangeName'
import { useActionReset } from '~/composables/village/action/useActionReset'
import { useSituation } from '~/composables/village/useSituation'

// 遅延ローディング: 確認モーダルはボタンクリック時まで不要
const ChangeNameConfirmModal = defineAsyncComponent(
  () => import('./change-name/ChangeNameConfirmModal.vue')
)

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { situation } = useSituation()
const { onReset } = useActionReset()
const { submitting, error, changeName, clearError } = useChangeName()

// フォーム状態
const form = reactive({
  name: '',
  shortName: ''
})

// 初期化済みフラグ
const isInitialized = ref(false)

// 現在の名前を初期値として設定（一度だけ）
watchEffect(() => {
  if (isInitialized.value) return

  const myself = situation.value?.participate?.myself
  if (myself) {
    form.name = myself.chara_name.name
    form.shortName = myself.chara_name.short_name
    isInitialized.value = true
  }
})

// 現在の名前表示
const currentName = computed(() => {
  const myself = situation.value?.participate?.myself
  if (!myself) return '-'
  return `[${myself.chara_name.short_name}] ${myself.chara_name.name}`
})

// 現在の設定と同じかどうか
const isSameAsCurrent = computed(() => {
  const myself = situation.value?.participate?.myself
  if (!myself) return true
  return (
    form.name === myself.chara_name.name &&
    form.shortName === myself.chara_name.short_name
  )
})

// 変更ボタンを押下できるか
const canSubmit = computed(() => {
  return (
    form.name.length > 0 &&
    form.name.length <= 40 &&
    form.shortName.length === 1 &&
    !isSameAsCurrent.value
  )
})

// 確認モーダル表示
const showConfirmModal = ref(false)

// 名前変更ボタン押下
const handleChangeName = () => {
  clearError()
  showConfirmModal.value = true
}

// 名前変更実行
const executeChangeName = async () => {
  const success = await changeName(form.name, form.shortName)
  if (success) {
    showConfirmModal.value = false
    emit('complete')
  }
}

// リセット処理を登録
onReset(() => {
  clearError()
})
</script>

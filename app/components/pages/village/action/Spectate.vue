<template>
  <ActionPanel title="見学" panel-key="spectate">
    <!-- キャラ選択 -->
    <FormGroup label="キャラ" required>
      <div class="flex gap-2">
        <FormSelect
          v-model="form.charaId"
          :options="charaOptions"
          class="flex-1"
          size="sm"
          placeholder="選択してください"
          @change="onCharaChange"
        />
        <UiButton size="sm" @click="openCharaSelectModal">
          画像で選択
        </UiButton>
      </div>
    </FormGroup>

    <!-- キャラ名 -->
    <FormGroup label="キャラ名" required>
      <FormInput
        v-model="form.charaName"
        :maxlength="40"
        :disabled="!canChangeName"
        size="sm"
      />
    </FormGroup>

    <!-- 1文字略称 -->
    <FormGroup label="キャラ名1文字略称" required>
      <FormInput
        v-model="form.charaShortName"
        :maxlength="1"
        :disabled="!canChangeName"
        size="sm"
      />
    </FormGroup>

    <!-- 入村発言 -->
    <FormGroup label="入村発言" required>
      <MessageDecorators
        v-model="form.joinMessage"
        :textarea-ref="textareaRef"
        class="mb-2"
      />
      <div class="flex flex-col items-start gap-2 sm:flex-row">
        <!-- キャラ画像 -->
        <div class="shrink-0">
          <CharaImage
            v-if="selectedChara"
            :chara="selectedChara"
            face-type="NORMAL"
            :is-small="false"
          />
          <div
            v-else
            class="flex h-20 w-16 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500 dark:bg-gray-600 dark:text-gray-400"
          >
            未選択
          </div>
        </div>

        <!-- メッセージ入力エリア -->
        <div class="w-full flex-1">
          <FormTextarea
            ref="formTextareaRef"
            v-model="form.joinMessage"
            :maxlength="maxMessageLength"
            size="sm"
            :rows="4"
            class="w-full"
          />
          <div class="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
            行数: {{ lineCount }}/{{ maxLineCount }}, 文字数:
            {{ charCountWithoutNewlines }}/{{ maxMessageLength }}
          </div>
        </div>
      </div>
    </FormGroup>

    <!-- 入村パスワード（必要時のみ） -->
    <FormGroup v-if="requiredJoinPassword" label="入村パスワード" required>
      <FormInput v-model="form.joinPassword" type="text" size="sm" />
    </FormGroup>

    <!-- エラーメッセージ -->
    <div
      v-if="spectateError"
      class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
    >
      {{ spectateError }}
    </div>

    <!-- 見学確認ボタン -->
    <div class="flex justify-end">
      <UiButton
        :disabled="!canSubmit || confirming"
        :loading="confirming"
        @click="handleConfirm"
      >
        見学確認
      </UiButton>
    </div>

    <!-- キャラ選択モーダル -->
    <CharaSelectModal
      :is-open="isCharaSelectModalOpen"
      :charas="selectableCharaList"
      @select="onCharaSelect"
      @close="isCharaSelectModalOpen = false"
    />

    <!-- 見学確認モーダル -->
    <SpectateConfirmModal
      v-model="isConfirmModalOpen"
      :confirm-message="confirmMessage"
      :submitting="submitting"
      @spectate="handleSpectate"
    />
  </ActionPanel>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { MessageView, Chara } from '~/lib/api/types'
import ActionPanel from './ActionPanel.vue'
import FormGroup from '~/components/ui/form/FormGroup.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import FormInput from '~/components/ui/form/FormInput.vue'
import FormTextarea from '~/components/ui/form/FormTextarea.vue'
import UiButton from '~/components/ui/button/index.vue'
import CharaSelectModal from '~/components/ui/chara-select/CharaSelectModal.vue'
import CharaImage from '~/components/pages/village/CharaImage.vue'
import MessageDecorators from './decorator/MessageDecorators.vue'
import SpectateConfirmModal from './spectate/SpectateConfirmModal.vue'
import {
  useParticipate,
  type ParticipateForm
} from '~/composables/village/action/useParticipate'
import { useSituation } from '~/composables/village/useSituation'
import { useVillage } from '~/composables/village/useVillage'

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { situation } = useSituation()
const { village, charachips } = useVillage()
const {
  confirming,
  submitting,
  error: spectateError,
  confirmParticipate,
  participate
} = useParticipate()

// FormTextareaへのref
const formTextareaRef = ref<InstanceType<typeof FormTextarea> | null>(null)
// MessageDecorators用のtextarea要素への参照
const textareaRef = computed(
  () => formTextareaRef.value?.textareaElement ?? null
)

// フォーム入力値
const form = reactive({
  charaId: null as number | null,
  charaName: '',
  charaShortName: '',
  joinMessage: '',
  joinPassword: ''
})

// UI状態
const isCharaSelectModalOpen = ref(false)
const isConfirmModalOpen = ref(false)
const confirmMessage = ref<MessageView | null>(null)

// 選択可能なキャラリスト
const selectableCharaList = computed(
  () => situation.value?.participate.selectable_chara_list ?? []
)

// 選択中のキャラ
const selectedChara = computed(() => {
  if (!form.charaId) return null
  return selectableCharaList.value.find((c) => c.id === form.charaId) ?? null
})

// 入村発言の最大文字数・行数
const maxMessageLength = 200
const maxLineCount = 20

// 改行を除いた文字数
const charCountWithoutNewlines = computed(() => {
  return form.joinMessage.replace(/\n/g, '').length
})

// 行数（改行数 + 1）
const lineCount = computed(() => {
  if (!form.joinMessage) return 0
  return form.joinMessage.split('\n').length
})

// キャラ選択用オプション
const charaOptions = computed(() =>
  selectableCharaList.value.map((chara) => ({
    label: chara.chara_name.name,
    value: chara.id
  }))
)

// 入村パスワードが必要か
const requiredJoinPassword = computed(
  () => village.value?.setting.password.join_password_required ?? false
)

// キャラ名変更が可能か
const canChangeName = computed(() => {
  if (!form.charaId) return false
  const chara = selectableCharaList.value.find((c) => c.id === form.charaId)
  if (!chara) return false
  const charachip = charachips.value?.find((c) => c.id === chara.charachip_id)
  return charachip?.is_available_change_name ?? false
})

// 見学ボタンを押下できるか
const canSubmit = computed(() => {
  if (form.charaId === null) return false
  if (form.charaName.length < 1 || form.charaName.length > 40) return false
  if (form.charaShortName.length !== 1) return false
  if (!form.joinMessage || form.joinMessage.length < 1) return false
  if (requiredJoinPassword.value && !form.joinPassword) return false
  return true
})

// キャラ選択モーダルを開く
const openCharaSelectModal = () => {
  isCharaSelectModalOpen.value = true
}

// キャラ選択時（モーダルから）
const onCharaSelect = (chara: DeepReadonly<Chara> | Chara) => {
  form.charaId = chara.id
  form.charaName = chara.chara_name.name
  form.charaShortName = chara.chara_name.short_name
  isCharaSelectModalOpen.value = false
}

// キャラ変更時（セレクトボックスから）
const onCharaChange = () => {
  const chara = selectableCharaList.value.find((c) => c.id === form.charaId)
  if (chara) {
    form.charaName = chara.chara_name.name
    form.charaShortName = chara.chara_name.short_name
  }
}

// 見学確認
const handleConfirm = async () => {
  if (!canSubmit.value || form.charaId === null) return

  const formData: ParticipateForm = {
    charaId: form.charaId,
    charaName: form.charaName,
    charaShortName: form.charaShortName,
    firstRequestSkill: 'LEFTOVER',
    secondRequestSkill: 'LEFTOVER',
    joinMessage: form.joinMessage,
    joinPassword: form.joinPassword,
    spectator: true
  }

  const message = await confirmParticipate(formData)
  if (message) {
    confirmMessage.value = message
    isConfirmModalOpen.value = true
  }
}

// 見学実行
const handleSpectate = async () => {
  if (form.charaId === null) return

  const formData: ParticipateForm = {
    charaId: form.charaId,
    charaName: form.charaName,
    charaShortName: form.charaShortName,
    firstRequestSkill: 'LEFTOVER',
    secondRequestSkill: 'LEFTOVER',
    joinMessage: form.joinMessage,
    joinPassword: form.joinPassword,
    spectator: true
  }

  const success = await participate(formData)
  if (success) {
    isConfirmModalOpen.value = false
    // refreshはActionContainer側で行うため、ここではemitのみ
    emit('complete')
  }
}
</script>

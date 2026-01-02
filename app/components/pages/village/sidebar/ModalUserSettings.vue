<template>
  <Modal v-model="isModalOpen" title="個人設定">
    <div class="space-y-6">
      <!-- ページ分割 -->
      <section>
        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          ページ分割
        </h4>
        <div class="space-y-3">
          <FormSwitch v-model="localSettings.isPaging" label="ページ分割する" />
          <div v-if="localSettings.isPaging" class="ml-1">
            <label class="mb-1 block text-xs text-gray-600 dark:text-gray-400">
              1ページあたりの発言数
            </label>
            <FormSelect
              v-model="localSettings.messagePerPage"
              :options="messagePerPageOptions"
              size="sm"
              class="max-w-[150px]"
            />
          </div>
        </div>
      </section>

      <!-- 発言表示 -->
      <section>
        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          発言表示
        </h4>
        <div class="space-y-3">
          <FormSwitch
            v-model="localSettings.isDispDate"
            label="日付を表示する"
          />
          <FormSwitch
            v-model="localSettings.isCharLarge"
            label="文字を大きく表示する"
          />
          <FormSwitch
            v-model="localSettings.isImgLarge"
            label="キャラ画像を大きく表示する"
          />
        </div>
      </section>

      <!-- テーマ -->
      <section>
        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          テーマ
        </h4>
        <FormSwitch
          v-model="localSettings.isDarkTheme"
          label="ダークテーマにする"
        />
      </section>

      <!-- 操作 -->
      <section>
        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          操作
        </h4>
        <div class="space-y-3">
          <FormSwitch
            v-model="localSettings.isOpenFilterNewtab"
            label="個人抽出を別タブで開く"
          />
          <FormSwitch
            v-model="localSettings.isPasteAnchor"
            label="アンカークリック時に発言欄に貼り付ける"
          />
        </div>
      </section>

      <!-- 通知（参加者のみ） -->
      <section v-if="myself">
        <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          通知
        </h4>
        <div class="space-y-4">
          <FormGroup label="Webhook URL">
            <FormInput
              v-model="localNotification.discordWebhookUrl"
              type="text"
              placeholder="DiscordのWebhook URL"
              :maxlength="200"
              size="sm"
            />
          </FormGroup>
          <FormSwitch
            v-model="localNotification.notifyStartVillage"
            label="村開始通知"
            description="進行中に遷移した際通知する"
          />
          <FormSwitch
            v-model="localNotification.notifyDaychange"
            label="日付更新通知"
            description="日付が更新された際に通知する"
          />
          <FormSwitch
            v-model="localNotification.notifyEpilogueVillage"
            label="エピローグ通知"
            description="エピローグに遷移した際に通知する"
          />
          <FormSwitch
            v-model="localNotification.notifySecretMessage"
            label="秘話通知"
            description="秘話を受け取った際に通知する"
          />
          <FormSwitch
            v-model="localNotification.notifyAnchorMessage"
            label="アンカー指定通知"
            description="あなたの発言がアンカー指定された際に通知する"
          />
          <FormSwitch
            v-model="localNotification.notifyAbilitySayMessage"
            label="役職窓発言通知"
            description="役職窓発言を受け取った際に通知する"
          />
          <FormGroup label="キーワード通知">
            <FormInput
              v-model="localNotification.keywords"
              type="text"
              placeholder="スペース区切りで30文字まで"
              :maxlength="30"
              size="sm"
            />
          </FormGroup>
        </div>
      </section>
    </div>

    <template #footer>
      <UiButton color="secondary" variant="outline" @click="close"
        >閉じる</UiButton
      >
      <UiButton color="primary" :loading="saving" @click="save">
        保存する
      </UiButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/modal/Modal.vue'
import FormSwitch from '~/components/ui/form/FormSwitch.vue'
import FormSelect from '~/components/ui/form/FormSelect.vue'
import FormInput from '~/components/ui/form/FormInput.vue'
import FormGroup from '~/components/ui/form/FormGroup.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useUserSettings } from '~/composables/village/useUserSettings'
import { useVillage } from '~/composables/village/useVillage'
import { useSituation } from '~/composables/village/useSituation'
import { showSuccessToast } from '~/utils/toast'

// Props
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  refresh: []
}>()

// Composables
const { villageId } = useVillage()
const { situation, loadSituation } = useSituation()
const {
  paging,
  messageDisplay,
  theme,
  operation,
  setPaging,
  setMessageDisplay,
  setTheme,
  setOperation
} = useUserSettings()
const { apiCall } = useApi()

// State
const saving = ref(false)

const isModalOpen = computed({
  get: () => props.isOpen,
  set: (value) => {
    if (!value) {
      emit('close')
    }
  }
})

// 参加者情報
const myself = computed(() => situation.value?.participate.myself)

// ローカル設定（保存時にまとめて反映）
const localSettings = reactive({
  isPaging: true,
  messagePerPage: 50,
  isDispDate: false,
  isCharLarge: false,
  isImgLarge: false,
  isDarkTheme: false,
  isOpenFilterNewtab: false,
  isPasteAnchor: false
})

// 通知設定（参加者のみ）
const localNotification = reactive({
  discordWebhookUrl: '',
  notifyStartVillage: false,
  notifyDaychange: false,
  notifyEpilogueVillage: false,
  notifySecretMessage: false,
  notifyAnchorMessage: false,
  notifyAbilitySayMessage: false,
  keywords: ''
})

// 1ページあたりの発言数オプション
const messagePerPageOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: '200', value: 200 }
]

// モーダル表示時に設定を読み込む
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      loadSettings()
    }
  }
)

/**
 * 設定を読み込む
 */
const loadSettings = () => {
  // ページング設定
  localSettings.isPaging = paging.value.isPaging
  localSettings.messagePerPage = paging.value.messagePerPage

  // 発言表示設定
  localSettings.isDispDate = messageDisplay.value.isDispDate
  localSettings.isCharLarge = messageDisplay.value.isCharLarge
  localSettings.isImgLarge = messageDisplay.value.isImgLarge

  // テーマ設定
  localSettings.isDarkTheme = theme.value.isDark

  // 操作設定
  localSettings.isOpenFilterNewtab = operation.value.isOpenFilterNewtab
  localSettings.isPasteAnchor = operation.value.isPasteAnchor

  // 通知設定
  if (myself.value?.notification) {
    const notification = myself.value.notification
    localNotification.discordWebhookUrl = notification.discord_webhook_url ?? ''
    localNotification.notifyStartVillage = notification.village?.start ?? false
    localNotification.notifyDaychange =
      notification.village?.day_change ?? false
    localNotification.notifyEpilogueVillage =
      notification.village?.epilogue ?? false
    localNotification.notifySecretMessage =
      notification.message?.secret_say ?? false
    localNotification.notifyAnchorMessage =
      notification.message?.anchor ?? false
    localNotification.notifyAbilitySayMessage =
      notification.message?.ability_say ?? false
    localNotification.keywords = notification.message?.keywords?.join(' ') ?? ''
  } else {
    // 通知設定をリセット
    localNotification.discordWebhookUrl = ''
    localNotification.notifyStartVillage = false
    localNotification.notifyDaychange = false
    localNotification.notifyEpilogueVillage = false
    localNotification.notifySecretMessage = false
    localNotification.notifyAnchorMessage = false
    localNotification.notifyAbilitySayMessage = false
    localNotification.keywords = ''
  }
}

/**
 * 設定を保存
 */
const save = async () => {
  saving.value = true

  try {
    // Cookie/Store に保存
    setPaging({
      isPaging: localSettings.isPaging,
      messagePerPage: localSettings.messagePerPage
    })

    setMessageDisplay({
      isDispDate: localSettings.isDispDate,
      isCharLarge: localSettings.isCharLarge,
      isImgLarge: localSettings.isImgLarge
    })

    setTheme({
      isDark: localSettings.isDarkTheme
    })

    setOperation({
      isOpenFilterNewtab: localSettings.isOpenFilterNewtab,
      isPasteAnchor: localSettings.isPasteAnchor
    })

    // 通知設定の保存（参加者のみ、Webhook URLが設定されている場合）
    if (myself.value && localNotification.discordWebhookUrl) {
      await saveNotification()
      // 通知設定保存後にsituationを再読み込みして最新の状態を反映
      await loadSituation()
    }

    emit('refresh')
    close()
    showSuccessToast('設定を保存しました')
  } catch (error) {
    console.error('設定の保存に失敗しました:', error)
  } finally {
    saving.value = false
  }
}

/**
 * 通知設定をAPIに保存
 */
const saveNotification = async () => {
  if (!villageId.value) return

  await apiCall(`/village/${villageId.value}/notification-setting`, {
    method: 'POST',
    body: {
      webhook_url: localNotification.discordWebhookUrl,
      village_start: localNotification.notifyStartVillage,
      village_daychange: localNotification.notifyDaychange,
      village_epilogue: localNotification.notifyEpilogueVillage,
      secret_say: localNotification.notifySecretMessage,
      ability_say: localNotification.notifyAbilitySayMessage,
      anchor_say: localNotification.notifyAnchorMessage,
      keyword: localNotification.keywords
    }
  })
}

/**
 * モーダルを閉じる
 */
const close = () => {
  emit('close')
}
</script>

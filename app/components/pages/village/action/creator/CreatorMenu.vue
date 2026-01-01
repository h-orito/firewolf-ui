<template>
  <ActionPanel title="村建てメニュー" panel-key="creator-menu">
    <!-- 強制退村 -->
    <KickOut v-if="isDispKick" @complete="handleComplete" />

    <!-- エピローグ延長 -->
    <ExtendEpilogue
      v-if="isDispExtendEpilogue"
      class="mt-6"
      @complete="handleComplete"
    />

    <!-- 廃村 -->
    <ActionPlaceholder v-if="isDispCancel" title="廃村" class="mt-6" />

    <!-- 設定変更 -->
    <div v-if="isDispModifySetting" class="mt-6">
      <h3 class="mb-3 text-sm font-bold text-gray-900 dark:text-gray-100">
        設定変更
      </h3>
      <div class="flex justify-end">
        <UiButton
          :to="{ path: '/create-village', query: { id: villageId } }"
          color="primary"
          size="sm"
        >
          村の設定を変更する
        </UiButton>
      </div>
    </div>
  </ActionPanel>
</template>

<script setup lang="ts">
import ActionPanel from '../ActionPanel.vue'
import ActionPlaceholder from '../ActionPlaceholder.vue'
import KickOut from './KickOut.vue'
import ExtendEpilogue from './ExtendEpilogue.vue'
import UiButton from '~/components/ui/button/index.vue'
import { useSituation } from '~/composables/village/useSituation'
import { useVillage } from '~/composables/village/useVillage'

const emit = defineEmits<{
  complete: []
}>()

// Composables
const { situation } = useSituation()
const { village } = useVillage()

// 村ID
const villageId = computed(() => village.value?.id ?? 0)

// 表示判定
const isDispKick = computed(
  () => situation.value?.creator.available_kick ?? false
)

const isDispExtendEpilogue = computed(
  () => situation.value?.creator.available_extend_epilogue ?? false
)

const isDispCancel = computed(
  () => situation.value?.creator.available_cancel_village ?? false
)

const isDispModifySetting = computed(
  () => situation.value?.creator.available_modify_setting ?? false
)

/**
 * 完了ハンドラ
 */
const handleComplete = () => {
  emit('complete')
}
</script>

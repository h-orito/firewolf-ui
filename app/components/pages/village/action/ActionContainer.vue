<template>
  <div v-if="existsAction" class="action-container space-y-4 py-4">
    <!-- 発言 -->
    <Say v-if="isDispSay" @complete="handleActionComplete" />

    <!-- 入村 -->
    <Participate v-if="isDispParticipate" @complete="handleActionComplete" />

    <!-- 見学 -->
    <Spectate v-if="isDispSpectate" @complete="handleActionComplete" />

    <!-- 役職希望 -->
    <ActionPlaceholder v-if="isDispSkillRequest" title="役職希望" />

    <!-- 退村 -->
    <Leave v-if="isDispLeave" @complete="handleActionComplete" />

    <!-- 能力行使 -->
    <ActionPlaceholder
      v-for="ability in usableAbilities"
      :key="ability.type.code"
      :title="ability.type.name"
    />

    <!-- 投票 -->
    <ActionPlaceholder v-if="isDispVote" title="投票" />

    <!-- CO -->
    <ActionPlaceholder v-if="isDispComingout" title="CO" />

    <!-- 時短 -->
    <ActionPlaceholder v-if="isDispCommit" title="時短" />

    <!-- アクション発言 -->
    <ActionTypeSay v-if="isDispActionSay" @complete="handleActionComplete" />

    <!-- 名前変更 -->
    <ActionPlaceholder v-if="isDispChangeName" title="名前変更" />

    <!-- 村建てメニュー -->
    <ActionPlaceholder v-if="isDispCreatorMenu" title="村建てメニュー" />

    <!-- 管理者メニュー -->
    <ActionPlaceholder v-if="isDispAdminMenu" title="管理者メニュー" />
  </div>
</template>

<script setup lang="ts">
import ActionPlaceholder from './ActionPlaceholder.vue'
import Say from './Say.vue'
import Participate from './Participate.vue'
import Spectate from './Spectate.vue'
import Leave from './Leave.vue'
import ActionTypeSay from './ActionTypeSay.vue'
import { useSituation } from '~/composables/village/useSituation'
import { useVillageRefresh } from '~/composables/village/useVillageRefresh'
import { MESSAGE_TYPE } from '~/lib/api/message-constants'

// Composables
const { situation } = useSituation()
const { refresh } = useVillageRefresh()

// 表示判定
const isDispSay = computed(() => situation.value?.say.available_say ?? false)

const isDispParticipate = computed(
  () => situation.value?.participate.available_participate ?? false
)

const isDispSpectate = computed(
  () => situation.value?.participate.available_spectate ?? false
)

const isDispSkillRequest = computed(
  () =>
    (situation.value?.participate.participating ?? false) &&
    (situation.value?.skill_request.available_skill_request ?? false)
)

const isDispLeave = computed(
  () => situation.value?.participate.available_leave ?? false
)

const isDispVote = computed(() => situation.value?.vote.available_vote ?? false)

const isDispComingout = computed(
  () => situation.value?.coming_out.available_coming_out ?? false
)

const isDispCommit = computed(
  () => situation.value?.commit.available_commit ?? false
)

const isDispActionSay = computed(() => {
  const selectableList = situation.value?.say.selectable_message_type_list ?? []
  return selectableList.some((s) => s.message_type.code === MESSAGE_TYPE.ACTION)
})

const isDispChangeName = computed(
  () =>
    (situation.value?.participate.participating ?? false) &&
    (situation.value?.rp.is_available_change_name ?? false)
)

const isDispCreatorMenu = computed(
  () => situation.value?.creator.available_creator_setting ?? false
)

const isDispAdminMenu = computed(() => situation.value?.admin.admin ?? false)

// 使用可能な能力一覧
const usableAbilities = computed(
  () => situation.value?.ability.list.filter((ab) => ab.usable) ?? []
)

// アクションが存在するかどうか
const existsAction = computed(() => {
  return (
    isDispSay.value ||
    isDispParticipate.value ||
    isDispSpectate.value ||
    isDispSkillRequest.value ||
    isDispLeave.value ||
    isDispVote.value ||
    isDispComingout.value ||
    isDispCommit.value ||
    isDispActionSay.value ||
    isDispChangeName.value ||
    isDispCreatorMenu.value ||
    isDispAdminMenu.value ||
    usableAbilities.value.length > 0
  )
})

/**
 * アクション完了時のハンドラ
 * 後続タスクで各アクションコンポーネントから呼び出される
 * refresh内でtriggerResetが呼ばれるため、ここでは呼び出し不要
 */
const handleActionComplete = async () => {
  await refresh()
}

// 後続タスクで使用するため、exposeで公開
defineExpose({
  handleActionComplete
})
</script>

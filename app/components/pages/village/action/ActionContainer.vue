<template>
  <div v-if="existsAction" class="action-container space-y-4 py-4">
    <!-- 発言 -->
    <Say v-if="isDispSay" @complete="handleActionComplete" />

    <!-- 入村 -->
    <Participate v-if="isDispParticipate" @complete="handleActionComplete" />

    <!-- 見学 -->
    <Spectate v-if="isDispSpectate" @complete="handleActionComplete" />

    <!-- 役職希望 -->
    <SkillRequest v-if="isDispSkillRequest" @complete="handleActionComplete" />

    <!-- 退村 -->
    <Leave v-if="isDispLeave" @complete="handleActionComplete" />

    <!-- 能力行使 -->
    <Ability
      v-for="ability in usableAbilities"
      :key="ability.type.code"
      :ability="ability"
      @complete="handleActionComplete"
    />

    <!-- 投票 -->
    <Vote v-if="isDispVote" @complete="handleActionComplete" />

    <!-- CO -->
    <Comingout v-if="isDispComingout" @complete="handleActionComplete" />

    <!-- 時短 -->
    <Commit v-if="isDispCommit" @complete="handleActionComplete" />

    <!-- アクション発言 -->
    <ActionTypeSay v-if="isDispActionSay" @complete="handleActionComplete" />

    <!-- 名前変更 -->
    <ChangeName v-if="isDispChangeName" @complete="handleActionComplete" />

    <!-- 村建て発言 -->
    <CreatorSay v-if="isDispCreatorSay" @complete="handleActionComplete" />

    <!-- 村建てメニュー -->
    <CreatorMenu v-if="isDispCreatorMenu" @complete="handleActionComplete" />

    <!-- 管理者メニュー -->
    <Admin v-if="isDispAdminMenu" />

    <!-- デバッグメニュー（ローカル環境のみ） -->
    <Debug v-if="isDispDebugMenu" @complete="handleActionComplete" />
  </div>
</template>

<script setup lang="ts">
import Ability from './Ability.vue'
import ActionTypeSay from './ActionTypeSay.vue'
import Admin from './admin/Admin.vue'
import Comingout from './Comingout.vue'
import Commit from './Commit.vue'
import Debug from './admin/Debug.vue'
import ChangeName from './ChangeName.vue'
import CreatorSay from './creator/CreatorSay.vue'
import CreatorMenu from './creator/CreatorMenu.vue'
import Leave from './Leave.vue'
import Participate from './Participate.vue'
import Say from './Say.vue'
import SkillRequest from './SkillRequest.vue'
import Spectate from './Spectate.vue'
import Vote from './Vote.vue'
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

const isDispCreatorSay = computed(
  () => situation.value?.creator.available_creator_say ?? false
)

const isDispCreatorMenu = computed(() => {
  return (
    (situation.value?.creator.available_kick ||
      situation.value?.creator.available_extend_epilogue ||
      situation.value?.creator.available_cancel_village ||
      situation.value?.creator.available_modify_setting) ??
    false
  )
})

const isDispAdminMenu = computed(() => situation.value?.admin.admin ?? false)

// デバッグメニュー表示判定（ローカル環境のみ）
const isDispDebugMenu = computed(() => {
  return process.env.NODE_ENV !== 'production'
})

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
    isDispCreatorSay.value ||
    isDispCreatorMenu.value ||
    isDispAdminMenu.value ||
    isDispDebugMenu.value ||
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

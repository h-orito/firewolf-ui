<template>
  <div>
    <b-notification
      v-if="errors"
      type="is-danger"
      :closable="false"
      class="is-size-7"
    >
      <ul>
        <li v-for="err in errors.split('\n')" :key="err">{{ err }}</li>
      </ul>
    </b-notification>
    <validation-observer
      ref="observer"
      v-slot="{ invalid }"
      tag="form"
      class="is-size-7"
    >
      <village-name :input-value.sync="villageNameModel" />
      <hr />
      <h2 class="title is-6">時間</h2>
      <notification>
        <li>1日の長さは24時間固定です。</li>
      </notification>
      <start-datetime :input-value.sync="startDatetimeModel" />
      <silent-hours :input-value.sync="silentHoursModel" />
      <hr />
      <div v-if="modifiableChara">
        <h2 class="title is-6">キャラチップ</h2>
        <charachip
          :input-value.sync="charachipIdsModel"
          :charachips="charachips"
          @load-charas="loadCharasByCharachipId($event.participantIds)"
        />
        <dummy-chara
          :input-value.sync="dummyCharaIdModel"
          :charas="charas"
          @chara-select="charaSelect($event)"
        />
        <hr />
      </div>
      <h2 class="title is-6">編成</h2>
      <organization-notification />
      <organization
        :input-value.sync="organizationModel"
        :available-dummy-skill="availableDummySkill"
        :skills="skills"
        ref="org"
        @override="overrideGeneralOrg"
      />
      <form-switch
        rules="required"
        label-message="役欠け"
        description="ダミー役欠けをありにする"
        :input-value.sync="availableDummySkillModel"
      />
      <hr />
      <h2 class="title is-6">詳細ルール</h2>
      <form-switch
        rules="required"
        label-message="記名投票"
        description="記名投票にする"
        :input-value.sync="openVoteModel"
      />
      <form-switch
        rules="required"
        label-message="役職希望"
        description="役職希望ありにする"
        :input-value.sync="availableSkillRequestModel"
      />
      <form-switch
        rules="required"
        label-message="見学"
        description="見学ありにする"
        :input-value.sync="availableSpectateModel"
      />
      <form-switch
        rules="required"
        label-message="突然死"
        description="突然死ありにする"
        :input-value.sync="availableSuddelnyDeathModel"
      />
      <form-switch
        rules="required"
        label-message="時短"
        description="時短希望ありにする"
        :input-value.sync="availableCommitModel"
      />
      <hr />
      <h2 class="title is-6">発言制限</h2>
      <notification>
        <li>回数は0〜1000（通常発言は1〜1000）で設定できます。</li>
        <li>文字数は1〜1000で設定できます。</li>
      </notification>
      <form-number
        rules="required|max_value:1000|min_value:1"
        label-message="通常発言回数"
        max="1000"
        min="1"
        step="1"
        :input-value.sync="normalCountModel"
        class="m-b-5"
      />
      <form-number
        rules="required|max_value:1000|min_value:1"
        label-message="通常発言文字数"
        max="1000"
        min="1"
        step="1"
        :input-value.sync="normalLengthModel"
        class="m-b-20"
      />
      <form-number
        rules="required|max_value:1000|min_value:0"
        label-message="人狼の囁き回数"
        max="1000"
        min="0"
        step="1"
        :input-value.sync="whisperCountModel"
        class="m-b-5"
      />
      <form-number
        rules="required|max_value:1000|min_value:1"
        label-message="人狼の囁き文字数"
        max="1000"
        min="1"
        step="1"
        :input-value.sync="whisperLengthModel"
        class="m-b-20"
      />
      <form-number
        rules="required|max_value:1000|min_value:0"
        label-message="共鳴発言回数"
        max="1000"
        min="0"
        step="1"
        :input-value.sync="sympathizeCountModel"
        class="m-b-5"
      />
      <form-number
        rules="required|max_value:1000|min_value:1"
        label-message="共鳴発言文字数"
        max="1000"
        min="1"
        step="1"
        :input-value.sync="sympathizeLengthModel"
        class="m-b-20"
      />
      <form-number
        rules="required|max_value:1000|min_value:0"
        label-message="恋人発言回数"
        max="1000"
        min="0"
        step="1"
        :input-value.sync="loversCountModel"
        class="m-b-5"
      />
      <form-number
        rules="required|max_value:1000|min_value:1"
        label-message="恋人発言文字数"
        max="1000"
        min="1"
        step="1"
        :input-value.sync="loversLengthModel"
        class="m-b-20"
      />
      <form-number
        rules="required|max_value:1000|min_value:0"
        label-message="死者の呻き回数"
        max="1000"
        min="0"
        step="1"
        :input-value.sync="graveCountModel"
        class="m-b-5"
      />
      <form-number
        rules="required|max_value:1000|min_value:1"
        label-message="死者の呻き文字数"
        max="1000"
        min="1"
        step="1"
        :input-value.sync="graveLengthModel"
        class="m-b-20"
      />
      <form-number
        rules="required|max_value:1000|min_value:0"
        label-message="独り言回数"
        max="1000"
        min="0"
        step="1"
        :input-value.sync="monologueCountModel"
        class="m-b-5"
      />
      <form-number
        rules="required|max_value:1000|min_value:0"
        label-message="独り言文字数"
        max="1000"
        min="1"
        step="1"
        :input-value.sync="monologueLengthModel"
        class="m-b-20"
      />
      <form-number
        rules="required|max_value:1000|min_value:0"
        label-message="見学発言回数"
        max="1000"
        min="0"
        step="1"
        :input-value.sync="spectateCountModel"
        class="m-b-5"
      />
      <form-number
        rules="required|max_value:1000|min_value:0"
        label-message="見学発言文字数"
        max="1000"
        min="1"
        step="1"
        :input-value.sync="spectateLengthModel"
      />
      <hr />
      <h2 class="title is-6">参加パスワード</h2>
      <join-password :input-value.sync="joinPasswordModel" />
      <hr />
      <h2 class="title is-6">RP設定</h2>
      <form-switch
        rules="required"
        label-message="墓下見学会話公開"
        description="墓下見学発言を生存者が見られるようにする"
        :input-value.sync="visibleGraveMessageModel"
      />
      <form-switch
        rules="required"
        label-message="秘話"
        description="秘話をありにする"
        :input-value.sync="availableSecretSay"
      />
      <form-switch
        rules="required"
        label-message="アクション"
        description="アクション発言を可能にする"
        :input-value.sync="availableAction"
      />
      <form-number
        rules="required|max_value:1000|min_value:0"
        label-message="アクション回数"
        max="1000"
        min="0"
        step="1"
        :input-value.sync="actionCountModel"
        class="m-b-5"
      />
      <form-number
        rules="required|max_value:1000|min_value:1"
        label-message="アクション文字数"
        max="1000"
        min="1"
        step="1"
        :input-value.sync="actionLengthModel"
        class="m-b-20"
      />
      <hr />
      <b-field class="has-text-right">
        <b-button
          :disabled="confirming || invalid"
          size="is-small"
          @click="confirm"
          type="is-primary"
          >確認画面へ</b-button
        >
      </b-field>
      <modal-confirm
        :param="registerParam"
        :charachip-name="charachipName"
        :dummy-chara-name="dummyCharaName"
        :is-open="isOpenConfirmModal"
        :save-label="saveLabel"
        @close="isOpenConfirmModal = false"
        @create="save"
      />
    </validation-observer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import qs from 'qs'
import dayjs from 'dayjs'
// type
import Charachips from '~/components/type/charachips'
import Charachip from '~/components/type/charachip'
import Charas from '~/components/type/charas'
import Chara from '~/components/type/chara'
import Skills from '~/components/type/skills'
import Skill from '~/components/type/skill'
import { MESSAGE_TYPE } from '~/components/const/consts'
import FormOption from '~/components/common/validation/option'
// component
import organization from '~/components/create-village/form/organization.vue'
import toast from '~/components/village/village-toast'

@Component({
  components: {
    formNumber: () => import('~/components/common/validation/form-number.vue'),
    formSwitch: () => import('~/components/common/validation/form-switch.vue'),
    notification: () => import('~/components/common/notification.vue'),
    villageName: () =>
      import('~/components/create-village/form/village-name.vue'),
    startDatetime: () =>
      import('~/components/create-village/form/start-datetime.vue'),
    silentHours: () =>
      import('~/components/create-village/form/silent-hours.vue'),
    charachip: () => import('~/components/create-village/form/charachip.vue'),
    dummyChara: () =>
      import('~/components/create-village/form/dummy-chara.vue'),
    organizationNotification: () =>
      import('~/components/create-village/organization-notification.vue'),
    organization,
    joinPassword: () =>
      import('~/components/create-village/form/join-password.vue'),
    modalConfirm: () => import('~/components/create-village/modal-confirm.vue')
  }
})
export default class Setting extends Vue {
  // form data ------------------------------------

  /** villageName */
  @Prop({ type: String, required: true })
  private villageName!: string

  private get villageNameModel(): string {
    return this.villageName
  }

  private set villageNameModel(val: string) {
    this.$emit('update:villageName', val)
  }

  /** startDatetime */
  @Prop({ type: Date, required: true })
  private startDatetime!: Date

  private get startDatetimeModel(): Date {
    return this.startDatetime
  }

  private set startDatetimeModel(val: Date) {
    this.$emit('update:startDatetime', val)
  }

  /** silentHours */
  @Prop({ type: String, required: true })
  private silentHours!: string

  private get silentHoursModel(): string {
    return this.silentHours
  }

  private set silentHoursModel(val: string) {
    this.$emit('update:silentHours', val)
  }

  /** charachipIds */
  @Prop({ type: Array, required: true })
  private charachipIds!: Array<string>

  private get charachipIdsModel(): Array<string> {
    return this.charachipIds
  }

  private set charachipIdsModel(val: Array<string>) {
    this.$emit('update:charachipIds', val)
  }

  /** dummyCharaId */
  @Prop({ type: String, required: true })
  private dummyCharaId!: string

  private get dummyCharaIdModel(): string {
    return this.dummyCharaId
  }

  private set dummyCharaIdModel(val: string) {
    this.$emit('update:dummyCharaId', val)
  }

  /** organization */
  @Prop({ type: String, required: true })
  private organization!: string

  private get organizationModel(): string {
    return this.organization
  }

  private set organizationModel(val: string) {
    this.$emit('update:organization', val)
  }

  /** availableDummySkill */
  @Prop({ type: Boolean, required: true })
  private availableDummySkill!: boolean

  private get availableDummySkillModel(): boolean {
    return this.availableDummySkill
  }

  private set availableDummySkillModel(val: boolean) {
    this.$emit('update:availableDummySkill', val)
  }

  /** openVote */
  @Prop({ type: Boolean, required: true })
  private openVote!: boolean

  private get openVoteModel(): boolean {
    return this.openVote
  }

  private set openVoteModel(val: boolean) {
    this.$emit('update:openVote', val)
  }

  /** availableSkillRequest */
  @Prop({ type: Boolean, required: true })
  private availableSkillRequest!: boolean

  private get availableSkillRequestModel(): boolean {
    return this.availableSkillRequest
  }

  private set availableSkillRequestModel(val: boolean) {
    this.$emit('update:availableSkillRequest', val)
  }

  /** availableSpectate */
  @Prop({ type: Boolean, required: true })
  private availableSpectate!: boolean

  private get availableSpectateModel(): boolean {
    return this.availableSpectate
  }

  private set availableSpectateModel(val: boolean) {
    this.$emit('update:availableSpectate', val)
  }

  /** openSkillInGrave */
  @Prop({ type: Boolean, required: true })
  private openSkillInGrave!: boolean

  private get openSkillInGraveModel(): boolean {
    return this.openSkillInGrave
  }

  private set openSkillInGraveModel(val: boolean) {
    this.$emit('update:openSkillInGrave', val)
  }

  /** visibleGraveMessage */
  @Prop({ type: Boolean, required: true })
  private visibleGraveMessage!: boolean

  private get visibleGraveMessageModel(): boolean {
    return this.visibleGraveMessage
  }

  private set visibleGraveMessageModel(val: boolean) {
    this.$emit('update:visibleGraveMessage', val)
  }

  /** availableSuddelnyDeath */
  @Prop({ type: Boolean, required: true })
  private availableSuddelnyDeath!: boolean

  private get availableSuddelnyDeathModel(): boolean {
    return this.availableSuddelnyDeath
  }

  private set availableSuddelnyDeathModel(val: boolean) {
    this.$emit('update:availableSuddelnyDeath', val)
  }

  /** availableCommit */
  @Prop({ type: Boolean, required: true })
  private availableCommit!: boolean

  private get availableCommitModel(): boolean {
    return this.availableCommit
  }

  private set availableCommitModel(val: boolean) {
    this.$emit('update:availableCommit', val)
  }

  /** normalCount */
  @Prop({ type: String, required: true })
  private normalCount!: string

  private get normalCountModel(): string {
    return this.normalCount
  }

  private set normalCountModel(val: string) {
    this.$emit('update:normalCount', val)
  }

  /** normalLength */
  @Prop({ type: String, required: true })
  private normalLength!: string

  private get normalLengthModel(): string {
    return this.normalLength
  }

  private set normalLengthModel(val: string) {
    this.$emit('update:normalLength', val)
  }

  /** whisperCount */
  @Prop({ type: String, required: true })
  private whisperCount!: string

  private get whisperCountModel(): string {
    return this.whisperCount
  }

  private set whisperCountModel(val: string) {
    this.$emit('update:whisperCount', val)
  }

  /** whisperLength */
  @Prop({ type: String, required: true })
  private whisperLength!: string

  private get whisperLengthModel(): string {
    return this.whisperLength
  }

  private set whisperLengthModel(val: string) {
    this.$emit('update:whisperLength', val)
  }

  /** sympathizeCount */
  @Prop({ type: String, required: true })
  private sympathizeCount!: string

  private get sympathizeCountModel(): string {
    return this.sympathizeCount
  }

  private set sympathizeCountModel(val: string) {
    this.$emit('update:sympathizeCount', val)
  }

  /** sympathizeLength */
  @Prop({ type: String, required: true })
  private sympathizeLength!: string

  private get sympathizeLengthModel(): string {
    return this.sympathizeLength
  }

  private set sympathizeLengthModel(val: string) {
    this.$emit('update:sympathizeLength', val)
  }

  /** loversCount */
  @Prop({ type: String, required: true })
  private loversCount!: string

  private get loversCountModel(): string {
    return this.loversCount
  }

  private set loversCountModel(val: string) {
    this.$emit('update:loversCount', val)
  }

  /** loversLength */
  @Prop({ type: String, required: true })
  private loversLength!: string

  private get loversLengthModel(): string {
    return this.loversLength
  }

  private set loversLengthModel(val: string) {
    this.$emit('update:loversLength', val)
  }

  /** graveCount */
  @Prop({ type: String, required: true })
  private graveCount!: string

  private get graveCountModel(): string {
    return this.graveCount
  }

  private set graveCountModel(val: string) {
    this.$emit('update:graveCount', val)
  }

  /** graveLength */
  @Prop({ type: String, required: true })
  private graveLength!: string

  private get graveLengthModel(): string {
    return this.graveLength
  }

  private set graveLengthModel(val: string) {
    this.$emit('update:graveLength', val)
  }

  /** monologueCount */
  @Prop({ type: String, required: true })
  private monologueCount!: string

  private get monologueCountModel(): string {
    return this.monologueCount
  }

  private set monologueCountModel(val: string) {
    this.$emit('update:monologueCount', val)
  }

  /** monologueLength */
  @Prop({ type: String, required: true })
  private monologueLength!: string

  private get monologueLengthModel(): string {
    return this.monologueLength
  }

  private set monologueLengthModel(val: string) {
    this.$emit('update:monologueLength', val)
  }

  /** spectateCount */
  @Prop({ type: String, required: true })
  private spectateCount!: string

  private get spectateCountModel(): string {
    return this.spectateCount
  }

  private set spectateCountModel(val: string) {
    this.$emit('update:spectateCount', val)
  }

  /** spectateLength */
  @Prop({ type: String, required: true })
  private spectateLength!: string

  private get spectateLengthModel(): string {
    return this.spectateLength
  }

  private set spectateLengthModel(val: string) {
    this.$emit('update:spectateLength', val)
  }

  /** joinPassword */
  @Prop({ type: String, required: true })
  private joinPassword!: string

  private get joinPasswordModel(): string {
    return this.joinPassword
  }

  private set joinPasswordModel(val: string) {
    this.$emit('update:joinPassword', val)
  }

  /** availableSecretSay */
  @Prop({ type: Boolean, required: true })
  private availableSecretSay!: boolean

  private get availableSecretSayModel(): boolean {
    return this.availableSecretSay
  }

  private set availableSecretSayModel(val: boolean) {
    this.$emit('update:availableSecretSay', val)
  }

  /** availableAction */
  @Prop({ type: Boolean, required: true })
  private availableAction!: boolean

  private get availableActionModel(): boolean {
    return this.availableAction
  }

  private set availableActionModel(val: boolean) {
    this.$emit('update:availableAction', val)
  }

  /** actionCount */
  @Prop({ type: String, required: true })
  private actionCount!: string

  private get actionCountModel(): string {
    return this.actionCount
  }

  private set actionCountModel(val: string) {
    this.$emit('update:actionCount', val)
  }

  /** actionLength */
  @Prop({ type: String, required: true })
  private actionLength!: string

  private get actionLengthModel(): string {
    return this.actionLength
  }

  private set actionLengthModel(val: string) {
    this.$emit('update:actionLength', val)
  }

  @Prop({ type: String, required: true })
  private saveLabel!: string

  @Prop({ type: Boolean, required: false, default: true })
  private modifiableChara!: boolean

  /** data */
  private errors: string = ''
  private confirming: boolean = false
  private isOpenConfirmModal: boolean = false
  private charachips: FormOption[] = []
  private charas: Chara[] = []
  private skills: Skill[] = []

  /** computed */
  private get charachipName(): string {
    return this.charachipIds
      .map(id => this.charachips.find(c => c.value === id)?.label)
      .join('、')
  }

  private get dummyCharaName(): string {
    const chara = this.charas.find(c => c.id.toString() === this.dummyCharaId)
    return chara ? chara.chara_name.name : ''
  }

  /** methods */
  private async loadCharachips(): Promise<void> {
    const charachips: Charachips = await this.$axios.$get('/charachip/list')
    this.charachips = charachips.list.map((charachip: Charachip) => ({
      key: charachip.id.toString(),
      label: charachip.name,
      value: charachip.id.toString()
    }))
  }

  private loadCharas(): void {
    this.loadCharasByCharachipId(this.charachipIds)
  }

  private async loadCharasByCharachipId(
    charachipIds: Array<string>
  ): Promise<void> {
    const charas: Charas = await this.$axios.$get(`/charas`, {
      params: {
        charachipIds
      },
      paramsSerializer: params =>
        qs.stringify(params, { arrayFormat: 'repeat' })
    })
    this.charas = charas.list
    this.dummyCharaIdModel = charas.list[0].id.toString()
  }

  private async loadSkills(): Promise<void> {
    const skills: Skills = await this.$axios.$get('/skill/list')
    this.skills = skills.list
  }

  private charaSelect({ charaId }): void {
    this.dummyCharaId = charaId.toString()
  }

  private overrideGeneralOrg(): void {
    // @ts-ignore
    this.organizationModel = this.$refs.org.createGeneralOrg()
  }

  private overrideOrgMinMax(org: string): void {
    // @ts-ignore
    this.$refs.org.overrideOrgMinMax(org)
  }

  private async confirm() {
    this.confirming = true
    this.errors = ''
    const self = this
    await this.$emit('confirm', {
      param: this.registerParam,
      errCb: err => {
        toast.danger(self, 'エラーが発生しました。設定を確認してください。')
        if (self.isBusinessError(err)) {
          self.errors = err.response.data.message
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }
        self.confirming = false
      },
      successCb: () => {
        self.isOpenConfirmModal = true
        self.confirming = false
      }
    })
  }

  private async save() {
    const self = this
    await this.$emit('save', {
      param: this.registerParam,
      errCb: err => {
        toast.danger(self, 'エラーが発生しました。設定を確認してください。')
        console.log(err)
      }
    })
  }

  private isBusinessError(err: any): boolean {
    const code = parseInt(err.response && err.response.status)
    return (
      code === 404 &&
      err.response.data.status === 499 &&
      err.response.data.message &&
      err.response.data.message.length > 0
    )
  }

  private get registerParam(): Object {
    // @ts-ignore
    const startDatetime = this.$dayjs(this.startDatetime).format(
      'YYYY-MM-DDTHH:mm:ss'
    )
    const organization: string = this.organization
      .replace(/\r\n/, '\n')
      .split('\n')
      .map(line => {
        return line.split('人：')[1]
      })
      .join('\n')

    return {
      village_name: this.villageName,
      setting: {
        time: {
          start_datetime: startDatetime,
          silent_hours: this.silentHours
        },
        organization: {
          organization
        },
        charachip: {
          dummy_chara_id: parseInt(this.dummyCharaId),
          charachip_ids: this.charachipIds.map(id => parseInt(id))
        },
        rule: {
          open_vote: this.openVote,
          available_skill_request: this.availableSkillRequest,
          available_spectate: this.availableSpectate,
          open_skill_in_grave: this.openSkillInGrave,
          visible_grave_message: this.visibleGraveMessage,
          available_suddenly_death: this.availableSuddelnyDeath,
          available_commit: this.availableCommit,
          available_dummy_skill: this.availableDummySkill,
          available_action: this.availableAction,
          available_secret_say: this.availableSecretSay,
          restrict_list: [
            {
              type: MESSAGE_TYPE.NORMAL_SAY,
              count: this.normalCount,
              length: this.normalLength
            },
            {
              type: MESSAGE_TYPE.WEREWOLF_SAY,
              count: this.whisperCount,
              length: this.whisperLength
            },
            {
              type: MESSAGE_TYPE.SYMPATHIZE_SAY,
              count: this.sympathizeCount,
              length: this.sympathizeLength
            },
            {
              type: MESSAGE_TYPE.LOVERS_SAY,
              count: this.loversCount,
              length: this.loversLength
            },
            {
              type: MESSAGE_TYPE.GRAVE_SAY,
              count: this.graveCount,
              length: this.graveLength
            },
            {
              type: MESSAGE_TYPE.MONOLOGUE_SAY,
              count: this.monologueCount,
              length: this.monologueLength
            },
            {
              type: MESSAGE_TYPE.SPECTATE_SAY,
              count: this.spectateCount,
              length: this.spectateLength
            },
            {
              type: MESSAGE_TYPE.ACTION,
              count: this.actionCount,
              length: this.actionLength
            }
          ],
          join_password: this.joinPassword
        }
      }
    }
  }
}
</script>

<style lang="scss">
.textarea {
  font-family: sans-serif !important;
}
</style>

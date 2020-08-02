<template>
  <section class="section">
    <div class="container has-text-left">
      <h1 class="title is-5 m-t-40">村を作成</h1>
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
        tag="form"
        class="is-size-7"
      >
        <village-name :input-value.sync="villageName" />
        <hr />
        <h2 class="title is-6">時間</h2>
        <notification>
          <li>1日の長さは24時間固定です。</li>
        </notification>
        <start-datetime :input-value.sync="startDatetime" />
        <silent-hours :input-value.sync="siltntHours" />
        <hr />
        <h2 class="title is-6">キャラチップ</h2>
        <charachip
          :input-value.sync="charachipId"
          :charachips="charachips"
          @load-charas="loadCharas()"
        />
        <dummy-chara
          :input-value.sync="dummyCharaId"
          :charas="charas"
          @chara-select="charaSelect($event)"
        />
        <hr />
        <h2 class="title is-6">編成</h2>
        <organization-notification />
        <organization
          :input-value.sync="organization"
          :available-dummy-skill="availableDummySkill"
          :skills="skills"
          ref="org"
          @override="overrideGeneralOrg"
        />
        <form-switch
          rules="required"
          label-message="役欠け"
          description="ダミー役欠けをありにする"
          :input-value.sync="availableDummySkill"
        />
        <hr />
        <h2 class="title is-6">詳細ルール</h2>
        <form-switch
          rules="required"
          label-message="記名投票"
          description="記名投票にする"
          :input-value.sync="openVote"
        />
        <form-switch
          rules="required"
          label-message="役職希望"
          description="役職希望ありにする"
          :input-value.sync="availableSkillRequest"
        />
        <form-switch
          rules="required"
          label-message="見学"
          description="見学ありにする"
          :input-value.sync="availableSpectate"
        />
        <form-switch
          rules="required"
          label-message="突然死"
          description="突然死ありにする"
          :input-value.sync="availableSuddelnyDeath"
        />
        <form-switch
          rules="required"
          label-message="時短"
          description="時短希望ありにする"
          :input-value.sync="availableCommit"
        />
        <hr />
        <h2 class="title is-6">発言制限</h2>
        <notification>
          <li>回数は0〜100（通常発言は1〜100）で設定できます。</li>
          <li>文字数は1〜200で設定できます。</li>
        </notification>
        <form-number
          rules="required|max:100|min:1"
          label-message="通常発言回数"
          max="100"
          min="1"
          step="1"
          :input-value.sync="normalCount"
        />
        <form-number
          rules="required|max:200|min:1"
          label-message="通常発言文字数"
          max="200"
          min="1"
          step="1"
          :input-value.sync="normalLength"
          class="m-b-20"
        />
        <form-number
          rules="required|max:100|min:0"
          label-message="人狼の囁き回数"
          max="100"
          min="0"
          step="1"
          :input-value.sync="whisperCount"
        />
        <form-number
          rules="required|max:200|min:1"
          label-message="人狼の囁き文字数"
          max="200"
          min="1"
          step="1"
          :input-value.sync="whisperLength"
          class="m-b-20"
        />
        <form-number
          rules="required|max:100|min:0"
          label-message="死者の呻き回数"
          max="100"
          min="0"
          step="1"
          :input-value.sync="graveCount"
        />
        <form-number
          rules="required|max:200|min:1"
          label-message="死者の呻き文字数"
          max="200"
          min="1"
          step="1"
          :input-value.sync="graveLength"
          class="m-b-20"
        />
        <form-number
          rules="required|max:100|min:0"
          label-message="独り言回数"
          max="100"
          min="0"
          step="1"
          :input-value.sync="monologueCount"
        />
        <form-number
          rules="required|max:200|min:0"
          label-message="独り言文字数"
          max="200"
          min="1"
          step="1"
          :input-value.sync="monologueLength"
          class="m-b-20"
        />
        <form-number
          rules="required|max:100|min:0"
          label-message="見学発言回数"
          max="100"
          min="0"
          step="1"
          :input-value.sync="spectateCount"
        />
        <form-number
          rules="required|max:200|min:0"
          label-message="見学発言文字数"
          max="200"
          min="1"
          step="1"
          :input-value.sync="spectateLength"
        />
        <hr />
        <h2 class="title is-6">参加パスワード</h2>
        <join-password :input-value.sync="joinPassword" />
        <hr />
        <b-field class="has-text-right">
          <b-button
            :disabled="confirming || invalid"
            size="is-small"
            @click="confirmVillage"
            type="is-primary"
            >確認画面へ</b-button
          >
        </b-field>
        <modal-confirm
          :param="registerParam"
          :charachip-name="charachipName"
          :dummy-chara-name="dummyCharaName"
          :is-open="isOpenConfirmModal"
          @close="isOpenConfirmModal = false"
          @create="createVillage"
        />
      </validation-observer>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
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
    formInput: () => import('~/components/common/validation/form-input.vue'),
    formNumber: () => import('~/components/common/validation/form-number.vue'),
    formSelect: () => import('~/components/common/validation/form-select.vue'),
    formSwitch: () => import('~/components/common/validation/form-switch.vue'),
    notification: () => import('~/components/create-village/notification.vue'),
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
export default class CreateVillage extends Vue {
  /** head */
  private head() {
    return { title: ' | 村作成' }
  }

  /** data */
  private confirming: boolean = false
  private charachips: FormOption[] = []
  private charas: Chara[] = []
  private skills: Skill[] = []
  private isOpenConfirmModal: boolean = false

  // form data ------------------------------------
  private villageName: string = ''
  // @ts-ignore
  private startDatetime: Date = this.$dayjs()
    .add(7, 'days') // 1週間後にしておく
    .startOf('days')
    .toDate()

  private siltntHours: string = '0'
  private charachipId: string = '1'
  private dummyCharaId: string = '1'
  private organization: string = '村'
  private availableDummySkill: boolean = false
  private openVote: boolean = false
  private availableSkillRequest: boolean = true
  private availableSpectate: boolean = false
  private openSkillInGrave: boolean = false
  private visibleGraveMessage: boolean = false
  private availableSuddelnyDeath: boolean = true
  private availableCommit: boolean = false

  private normalCount: string = '20'
  private normalLength: string = '200'
  private whisperCount: string = '40'
  private whisperLength: string = '200'
  private graveCount: string = '40'
  private graveLength: string = '200'
  private monologueCount: string = '100'
  private monologueLength: string = '200'
  private spectateCount: string = '40'
  private spectateLength: string = '200'

  private joinPassword: string = ''

  /** computed */
  private get charachipName(): string {
    const charachip = this.charachips.find(c => c.value === this.charachipId)
    return charachip ? charachip.label : ''
  }

  private get dummyCharaName(): string {
    const chara = this.charas.find(c => c.id.toString() === this.dummyCharaId)
    return chara ? chara.chara_name.name : ''
  }

  /** created */
  private created() {
    this.loadCharachips()
    this.loadCharas()
    this.loadSkills()
  }

  /** mounted */
  private mounted() {
    this.overrideGeneralOrg()
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

  private async loadCharas(): Promise<void> {
    const charachip: Charachip = await this.$axios.$get(
      `/charachip/${this.charachipId}`
    )
    this.charas = charachip.chara_list
    this.dummyCharaId = charachip.chara_list[0].id.toString()
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
    this.organization = this.$refs.org.createGeneralOrg()
  }

  private confirmVillage() {
    this.confirming = true
    this.$axios
      .$post('/village/confirm', this.registerParam)
      .then(res => {
        this.confirming = false
        this.isOpenConfirmModal = true
      })
      .catch(err => {
        toast.danger(this, 'エラーが発生しました。設定を確認してください。')
        console.log(err)
        this.confirming = false
      })
  }

  private createVillage() {
    this.$axios
      .$post('/village', this.registerParam)
      .then(res => {
        location.href = `/village?id=${res.village_id}`
      })
      .catch(err => {
        toast.danger(this, 'エラーが発生しました。設定を確認してください。')
        console.log(err)
      })
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
          silent_hours: this.siltntHours
        },
        organization: {
          organization
        },
        charachip: {
          dummy_chara_id: parseInt(this.dummyCharaId),
          charachip_id: parseInt(this.charachipId)
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

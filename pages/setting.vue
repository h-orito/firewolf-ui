<template>
  <section class="section">
    <div class="container has-text-left">
      <b-button
        :to="{ path: '/village', query: { id: villageId } }"
        tag="nuxt-link"
        size="is-small"
      >
        戻る
      </b-button>
      <h1 class="title is-5 m-t-40">村の設定を変更する</h1>
      <b-notification type="is-warning" :closable="false" class="is-size-7">
        <ul>
          <li>参加パスワードが毎回空になるのでご注意ください。</li>
        </ul>
      </b-notification>
      <setting
        ref="setting"
        :village-name.sync="villageName"
        :start-datetime.sync="startDatetime"
        :silent-hours.sync="silentHours"
        :charachip-ids.sync="charachipIds"
        :dummy-chara-id.sync="dummyCharaId"
        :dummy-chara-short-name.sync="dummyCharaShortName"
        :dummy-chara-name.sync="dummyCharaName"
        :day0-message.sync="day0Message"
        :day1-message.sync="day1Message"
        :organization.sync="organization"
        :available-dummy-skill.sync="availableDummySkill"
        :open-vote.sync="openVote"
        :available-skill-request.sync="availableSkillRequest"
        :available-spectate.sync="availableSpectate"
        :open-skill-in-grave.sync="openSkillInGrave"
        :visible-grave-message.sync="visibleGraveMessage"
        :available-suddelny-death.sync="availableSuddelnyDeath"
        :available-commit.sync="availableCommit"
        :available-action.sync="availableAction"
        :available-secret-say.sync="availableSecretSay"
        :available-guard-same-target.sync="availableGuardSameTarget"
        :age-limit.sync="ageLimit"
        :normal-count.sync="normalCount"
        :normal-length.sync="normalLength"
        :whisper-count.sync="whisperCount"
        :whisper-length.sync="whisperLength"
        :sympathize-count.sync="sympathizeCount"
        :sympathize-length.sync="sympathizeLength"
        :lovers-count.sync="loversCount"
        :lovers-length.sync="loversLength"
        :grave-count.sync="graveCount"
        :grave-length.sync="graveLength"
        :monologue-count.sync="monologueCount"
        :monologue-length.sync="monologueLength"
        :spectate-count.sync="spectateCount"
        :spectate-length.sync="spectateLength"
        :action-count.sync="actionCount"
        :action-length.sync="actionLength"
        :join-password.sync="joinPassword"
        save-label="設定を変更する"
        :modifiable-chara="false"
        @confirm="confirmSetting"
        @save="modifySetting"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import setting from '~/components/create-village/setting.vue'
import Village from '~/components/type/village'
import api from '~/components/village/village-api'
import { MESSAGE_TYPE } from '~/components/const/consts'

@Component({
  components: {
    setting
  },
  asyncData({ query }) {
    return { villageId: query.id }
  }
})
export default class VillageSetting extends Vue {
  /** head */
  private head() {
    return { title: ' | 村作成' }
  }

  /** data */
  private villageId: number = 0
  private village: Village | null = null

  // form data ------------------------------------
  private villageName: string = ''
  // @ts-ignore
  private startDatetime: Date = this.$dayjs()
    .add(7, 'days') // 1週間後にしておく
    .startOf('days')
    .toDate()

  private silentHours: string = '0'
  private charachipIds: Array<string> = ['1']
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
  private availableAction: boolean = false
  private availableSecretSay: boolean = false
  private availableGuardSameTarget: boolean = true
  private ageLimit: string = ''

  private normalCount: string = '20'
  private normalLength: string = '200'
  private whisperCount: string = '40'
  private whisperLength: string = '200'
  private sympathizeCount: string = '40'
  private sympathizeLength: string = '200'
  private loversCount: string = '40'
  private loversLength: string = '200'
  private graveCount: string = '40'
  private graveLength: string = '200'
  private monologueCount: string = '100'
  private monologueLength: string = '200'
  private spectateCount: string = '40'
  private spectateLength: string = '200'
  private actionCount: string = '40'
  private actionLength: string = '200'

  private joinPassword: string = ''

  private dummyCharaShortName: string = ''
  private dummyCharaName: string = ''
  private day0Message: string = ''
  private day1Message: string = ''

  /** computed */
  /** mounted */
  private async mounted(): Promise<void> {
    this.village = await api.fetchVillage(this, this.villageId)
    this.reset()
    // @ts-ignore
    this.$refs.setting.loadSkills()
    // @ts-ignore
    this.$refs.setting.overrideOrgMinMax(this.organization)
  }

  /** methods */
  private reset(): void {
    if (!this.village) return
    this.villageName = this.village.name

    const time = this.village.setting.time
    // @ts-ignore
    this.startDatetime = this.$dayjs(time.start_datetime).toDate()
    this.silentHours = time.silent_hours ? time.silent_hours.toString() : '0'

    const charachip = this.village.setting.charachip
    this.charachipIds = charachip.charachip_ids.map(id => id.toString())
    this.dummyCharaId = charachip.dummy_chara_id.toString()

    this.organization = Object.entries(
      this.village.setting.organizations.organization
    )
      .map(entry => `${entry[0]}人：${entry[1]}`)
      .join('\n')

    const rules = this.village.setting.rules
    this.availableDummySkill = rules.available_dummy_skill
    this.openVote = rules.open_vote
    this.availableSkillRequest = rules.available_skill_request
    this.availableSpectate = rules.available_spectate
    this.openSkillInGrave = rules.open_skill_in_grave
    this.visibleGraveMessage = rules.visible_grave_message
    this.availableSuddelnyDeath = rules.available_suddenly_death
    this.availableCommit = rules.available_commit
    this.availableAction = rules.available_action
    this.availableSecretSay = rules.available_secret_say
    this.availableGuardSameTarget = rules.available_guard_same_target

    const tagCodes = this.village.setting.tags.list
    this.ageLimit =
      tagCodes.length <= 0 ? '' : tagCodes.find(t => t.startsWith('R')) ?? ''

    const restricts = rules.message_restrict.restrict_list
    const normal = restricts.find(r => r.type.code === MESSAGE_TYPE.NORMAL_SAY)!
    this.normalCount = normal.count.toString()
    this.normalLength = normal.length.toString()
    const whisper = restricts.find(
      r => r.type.code === MESSAGE_TYPE.WEREWOLF_SAY
    )!
    this.whisperCount = whisper.count.toString()
    this.whisperLength = whisper.length.toString()
    const sympathize = restricts.find(
      r => r.type.code === MESSAGE_TYPE.SYMPATHIZE_SAY
    )!
    this.sympathizeCount = sympathize.count.toString()
    this.sympathizeLength = sympathize.length.toString()
    const lovers = restricts.find(r => r.type.code === MESSAGE_TYPE.LOVERS_SAY)!
    this.loversCount = lovers.count.toString()
    this.loversLength = lovers.length.toString()
    const grave = restricts.find(r => r.type.code === MESSAGE_TYPE.GRAVE_SAY)!
    this.graveCount = grave.count.toString()
    this.graveLength = grave.length.toString()
    const monologue = restricts.find(
      r => r.type.code === MESSAGE_TYPE.MONOLOGUE_SAY
    )!
    this.monologueCount = monologue.count.toString()
    this.monologueLength = monologue.length.toString()
    const spectate = restricts.find(
      r => r.type.code === MESSAGE_TYPE.SPECTATE_SAY
    )!
    this.spectateCount = spectate.count.toString()
    this.spectateLength = spectate.length.toString()
    const action = restricts.find(r => r.type.code === MESSAGE_TYPE.ACTION)!
    this.actionCount = action.count.toString()
    this.actionLength = action.length.toString()

    this.joinPassword = ''

    const dummy = this.village.participant.member_list.find(
      p => p.chara.id === parseInt(this.dummyCharaId)
    )!
    this.dummyCharaShortName = dummy.chara_name.short_name
    this.dummyCharaName = dummy.chara_name.name
    this.day0Message =
      this.village.setting.charachip.dummy_chara_day0_message || ''
    this.day1Message =
      this.village.setting.charachip.dummy_chara_day1_message || ''
  }

  private async confirmSetting({ param, errCb, successCb }): Promise<void> {
    try {
      await this.$axios.$post(
        `/village/${this.villageId}/setting/confirm`,
        param
      )
      successCb()
    } catch (error) {
      errCb(error)
    }
  }

  private async modifySetting({ param, errCb }): Promise<void> {
    try {
      const res = await this.$axios.$post(
        `/village/${this.villageId}/setting`,
        param
      )
      location.href = `/village?id=${this.villageId}`
    } catch (err) {
      errCb(err)
    }
  }
}
</script>

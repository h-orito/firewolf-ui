<template>
  <section class="section">
    <div class="container has-text-left">
      <h1 class="title is-5 m-t-40">村を作成</h1>
      <setting
        ref="setting"
        :village-name.sync="villageName"
        :start-datetime.sync="startDatetime"
        :silent-hours.sync="silentHours"
        :charachip-id.sync="charachipId"
        :dummy-chara-id.sync="dummyCharaId"
        :organization.sync="organization"
        :available-dummy-skill.sync="availableDummySkill"
        :open-vote.sync="openVote"
        :available-skill-request.sync="availableSkillRequest"
        :available-spectate.sync="availableSpectate"
        :open-skill-in-grave.sync="openSkillInGrave"
        :visible-grave-message.sync="visibleGraveMessage"
        :available-suddelny-death.sync="availableSuddelnyDeath"
        :available-commit.sync="availableCommit"
        :normal-count.sync="normalCount"
        :normal-length.sync="normalLength"
        :whisper-count.sync="whisperCount"
        :whisper-length.sync="whisperLength"
        :grave-count.sync="graveCount"
        :grave-length.sync="graveLength"
        :monologue-count.sync="monologueCount"
        :monologue-length.sync="monologueLength"
        :spectate-count.sync="spectateCount"
        :spectate-length.sync="spectateLength"
        :join-password.sync="joinPassword"
        @confirm="confirmVillage"
        @save="createVillage"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import setting from '~/components/create-village/setting.vue'

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
import toast from '~/components/village/village-toast'

@Component({
  components: {
    setting
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

  private silentHours: string = '0'
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

  /** mounted */
  private mounted() {
    // @ts-ignore
    this.$refs.setting.loadCharachips()
    // @ts-ignore
    this.$refs.setting.loadCharas()
    // @ts-ignore
    this.$refs.setting.loadSkills()
    // @ts-ignore
    this.$refs.setting.overrideGeneralOrg()
  }

  /** methods */
  private async confirmVillage({ param, errCb, successCb }): Promise<void> {
    try {
      await this.$axios.$post('/village/confirm', param)
      successCb()
    } catch (error) {
      errCb(error)
    }
  }

  private async createVillage({ param, errCb }): Promise<void> {
    try {
      const res = await this.$axios.$post('/village', param)
      location.href = `/village?id=${res.village_id}`
    } catch (err) {
      errCb(err)
    }
  }
}
</script>

<style lang="scss"></style>

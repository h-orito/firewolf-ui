<template>
  <div>
    <action-card title="入村" :id="id" :is-open="isOpen" :exists-footer="false">
      <template v-slot:content>
        <div class="content has-text-left">
          <p style="font-weight: 700; margin-bottom: 6px;">キャラ</p>
          <b-field>
            <b-select
              v-model="charaId"
              @input="changeChara($event)"
              expanded
              size="is-small"
            >
              <option
                v-for="chara in situation.participate.selectable_chara_list"
                :value="chara.id.toString()"
                :key="chara.id.toString()"
                >{{ chara.chara_name.name }}</option
              >
            </b-select>
            <p class="control">
              <button class="button is-primary is-small" @click="openModal">
                画像で選択
              </button>
              <b-modal
                :active.sync="isCharaSelectModalOpen"
                has-modal-card
                trap-focus
                aria-role="dialog"
                aria-modal
              >
                <chara-select-modal
                  :chara-list="situation.participate.selectable_chara_list"
                  @chara-select="charaSelect($event)"
                />
              </b-modal>
            </p>
          </b-field>
          <b-field label="キャラ名" :horizontal="false" custom-class="is-small">
            <b-input
              v-model="charaName"
              size="is-small"
              type="text"
              :maxlength="40"
              :disabled="charaId == null"
              expanded
            ></b-input>
          </b-field>
          <b-field
            label="キャラ名1文字略称"
            :horizontal="false"
            custom-class="is-small"
          >
            <b-input
              v-model="charaShortName"
              size="is-small"
              type="text"
              :maxlength="1"
              :disabled="charaId == null"
              expanded
            ></b-input>
          </b-field>
          <b-field
            v-if="situation.skill_request.available_skill_request"
            label="役職第1希望"
            custom-class="is-small"
          >
            <b-select v-model="firstRequestSkillCode" expanded size="is-small">
              <option
                v-for="skill in situation.skill_request.selectable_skill_list"
                :value="skill.code"
                :key="skill.code"
                >{{ skill.name }}</option
              >
            </b-select>
          </b-field>
          <b-field
            v-if="situation.skill_request.available_skill_request"
            custom-class="is-small"
            label="役職第2希望"
          >
            <b-select v-model="secondRequestSkillCode" expanded size="is-small">
              <option
                v-for="skill in situation.skill_request.selectable_skill_list"
                :value="skill.code"
                :key="skill.code"
                >{{ skill.name }}</option
              >
            </b-select>
          </b-field>
          <p style="font-weight: 700; margin-bottom: 6px;">入村発言</p>
          <message-decorators
            selector="#participate-message-input"
            @decorate-message="message = $event"
          />
          <b-field custom-class="is-small" label="">
            <message-input
              id="participate-message-input"
              v-model="message"
              :situation="situation.say"
              :message-type="normalSay"
              ref="messageInput"
            />
          </b-field>
          <b-field
            custom-class="is-small"
            label="入村パスワード"
            v-if="requiredJoinPassword"
          >
            <b-input v-model="joinPassword" type="text" size="is-small" />
          </b-field>
        </div>
        <div class="action-button-area">
          <b-button
            :disabled="!canSubmit || confirming"
            @click="confirmParticipate"
            type="is-primary"
            size="is-small"
            expanded
            >入村確認</b-button
          >
        </div>
      </template>
    </action-card>
    <modal-participate
      :is-open="isParticipateModalOpen"
      :confirm-message="confirmMessage"
      @close="closeParticipateModal"
      @participate="participate"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import messageInput from '~/components/village/action/message-input.vue'
import charaSelectModal from '~/components/village/action/participate/chara-select-modal.vue'
import actionCard from '~/components/village/action/action-card.vue'
// type
import Village from '~/components/type/village'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import Message from '~/components/type/message'
import { MESSAGE_TYPE } from '~/components/const/consts'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'
const modalParticipate = () =>
  import('~/components/village/action/participate/modal-participate.vue')
const messageDecorators = () =>
  import('~/components/village/action/decorator/message-decorators.vue')
const formInput = () => import('~/components/common/validation/form-input.vue')

@Component({
  components: {
    actionCard,
    messageInput,
    charaSelectModal,
    modalParticipate,
    messageDecorators,
    formInput
  }
})
export default class Participate extends Vue {
  private confirming: boolean = false

  private charaId: number | null = null
  private charaName: string = ''
  private charaShortName: string = ''
  private firstRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? 'LEFTOVER'
      : this.situation.skill_request.skill_request.first.code

  private secondRequestSkillCode: string | null =
    this.situation.skill_request.skill_request == null
      ? 'LEFTOVER'
      : this.situation.skill_request.skill_request.second.code

  private message: string = ''
  private joinPassword: string = ''

  private isCharaSelectModalOpen = false
  private isParticipateModalOpen = false

  /** 入村確認 */
  private confirmMessage: Message | null = null

  private id: string = 'participate-aria-id'
  private isOpen: boolean =
    villageUserSettings.getActionWindow(this).open_map![this.id] == null
      ? true
      : villageUserSettings.getActionWindow(this).open_map![this.id]

  private get village(): Village {
    return this.$store.getters.getVillage!
  }

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private get normalSay(): string {
    return MESSAGE_TYPE.NORMAL_SAY
  }

  private get requiredJoinPassword(): boolean {
    return this.village.setting.password.join_password_required
  }

  // 参加ボタンを押下できるか
  private get canSubmit(): boolean {
    return (
      this.charaId != null &&
      this.charaName.length > 0 &&
      this.charaName.length <= 40 &&
      this.charaShortName.length === 1 &&
      this.firstRequestSkillCode != null &&
      this.secondRequestSkillCode != null &&
      this.message != null &&
      this.message.length > 0 &&
      !this.isOver
    )
  }

  private get isOver(): boolean {
    return (this.$refs as any).messageInput.existsOver
  }

  private async confirmParticipate(): Promise<void> {
    this.confirming = true
    try {
      this.confirmMessage = await api.postConfirmParticipate(
        this,
        this.village.id,
        this.charaId!,
        this.charaName!,
        this.charaShortName!,
        this.firstRequestSkillCode!,
        this.secondRequestSkillCode!,
        this.message,
        this.joinPassword,
        false
      )
      this.isParticipateModalOpen = true
    } catch (error) {
      // @ts-ignore
      const code = parseInt(error.response && error.response.status)
      // @ts-ignore
      if (code === 404 && error.response.data.status === 499) {
        // @ts-ignore
        toast.danger(this, error.response.data.message)
      }
    }
    this.confirming = false
  }

  private async participate(): Promise<void> {
    try {
      await api.postParticipate(
        this,
        this.village.id,
        this.charaId!,
        this.charaName!,
        this.charaShortName!,
        this.firstRequestSkillCode!,
        this.secondRequestSkillCode!,
        this.message,
        this.joinPassword,
        false
      )
    } catch (error) {}
    this.$emit('reload')
  }

  private closeParticipateModal(): void {
    this.isParticipateModalOpen = false
  }

  private openModal(): void {
    this.isCharaSelectModalOpen = true
  }

  private charaSelect({ chara }): void {
    this.charaId = chara.id
    this.isCharaSelectModalOpen = false
    this.charaName = chara.chara_name.name
    this.charaShortName = chara.chara_name.short_name
  }

  private changeChara(charaId: string): void {
    const chara = this.situation.participate.selectable_chara_list.find(
      c => c.id === parseInt(charaId)
    )
    this.charaSelect({ chara })
  }
}
</script>

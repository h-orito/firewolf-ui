<template>
  <div>
    <div class="content has-text-left">
      <p style="font-weight: 700; margin-bottom: 6px;">キャラ</p>
      <b-field>
        <b-select v-model="charaId" expanded size="is-small">
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
      <b-field custom-class="is-small" label="入村発言">
        <message-input
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
        <b-input v-model="joinPassword" type="password" size="is-small" />
      </b-field>
    </div>
    <b-button
      :disabled="!canSubmit || confirming"
      @click="confirmParticipate"
      type="is-primary"
      size="is-small"
      expanded
      >入村確認</b-button
    >
    <modal-participate
      :is-open="isParticipateModalOpen"
      :confirm-message="confirmMessage"
      :village="village"
      @close="closeParticipateModal"
      @participate="participate"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageInput from '~/components/village/action/message-input.vue'
import charaSelectModal from '~/components/village/action/participate/chara-select-modal.vue'
// type
import Village from '~/components/type/village'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import Message from '~/components/type/message'
import { MESSAGE_TYPE } from '~/components/const/consts'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
const modalParticipate = () =>
  import('~/components/village/action/participate/modal-participate.vue')

@Component({
  components: { messageInput, charaSelectModal, modalParticipate }
})
export default class Spectate extends Vue {
  private confirming: boolean = false

  private charaId: number | null = null
  private message: string = ''
  private joinPassword: string = ''

  private isCharaSelectModalOpen = false
  private isParticipateModalOpen = false

  /** 入村確認 */
  private confirmMessage: Message | null = null

  private get village(): Village {
    return this.$store.getters.getVillage!
  }

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private get normalSay(): string {
    return MESSAGE_TYPE.SPECTATE_SAY
  }

  private get requiredJoinPassword(): boolean {
    return this.village.setting.password.join_password_required
  }

  // 参加ボタンを押下できるか
  private get canSubmit(): boolean {
    return (
      this.charaId != null &&
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
        'LEFTOVER',
        'LEFTOVER',
        this.message,
        this.joinPassword,
        true
      )
      this.isParticipateModalOpen = true
    } catch (error) {
      const code = parseInt(error.response && error.response.status)
      if (code === 404 && error.response.data.status === 499) {
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
        'LEFTOVER',
        'LEFTOVER',
        this.message,
        this.joinPassword,
        true
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

  private charaSelect({ charaId }): void {
    this.charaId = charaId
    this.isCharaSelectModalOpen = false
  }
}
</script>

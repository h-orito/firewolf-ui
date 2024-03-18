<template>
  <div>
    <action-card
      :class="isFixed ? 'fixed' : ''"
      title="発言"
      :id="id"
      :is-open="isOpen"
      :exists-footer="false"
    >
      <template v-slot:content>
        <div class="content has-text-right m-b-5">
          <a href="javascript: void(0);" @click="toggleFixed">{{
            isFixed ? '固定解除' : '固定表示'
          }}</a>
        </div>
        <div class="content has-text-left m-b-5">
          <div class="myself-area">
            <notification v-if="!isAlive" type="info" class="m-b-5">
              あなたは死亡しました。
            </notification>
            <notification v-if="myself.skill" type="default" class="m-b-5">
              <span style="white-space: pre-line;">{{ skillDescription }}</span>
            </notification>
            <div class="myself-name-area">
              <p class="myself-name">{{ charaName }}</p>
            </div>
          </div>
          <div
            class="say-area"
            :class="$store.getters.isDarkTheme ? 'dark-theme' : ''"
          >
            <b-field class="m-b-5">
              <b-radio-button
                v-for="messageTypeSituation in selectableMessageTypes"
                :key="messageTypeSituation.message_type.code"
                v-model="messageType"
                :native-value="messageTypeSituation.message_type.code"
                type="is-primary"
                size="is-small"
                @input="setDefaultFaceType()"
              >
                <span>{{ messageTypeSituation.message_type.name }}</span>
              </b-radio-button>
            </b-field>
            <div
              class="secretsay-target-area m-b-5"
              v-if="isDispSecretsayTargetArea"
            >
              秘話相手
              <b-select v-model="targetParticipantId" expanded size="is-small">
                <option
                  v-for="participant in secretsayTargets"
                  :value="participant.id.toString()"
                  :key="participant.id.toString()"
                  >{{ participant.chara.chara_name.full_name }}</option
                >
              </b-select>
              <p class="control">
                <button
                  class="button is-primary is-small"
                  @click="openParticipantSelectModal"
                >
                  画像で選択
                </button>
              </p>
            </div>
            <message-decorators
              selector="#say-message-input"
              @decorate-message="message = $event"
            />
            <div class="say-content-area">
              <div class="say-face-area">
                <div @click="openFaceModal">
                  <chara-image :chara="chara" :face-type="faceTypeCode" />
                </div>
              </div>
              <div class="say-input-area">
                <message-input
                  id="say-message-input"
                  v-model="message"
                  :message-type="messageType"
                  :situation="situation.say"
                  ref="messageInput"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="action-button-area">
          <b-button
            :disabled="!canSay"
            @click="sayConfirm"
            type="is-primary"
            size="is-small"
            expanded
          >
            発言する
          </b-button>
        </div>
        <div v-if="replyMessage" class="reply-message-area">
          <message-card
            :key="replyMessage.id"
            :message="replyMessage"
            :is-progress="false"
            :is-anchor-message="false"
            :is-dark-theme="$store.getters.isDarkTheme"
            :is-disp-date="
              $store.getters.getVillageUserSettings.message_display.is_disp_date
            "
            :is-img-large="
              $store.getters.getVillageUserSettings.message_display.is_img_large
            "
            @click-anchor="() => {}"
            @paste-message-input="() => {}"
          ></message-card>
        </div>
      </template>
    </action-card>
    <modal-say
      :is-open="isSayModalOpen"
      :confirm-message="confirmMessage"
      @close="closeSayModal"
      @say="say"
    />
    <face-select-modal
      :is-open="isFaceModalOpen"
      :chara="chara"
      :face-list="selectableFaceType"
      @face-select="selectedFaceType($event)"
      @close="closeFaceModal"
    />
    <b-modal
      v-if="isDispSecretsayTargetArea"
      :active.sync="isParticipantSelectModalOpen"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <participant-select-modal
        :participant-list="secretsayTargets"
        @participant-select="participantSelect($event)"
      />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import messageInput from '~/components/village/action/message-input.vue'
// type
import SituationAsParticipant from '~/components/type/situation-as-participant'
import VillageSayMessageTypeSituation from '~/components/type/village-say-message-type-situation'
import VillageParticipant from '~/components/type/village-participant'
import Message from '~/components/type/message'
import Chara from '~/components/type/chara'
import { FACE_TYPE, MESSAGE_TYPE } from '~/components/const/consts'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'
import CharaFace from '~/components/type/chara-face'
import VillageAnchorMessage from '~/components/type/village-anchor-message'
const modalSay = () => import('~/components/village/action/say/modal-say.vue')
const charaImage = () => import('~/components/village/chara-image.vue')
const faceSelectModal = () =>
  import('~/components/village/action/say/face-select-modal.vue')
const participantSelectModal = () =>
  import('~/components/village/action/say/participant-select-modal.vue')
const notification = () =>
  import('~/components/village/village-notification.vue')
const messageDecorators = () =>
  import('~/components/village/action/decorator/message-decorators.vue')
const messageCard = () =>
  import('~/components/village/message/message-card.vue')

@Component({
  components: {
    actionCard,
    messageInput,
    modalSay,
    charaImage,
    faceSelectModal,
    participantSelectModal,
    notification,
    messageDecorators,
    messageCard
  }
})
export default class Say extends Vue {
  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  private messageTypeFaceTypeMap: Map<string, string> = new Map([
    [MESSAGE_TYPE.NORMAL_SAY, FACE_TYPE.NORMAL],
    [MESSAGE_TYPE.WEREWOLF_SAY, FACE_TYPE.WEREWOLF],
    [MESSAGE_TYPE.SPECTATE_SAY, FACE_TYPE.NORMAL],
    [MESSAGE_TYPE.SECRET_SAY, FACE_TYPE.SECRET],
    [MESSAGE_TYPE.MONOLOGUE_SAY, FACE_TYPE.MONOLOGUE],
    [MESSAGE_TYPE.GRAVE_SAY, FACE_TYPE.GRAVE]
  ])

  private messageType: string = this.situation.say.default_message_type!.code
  private faceTypeCode: string = FACE_TYPE.NORMAL

  private message: string = ''
  private isSayModalOpen: boolean = false
  private isFaceModalOpen: boolean = false
  private isParticipantSelectModalOpen: boolean = false
  private isFixed: boolean = villageUserSettings.getActionWindow(this).is_fixed!
  private id: string = 'say-aria-id'
  private isOpen: boolean =
    villageUserSettings.getActionWindow(this).open_map![this.id] == null
      ? true
      : villageUserSettings.getActionWindow(this).open_map![this.id]

  private targetParticipantId: number | null = null

  // 発言確認で返ってきた発言内容
  private confirmMessage: Message | null = null

  // 返信する場合の参照用
  private replyMessage: Message | null = null

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get villageId(): number {
    return this.$store.getters.getVillageId!
  }

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private get myself(): VillageParticipant {
    return this.situation.participate.myself!
  }

  private get isAlive(): boolean {
    return this.myself.dead == null
  }

  private get charaName(): string {
    const name = this.myself.chara.chara_name.full_name
    if (this.myself.skill) {
      return `${name} （${this.myself.skill!.name}）`
    } else {
      return name
    }
  }

  private get skillDescription(): string {
    return this.myself.skill!.description.replaceAll('。', '。\n')
  }

  private get selectableFaceType(): Array<CharaFace> {
    return this.situation.participate.myself!.chara.face_list
  }

  private get chara(): Chara {
    return this.situation.participate.myself!.chara
  }

  private get selectableMessageTypes(): VillageSayMessageTypeSituation[] {
    return this.situation.say.selectable_message_type_list.filter(m => {
      return m.message_type.code !== MESSAGE_TYPE.ACTION
    })
  }

  private get isDispSecretsayTargetArea(): boolean {
    return this.messageType === MESSAGE_TYPE.SECRET_SAY
  }

  private get secretsayTargets(): VillageParticipant[] {
    return this.situation.say.selectable_message_type_list.find(m => {
      return m.message_type.code === MESSAGE_TYPE.SECRET_SAY
    })!!.target_list
  }

  private get canSay(): boolean {
    if (this.message == null || this.message.trim() === '') return false
    if (this.messageType == null) return false
    if (this.isOver) return false
    if (
      this.messageType === MESSAGE_TYPE.SECRET_SAY &&
      this.targetParticipantId == null
    )
      return false
    return true
  }

  private get isOver(): boolean {
    // veturがrefsで定義した子コンポーネントのプロパティを認識できないので回避
    return (this.$refs as any).messageInput.existsOver
  }

  private get isInputting(): boolean {
    return (this.$refs as any).messageInput.isInputting
  }

  // ----------------------------------------------------------------
  // method
  // ----------------------------------------------------------------
  private created(): void {
    this.reloadStyle()
  }

  private async sayConfirm(): Promise<void> {
    try {
      this.confirmMessage = await api.postConfirmSay(
        this,
        this.villageId,
        this.message,
        this.messageType,
        this.faceTypeCode,
        this.messageType === MESSAGE_TYPE.SECRET_SAY
          ? this.targetParticipantId
          : null
      )
      this.isSayModalOpen = true
    } catch (error) {
      toast.danger(this, '発言確認失敗しました。')
    }
  }

  private async say(): Promise<void> {
    try {
      await api.postSay(
        this,
        this.villageId,
        this.message,
        this.messageType,
        this.faceTypeCode,
        this.messageType === MESSAGE_TYPE.SECRET_SAY
          ? this.targetParticipantId
          : null
      )
      this.message = ''
      this.replyMessage = null
    } catch (error) {
      toast.danger(this, '発言失敗しました。')
    }
    await this.$emit('reload')
  }

  private closeSayModal(): void {
    this.isSayModalOpen = false
  }

  private pasteToMessageInput(text: string): void {
    this.message += text
  }

  private reply(anchorString: string, message: Message): void {
    this.message += anchorString
    this.replyMessage = message
    const element = document.getElementById(this.id)
    if (element == null) return
    this.$scrollTo(element, {
      container: '.village-article-wrapper'
    })
  }

  private secret(message: Message, participantId: number): void {
    this.replyMessage = message
    this.messageType = MESSAGE_TYPE.SECRET_SAY
    this.targetParticipantId = participantId

    const element = document.getElementById(this.id)
    if (element == null) return
    this.$scrollTo(element, {
      container: '.village-article-wrapper'
    })
  }

  private toggleFixed(): void {
    this.isFixed = !this.isFixed
    const cookie = villageUserSettings.getActionWindow(this)
    cookie.is_fixed = this.isFixed
    villageUserSettings.setActionWindow(this, cookie)
    this.reloadStyle()
  }

  private reloadStyle(): void {
    const cookie = villageUserSettings.getActionWindow(this)
    let paddingBottom = '0'
    if (!cookie.is_fixed) {
      paddingBottom = '0'
    } else if (cookie.open_map![this.id] != null || cookie.open_map![this.id]) {
      paddingBottom = '30vh'
    } else {
      paddingBottom = '48px'
    }
    this.$emit('fixed', {
      paddingBottom
    })
  }

  private defaultFaceTypeCode(messageType: string): string {
    const expectedFaceType = this.messageTypeFaceTypeMap.get(messageType)
    if (expectedFaceType == null) return FACE_TYPE.NORMAL
    if (
      this.situation.participate.myself!.chara.face_list.some(
        face => face.type === expectedFaceType
      )
    ) {
      return expectedFaceType
    }
    return FACE_TYPE.NORMAL
  }

  private setDefaultFaceType(): void {
    this.faceTypeCode = this.defaultFaceTypeCode(this.messageType)
  }

  private openFaceModal(): void {
    this.isFaceModalOpen = true
  }

  private closeFaceModal(): void {
    this.isFaceModalOpen = false
  }

  private selectedFaceType({ type }: { type: string }): void {
    this.faceTypeCode = type
    this.closeFaceModal()
  }

  private openParticipantSelectModal(): void {
    this.isParticipantSelectModalOpen = true
  }

  private closeParticipantSelectModal(): void {
    this.isParticipantSelectModalOpen = false
  }

  private participantSelect({
    participantId
  }: {
    participantId: number
  }): void {
    this.targetParticipantId = participantId
    this.closeParticipantSelectModal()
  }

  mounted() {
    this.faceTypeCode = this.defaultFaceTypeCode(this.messageType)
  }
}
</script>

<style lang="scss" scoped>
.say-area {
  .say-content-area {
    display: flex;

    .say-face-area {
      padding-right: 5px;
    }

    .say-input-area {
      flex: 1;
    }
  }
}
.reply-message-area {
  padding: 10px;
  margin-top: 10px;
  border: 1px solid $primary;
}
</style>

<style lang="scss">
.myself-area {
  .myself-name-area {
    padding-bottom: 5px;
    display: flex;

    .myself-name {
      flex: 1;
      text-align: left;
      font-weight: bold;
    }
  }
}
.say-area {
  .say-content-area {
    display: flex;

    .say-face-area {
      padding-right: 5px;

      img {
        cursor: pointer;
      }
    }

    .say-input-area {
      flex: 1;
    }
  }
}
.dark-theme {
  .b-radio.button {
    border: 1px solid $primary-dark;
    background-color: transparent;
    color: $primary-dark;

    &.is-primary {
      background-color: $primary-dark;
      color: $white;
    }
  }
}
</style>

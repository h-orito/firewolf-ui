<template>
  <div :id="`mc-${message.time.unix_time_milli}`">
    <div class="card" :class="isDarkTheme ? 'dark-theme' : ''">
      <message-say
        v-if="isSayType"
        :message="sayMessage"
        :is-dark-theme="isDarkTheme"
        :is-disp-date="isDispDate"
        :is-img-large="isImgLarge"
        @click-anchor="clickAnchorMessage($event)"
        @copy-anchor-string="handleCopyAnchorString"
        @reply="prepareReply"
        @secret="prepareSecret"
      />
      <message-system
        v-if="isSystemType"
        :message="systemMessage"
        :is-dark-theme="isDarkTheme"
        @click-anchor="clickAnchorMessage($event)"
      />
      <message-action
        v-if="isActionType"
        :message="actionMessage"
        :is-dark-theme="isDarkTheme"
        :is-disp-date="isDispDate"
        :is-img-large="isImgLarge"
        @click-anchor="clickAnchorMessage($event)"
        @copy-anchor-string="handleCopyAnchorString"
      />
      <!-- アンカーメッセージ -->
      <message-card
        v-for="mes in anchorMessages"
        :key="mes.id"
        :message="mes"
        :is-progress="isProgress"
        :is-anchor-message="true"
        :is-dark-theme="isDarkTheme"
        :is-disp-date="isDispDate"
        :is-img-large="isImgLarge"
        @click-anchor="clickAnchorMessage($event)"
        @paste-message-input="$emit('paste-message-input', $event)"
      ></message-card>
      <message-participant-list
        v-if="message.content.type.code === 'PARTICIPANTS'"
      />
    </div>
    <div v-if="index == 19 || index == 39">
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      ></script>
      <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-format="fluid"
        data-ad-layout-key="-hm-c+2i-1u-38"
        data-ad-client="ca-pub-0917187897820609"
        data-ad-slot="5122687444"
      ></ins>
      <script>
        ;(adsbygoogle = window.adsbygoogle || []).push({})
      </script>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageSay from '~/components/village/message/message-say.vue'
import messageAction from '~/components/village/message/message-action.vue'
import messageSystem from '~/components/village/message/message-system.vue'
import messageCard from '~/components/village/message/message-card.vue'
// type
import Message from '~/components/type/message'
import VillageAnchorMessage from '~/components/type/village-anchor-message'
import { MESSAGE_TYPE } from '~/components/const/consts'
import {
  convertToSayMessage,
  convertToActionMessage,
  convertToSystemMessage,
  getAnchorType,
  getAnchorNum,
  SayMessage,
  ActionMessage,
  SystemMessage
} from '~/components/village/message/message-converter'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'
const messageParticipantList = () =>
  import('~/components/village/message/message-participant-list.vue')

@Component({
  name: 'message-card',
  components: {
    messageSay,
    messageAction,
    messageSystem,
    messageCard,
    messageParticipantList
  }
})
export default class MessageCard extends Vue {
  @Prop({ type: Object })
  private message!: Message

  @Prop({ type: Boolean })
  private isProgress!: boolean

  @Prop({ type: Boolean, default: false })
  private isAnchorMessage?: boolean

  @Prop({ type: Number, default: null })
  private index?: number

  @Prop({ type: Boolean })
  private isDarkTheme!: boolean

  @Prop({ type: Boolean })
  private isDispDate!: boolean

  @Prop({ type: Boolean })
  private isImgLarge!: boolean

  @Prop({ type: Boolean, default: false })
  private canReply?: boolean

  @Prop({ type: Boolean, default: false })
  private canSecret?: boolean

  private anchorMessages: Message[] = []

  private get maxCount(): number | null {
    if (!this.$store.getters.getRestrictCountMap) return null
    return (
      this.$store.getters.getRestrictCountMap.get(
        this.message.content.type.code
      ) || null
    )
  }

  private get sayMessage(): SayMessage | null {
    if (!this.isSayType) return null
    return convertToSayMessage(
      this.message,
      this.isAnchorMessage || false,
      this.isProgress,
      this.maxCount!,
      this.isDispDate,
      this.canReply || false,
      this.canSecret || false
    )
  }

  private get actionMessage(): ActionMessage | null {
    if (!this.isActionType) return null
    return convertToActionMessage(
      this.message,
      this.isAnchorMessage || false,
      this.isProgress,
      this.isDispDate
    )
  }

  private get systemMessage(): SystemMessage | null {
    if (!this.isSystemType) return null
    return convertToSystemMessage(this.message)
  }

  private get isSayType(): boolean {
    const type = messageTypeMap.get(this.message.content.type.code)
    return type === 'say'
  }

  private get isActionType(): boolean {
    const type = messageTypeMap.get(this.message.content.type.code)
    return type === 'action'
  }

  private get isSystemType(): boolean {
    const type = messageTypeMap.get(this.message.content.type.code)
    return type === 'system'
  }

  private handleCopyAnchorString(): void {
    const text: string = this.isSayType
      ? this.sayMessage!.anchor_copy_string
      : this.actionMessage!.anchor_copy_string
    const isPaste: boolean = villageUserSettings.getOperation(this)
      .is_paste_anchor
    if (isPaste) {
      this.$emit('paste-message-input', {
        text
      })
      return
    }
    // @ts-ignore
    this.$copyText(text)
    this.$buefy.toast.open({
      message: `クリップボードにコピーしました: ${text}`,
      type: 'is-info',
      position: 'is-top'
    })
  }

  private async clickAnchorMessage(anchorString: string): Promise<void> {
    const typeCode: string = getAnchorType(anchorString) || ''
    const number: number = getAnchorNum(anchorString)
    if (this.anchorMessages.some(mes => isSameMessage(mes, typeCode, number))) {
      this.anchorMessages = this.anchorMessages.filter(
        mes => !isSameMessage(mes, typeCode, number)
      )
      return
    }
    const anchorMessage: VillageAnchorMessage | null = await this.loadAnchorMessage(
      typeCode,
      number
    )
    if (anchorMessage?.message == null) return
    this.anchorMessages.unshift(anchorMessage.message)
  }

  private prepareReply(): void {
    const text: string = this.isSayType
      ? this.sayMessage!.anchor_copy_string
      : this.actionMessage!.anchor_copy_string
    this.$emit('reply', { text, message: this.message })
  }

  private prepareSecret(): void {
    this.$emit('secret', {
      message: this.message,
      participantId: this.message.from!.id
    })
  }

  private async loadAnchorMessage(
    typeCode: string,
    number: number
  ): Promise<VillageAnchorMessage | null> {
    try {
      return await this.$axios.$get(
        `/village/${this.$store.getters
          .getVillageId!}/message/type/${typeCode}/number/${number}`
      )
    } catch (error) {
      return null
    }
  }

  private clearAnchorMessages(): void {
    this.anchorMessages = []
  }

  private removeFunctions: any[] = []
  private mounted() {
    this.$nextTick(function() {
      document
        .querySelectorAll(`#mc-${this.message.time.unix_time_milli} a.anchor`)
        .forEach((el: Element) => {
          const element = el as HTMLElement
          const event = () => {
            this.clickAnchorMessage(element.textContent!)
          }
          element.addEventListener('click', event)
          this.removeFunctions.push(() => {
            element.removeEventListener('click', event)
          })
        })
    })
  }

  private beforeDestroy() {
    this.removeFunctions.forEach(f => f())
  }
}

const isSameMessage = (
  message: Message,
  typeCode: string,
  num: number
): boolean => {
  return message.content.type.code === typeCode && message.content.num === num
}
const messageTypeMap = new Map<string, string>([
  [MESSAGE_TYPE.NORMAL_SAY, 'say'],
  [MESSAGE_TYPE.WEREWOLF_SAY, 'say'],
  [MESSAGE_TYPE.GRAVE_SAY, 'say'],
  [MESSAGE_TYPE.MONOLOGUE_SAY, 'say'],
  [MESSAGE_TYPE.SYMPATHIZE_SAY, 'say'],
  [MESSAGE_TYPE.LOVERS_SAY, 'say'],
  [MESSAGE_TYPE.SPECTATE_SAY, 'say'],
  [MESSAGE_TYPE.SECRET_SAY, 'say'],
  [MESSAGE_TYPE.PUBLIC_SYSTEM, 'system'],
  [MESSAGE_TYPE.PRIVATE_SYSTEM, 'system'],
  [MESSAGE_TYPE.PRIVATE_SEER, 'system'],
  [MESSAGE_TYPE.PRIVATE_WISE, 'system'],
  [MESSAGE_TYPE.PRIVATE_PSYCHIC, 'system'],
  [MESSAGE_TYPE.PRIVATE_GURU, 'system'],
  [MESSAGE_TYPE.PRIVATE_CORONER, 'system'],
  [MESSAGE_TYPE.PRIVATE_WEREWOLF, 'system'],
  [MESSAGE_TYPE.PRIVATE_FANATIC, 'system'],
  [MESSAGE_TYPE.PRIVATE_MASON, 'system'],
  [MESSAGE_TYPE.PRIVATE_FOX, 'system'],
  [MESSAGE_TYPE.PRIVATE_SYMPATHIZER, 'system'],
  [MESSAGE_TYPE.PRIVATE_LOVERS, 'system'],
  [MESSAGE_TYPE.PRIVATE_ABILITY, 'system'],
  [MESSAGE_TYPE.CREATOR_SAY, 'system'],
  [MESSAGE_TYPE.PARTICIPANTS, 'participants'],
  [MESSAGE_TYPE.ACTION, 'action']
])
</script>

<style lang="scss" scoped>
.card {
  border: none;
  box-shadow: none;
  padding: 5px;
  &.dark-theme {
    background-color: transparent !important;
    color: #eee;
  }
}
</style>

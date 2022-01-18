<template>
  <div>
    <action-card
      :class="isFixed ? 'fixed' : ''"
      title="アクション"
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
            <div class="myself-name-area">
              <p>{{ charaName }}は、</p>
            </div>
          </div>
          <div
            class="action-say-area"
            :class="$store.getters.isDarkTheme ? 'dark-theme' : ''"
          >
            <div class="action-say-content-area">
              <div class="action-say-input-area">
                <b-select
                  v-model="target"
                  expanded
                  size="is-small"
                  class="m-t-10"
                >
                  <option value="">選択しない</option>
                  <option value="全員">全員</option>
                  <option
                    v-for="name in participantNames"
                    :value="name"
                    :key="name"
                    >{{ name }}</option
                  >
                </b-select>
                <message-text-input
                  v-model="message"
                  class="m-t-10"
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
            アクション発言する
          </b-button>
        </div>
      </template>
    </action-card>
    <modal-say
      :is-open="isSayModalOpen"
      :confirm-message="confirmMessage"
      @close="closeSayModal"
      @say="say"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
import messageTextInput from '~/components/village/action/message-text-input.vue'
// type
import SituationAsParticipant from '~/components/type/situation-as-participant'
import Village from '~/components/type/village'
import VillageParticipant from '~/components/type/village-participant'
import Message from '~/components/type/message'
import Chara from '~/components/type/chara'
import { MESSAGE_TYPE } from '~/components/const/consts'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'
const modalSay = () => import('~/components/village/action/say/modal-say.vue')

@Component({
  components: { actionCard, messageTextInput, modalSay }
})
export default class ActionSay extends Vue {
  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  private messageType: string = MESSAGE_TYPE.ACTION
  private target: string = ''
  private message: string = ''
  private isSayModalOpen: boolean = false
  private isFixed: boolean = villageUserSettings.getActionWindow(this).is_fixed!
  private id: string = 'action-say-aria-id'
  private isOpen: boolean =
    villageUserSettings.getActionWindow(this).open_map![this.id] == null
      ? true
      : villageUserSettings.getActionWindow(this).open_map![this.id]

  // 発言確認で返ってきた発言内容
  private confirmMessage: Message | null = null

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get villageId(): number {
    return this.$store.getters.getVillageId!
  }

  private get village(): Village {
    return this.$store.getters.getVillage!
  }

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private get myself(): VillageParticipant {
    return this.situation.participate.myself!
  }

  private get charaName(): string {
    const name = this.myself.chara.chara_name.full_name
    if (this.myself.skill) {
      return `${name} （${this.myself.skill!.name}）`
    } else {
      return name
    }
  }

  private get participantNames(): string[] {
    return this.village.participant.member_list
      .concat(this.village.spectator.member_list)
      .map(p => {
        return p.chara.chara_name.full_name
      })
      .filter(name => {
        return name !== this.charaName
      })
  }

  private get isAlive(): boolean {
    return this.myself.dead == null
  }

  private get canSay(): boolean {
    if (this.message == null || this.message.trim() === '') return false
    if (this.isOver) return false
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
      this.confirmMessage = await api.postConfirmActionSay(
        this,
        this.villageId,
        `${this.myself.chara.chara_name.full_name}は、`,
        this.target,
        this.message
      )
      this.isSayModalOpen = true
    } catch (error) {
      toast.danger(this, 'アクション発言確認失敗しました。')
    }
  }

  private async say(): Promise<void> {
    try {
      await api.postAction(
        this,
        this.villageId,
        `${this.myself.chara.chara_name.full_name}は、`,
        this.target,
        this.message
      )
      this.message = ''
    } catch (error) {
      toast.danger(this, 'アクション発言失敗しました。')
    }
    await this.$emit('reload')
  }

  private closeSayModal(): void {
    this.isSayModalOpen = false
  }

  private pasteToMessageInput(text: string): void {
    this.message += text
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
}
</script>

<style lang="scss" scoped>
.action-say-area {
  .action-say-content-area {
  }
}
</style>

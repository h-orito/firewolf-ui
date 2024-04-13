<template>
  <div :class="$store.getters.isDarkTheme ? 'dark-theme' : ''">
    <action-card
      title="村建てメニュー"
      :id="id"
      :is-open="isOpen"
      :exists-footer="false"
    >
      <template v-slot:content>
        <div class="content has-text-left">
          <div v-if="situation.creator.available_creator_say" class="m-b-20">
            <p style="font-weight: 700; margin-bottom: 6px;">村建て発言</p>
            <message-decorators
              selector="#creator-message-input"
              @decorate-message="message = $event"
            />
            <creator-message-input
              id="creator-message-input"
              v-model="message"
              ref="messageInput"
            />
            <div class="has-text-right">
              <b-button
                :disabled="!canSay"
                @click="sayConfirm"
                type="is-primary"
                size="is-small"
              >
                発言確認
              </b-button>
            </div>
            <modal-say
              :is-open="isSayModalOpen"
              :confirm-message="confirmMessage"
              :village="village"
              :situation="situation"
              @close="isSayModalOpen = false"
              @say="say"
            />
          </div>
          <div v-if="situation.creator.available_modify_setting" class="m-b-20">
            <p style="font-weight: 700; margin-bottom: 6px;">設定変更</p>
            <b-field>
              <p class="control has-text-right">
                <b-button
                  :to="{ path: '/setting', query: { id: village.id } }"
                  tag="nuxt-link"
                  type="is-primary"
                  size="is-small"
                >
                  村の設定を変更する
                </b-button>
              </p>
            </b-field>
          </div>
          <div v-if="situation.creator.available_kick" class="m-b-20">
            <p style="font-weight: 700; margin-bottom: 6px;">強制退村</p>
            <b-field>
              <b-select v-model="participantId" expanded size="is-small">
                <option
                  v-for="participant in participants"
                  :value="participant.id"
                  :key="participant.id"
                  >{{ participant.name }}</option
                >
              </b-select>
              <p class="control">
                <button class="button is-danger is-small" @click="kickConfirm">
                  強制退村確認
                </button>
              </p>
            </b-field>
          </div>
          <div v-if="situation.creator.available_cancel_village" class="m-b-20">
            <p style="font-weight: 700; margin-bottom: 6px;">廃村</p>
            <b-field>
              <p class="control has-text-right">
                <b-button
                  type="is-danger"
                  size="is-small"
                  @click="cancelVillageConfirm"
                >
                  廃村確認
                </b-button>
              </p>
            </b-field>
          </div>
          <div
            v-if="situation.creator.available_extend_epilogue"
            class="m-b-20"
          >
            <p style="font-weight: 700; margin-bottom: 6px;">エピローグ延長</p>
            <b-field>
              <p class="control has-text-right">
                <b-button
                  type="is-primary"
                  size="is-small"
                  @click="extendEpilogueConfirm"
                >
                  エピローグ延長
                </b-button>
              </p>
            </b-field>
          </div>
        </div>
      </template>
    </action-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
import actionCard from '~/components/village/action/action-card.vue'
import creatorMessageInput from '~/components/village/action/creator/creator-message-input.vue'
import toast from '~/components/village/village-toast'
// type
import Village from '~/components/type/village'
import VillageParticipant from '~/components/type/village-participant'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import Message from '~/components/type/message'
// ts
import villageUserSettings from '~/components/village/user-settings/village-user-settings'
// dynamic imports
const modalSay = () => import('~/components/village/action/say/modal-say.vue')
const messageDecorators = () =>
  import('~/components/village/action/decorator/message-decorators.vue')

@Component({
  components: { actionCard, creatorMessageInput, modalSay, messageDecorators }
})
export default class VillageCreator extends Vue {
  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  private participantId: number = this.participants[0].id
  private message: string = ''
  private isSayModalOpen: boolean = false
  private confirmMessage: Message | null = null
  private id: string = 'creator-aria-id'
  private isOpen: boolean =
    villageUserSettings.getActionWindow(this).open_map![this.id] == null
      ? true
      : villageUserSettings.getActionWindow(this).open_map![this.id]

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get village(): Village {
    return this.$store.getters.getVillage
  }

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private get participants(): VillageParticipant[] {
    return this.village.participant.member_list.concat(
      this.village.spectator.member_list
    )
  }

  private get isOver(): boolean {
    // @ts-ignore
    return this.$refs.messageInput.existsOver
  }

  private get canSay(): boolean {
    if (this.message == null || this.message.trim() === '') return false
    if (this.isOver) return false
    return true
  }

  // ----------------------------------------------------------------
  // methods
  // ----------------------------------------------------------------
  private kickConfirm(): void {
    const self = this
    this.$buefy.dialog.confirm({
      title: '強制退村確認',
      message: '本当に強制退村させますか？',
      confirmText: '退村させる',
      type: 'is-danger',
      hasIcon: true,
      iconPack: 'fas',
      onConfirm: async () => {
        await self.kick()
        toast.info(self, '退村させました')
      },
      size: 'is-small',
      cancelText: 'キャンセル'
    })
  }

  private async kick(): Promise<void> {
    try {
      await this.$axios.$post(`/creator/village/${this.village.id}/kick`, {
        target_id: this.participantId
      })
      this.$emit('reload')
    } catch (error) {}
  }

  private cancelVillageConfirm(): void {
    const self = this
    this.$buefy.dialog.confirm({
      title: '廃村確認',
      message: '本当に廃村にしますか？',
      confirmText: '廃村にする',
      type: 'is-danger',
      hasIcon: true,
      iconPack: 'fas',
      onConfirm: async () => {
        await self.cancelVillage()
        toast.info(self, '廃村にしました')
      },
      size: 'is-small',
      cancelText: 'キャンセル'
    })
  }

  private async cancelVillage(): Promise<void> {
    try {
      await this.$axios.$post(`/creator/village/${this.village.id}/cancel`)
      this.$emit('reload')
    } catch (error) {}
  }

  private extendEpilogueConfirm(): void {
    const self = this
    this.$buefy.dialog.confirm({
      title: 'エピローグ延長確認',
      message: '1日延長しますか？',
      confirmText: '延長する',
      type: 'is-primary',
      hasIcon: true,
      iconPack: 'fas',
      onConfirm: async () => {
        await self.extendEpilogue()
        toast.info(self, '延長しました')
      },
      size: 'is-small',
      cancelText: 'キャンセル'
    })
  }

  private async extendEpilogue(): Promise<void> {
    try {
      await this.$axios.$post(
        `/creator/village/${this.village.id}/extend-epilogue`
      )
      this.$emit('reload')
    } catch (error) {}
  }

  private async sayConfirm(): Promise<void> {
    try {
      this.confirmMessage = await this.$axios.$post(
        `/creator/village/${this.village.id}/say-confirm`,
        {
          message: this.message
        }
      )
      this.isSayModalOpen = true
    } catch (error) {
      toast.danger(this, '発言確認失敗')
    }
  }

  private async say(): Promise<void> {
    try {
      await this.$axios.$post(`/creator/village/${this.village.id}/say`, {
        message: this.message
      })
      this.message = ''
    } catch (error) {
      toast.danger(this, '発言失敗')
    }
    await this.$emit('reload')
  }
}
</script>

<style lang="scss" scoped>
.dark-theme {
  .card {
    background-color: transparent;
    color: #eee;
  }
}
</style>

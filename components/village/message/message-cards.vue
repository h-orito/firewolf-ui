<template>
  <div :class="isDarkTheme ? 'dark-theme' : ''">
    <div
      v-if="messages.all_page_count != null && messages.all_page_count > 1"
      class="m-l-5 m-r-5 m-t-10 m-b-10"
      style="display: flex;"
    >
      <b-pagination
        :total="messages.all_record_count"
        :current="messages.current_page_num"
        :range-before="range"
        :range-after="range"
        order="is-right"
        size="is-small"
        :per-page="perPage"
        icon-pack="fas"
        icon-prev="chevron-left"
        icon-next="chevron-right"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
        @change="change($event)"
        style="flex: 1;"
      />
      <b-button
        size="is-small"
        class="m-l-10 latest-button"
        :class="isLatestDay && messages.is_latest ? 'active' : ''"
        @click="$emit('disp-latest')"
        >最新</b-button
      >
    </div>
    <message-card
      v-for="(message, idx) in messages.list"
      :key="message.time.unix_time_milli"
      :message="message"
      :is-progress="isProgress"
      :index="idx"
      :is-dark-theme="isDarkTheme"
      :is-disp-date="isDispDate"
      :is-img-large="isImgLarge"
      :can-reply="canReply"
      :can-secret="canSecret"
      ref="messageCard"
      @paste-message-input="$emit('paste-message-input', $event)"
      @reply="$emit('reply', $event)"
      @secret="$emit('secret', $event)"
    />
    <village-situation-message
      :is-latest-day="isLatestDay"
      :messages="messages"
    />
    <div>
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
    <div
      v-if="messages.all_page_count != null && messages.all_page_count > 1"
      class="m-l-5 m-r-5 m-t-10 m-b-10"
      style="display: flex;"
    >
      <b-pagination
        :total="messages.all_record_count"
        :current="messages.current_page_num"
        :range-before="range"
        :range-after="range"
        order="is-right"
        size="is-small"
        :per-page="perPage"
        icon-pack="fas"
        icon-prev="chevron-left"
        icon-next="chevron-right"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
        @change="change($event)"
        style="flex: 1;"
      />
      <b-button
        size="is-small"
        class="m-l-10 latest-button"
        :class="isLatestDay && messages.is_latest ? 'active' : ''"
        @click="$emit('disp-latest')"
        >最新</b-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageCard from '~/components/village/message/message-card.vue'
// type
import Village from '~/components/type/village'
import Messages from '~/components/type/messages'
import { VILLAGE_STATUS } from '~/components/const/consts'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import VillageParticipant from '~/components/type/village-participant'
// dynamic imports
const villageSituationMessage = () =>
  import('~/components/village/message/village-situation-message.vue')

@Component({
  components: {
    messageCard,
    villageSituationMessage
  }
})
export default class MessageCard extends Vue {
  @Prop({ type: Number })
  private perPage!: number

  @Prop({ type: Boolean })
  private isLatestDay!: boolean

  private range: number = 2

  private get village(): Village {
    return this.$store.getters.getVillage!
  }

  private get situation(): SituationAsParticipant {
    return this.$store.getters.getSituation!
  }

  private get messages(): Messages {
    return this.$store.getters.getMessages!
  }

  private get isProgress(): boolean {
    const statusCode = this.village.status.code
    return (
      statusCode === VILLAGE_STATUS.PROLOGUE ||
      statusCode === VILLAGE_STATUS.PROGRESS
    )
  }

  private get isDarkTheme(): boolean {
    return this.$store.getters.isDarkTheme
  }

  private get isDispDate(): boolean {
    return this.$store.getters.getVillageUserSettings.message_display
      .is_disp_date
  }

  private get isImgLarge(): boolean {
    return this.$store.getters.getVillageUserSettings.message_display
      .is_img_large
  }

  private get canReply(): boolean {
    return !!this.situation.participate.myself
  }

  private get canSecret(): boolean {
    return (
      !!this.situation.participate.myself &&
      (this.village.setting.rules.available_secret_say ||
        this.situation.admin.admin)
    )
  }

  private change(pageNum: number) {
    this.$emit('change-message-page', {
      pageNum
    })
  }

  private clearAnchorMessages(): void {
    const refs: any = this.$refs as any
    if (this.messages.list.length > 0) {
      const messageRefs: any[] = refs.messageCard
      messageRefs.forEach(element => {
        element.clearAnchorMessages()
      })
    }
  }
}
</script>

<style lang="scss">
.dark-theme {
  a.pagination-link {
    color: #eee;
  }
  .latest-button {
    background-color: transparent;
    color: #14b4ff;
  }
}
.latest-button {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  border-radius: 4px;

  &.active {
    background-color: #3991f4;
    border-color: #3991f4;
    color: #fff;
  }
}
</style>

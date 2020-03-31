<template>
  <div>
    <b-pagination
      v-if="messages.all_page_count != null && messages.all_page_count > 1"
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
      class="m-l-5 m-r-5 m-t-10 m-b-10"
    />
    <message-card
      v-for="message in messages.list"
      :key="message.time.unix_time_milli"
      :village="village"
      :message="message"
      :is-progress="isProgress"
    ></message-card>
    <village-situation-message
      :village="village"
      :is-latest-day="isLatestDay"
    />
    <b-pagination
      v-if="messages.all_page_count != null && messages.all_page_count > 1"
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
      class="m-l-5 m-r-5 m-t-10 m-b-10"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import messageCard from '~/components/village/message/message-card.vue'
// type
import Village from '~/components/type/village'
import Messages from '~/components/type/messages'
import villageUserSettings, {
  VillageUserSettings
} from '~/components/village/user-settings/village-user-settings'
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
  @Prop({ type: Object })
  private messages!: Messages

  @Prop({ type: Object })
  private village!: Village

  @Prop({ type: Number })
  private perPage!: number

  @Prop({ type: Boolean })
  private isProgress!: boolean

  @Prop({ type: Boolean })
  private isLatestDay!: boolean

  private range: number = 2

  private change(pageNum: number) {
    this.$emit('change-message-page', {
      pageNum
    })
  }
}
</script>
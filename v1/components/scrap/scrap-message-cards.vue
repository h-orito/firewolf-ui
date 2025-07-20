<template>
  <div :class="isDarkTheme ? 'dark-theme' : ''">
    <message-card
      v-for="(message, idx) in messages.list"
      :key="message.time.unix_time_milli"
      :message="message"
      :is-progress="isProgress"
      :index="idx"
      :is-dark-theme="isDarkTheme"
      :is-disp-date="isDispDate"
      :is-img-large="isImgLarge"
      :can-reply="false"
      :can-secret="false"
      ref="messageCard"
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

@Component({
  components: {
    messageCard
  }
})
export default class MessageCard extends Vue {
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
}
</script>

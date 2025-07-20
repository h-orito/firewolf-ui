<template>
  <div
    :class="[charSizeClass, $store.getters.isDarkTheme ? 'dark-theme' : '']"
    class="village-wrapper"
  >
    <loading
      v-if="loadingVillage"
      :message="'村情報を読み込み中...'"
      :fixed="true"
    ></loading>
    <loading
      v-if="loadingMessage"
      :message="'発言を読み込み中...'"
      :fixed="true"
    ></loading>
    <div v-if="village" class="village-article-wrapper">
      <h1 class="village-name has-text-left">{{ villageName }}</h1>
      <scrap-message-cards v-if="messages" ref="messageCards" />
      <hr />
      <scrap-card @add-scrap="addScrap" @delete-scrap="deleteScrap" />
      <nuxt-link :to="{ path: 'village', query: { id: village.id } }">
        <b-button size="is-small" type="is-secondary">村へ戻る</b-button>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { firebaseAuth, onAuthStateChanged } from '~/plugins/firebase'
// components
import loading from '~/components/loading.vue'
// type
import Village from '~/components/type/village'
import Messages from '~/components/type/messages'
import villageUserSettings, {
  VillageUserSettings
} from '~/components/village/user-settings/village-user-settings'
import { MESSAGE_TYPE } from '~/components/const/consts'
// util
import {
  getAnchorType,
  getAnchorNum
} from '~/components/village/message/message-converter'
import VillageAnchorMessage from '~/components/type/village-anchor-message'
// dynamic imports
const scrapMessageCards = () =>
  import('~/components/scrap/scrap-message-cards.vue')
const scrapCard = () => import('~/components/scrap/scrap-card.vue')

@Component({
  components: {
    loading,
    scrapMessageCards,
    scrapCard
  },
  asyncData({ query }) {
    return {
      villageId: query.id,
      anchors: query.anchors
    }
  }
})
export default class extends Vue {
  // ----------------------------------------------------------------
  // head
  // ----------------------------------------------------------------
  private head() {
    return {
      title: this.village == null ? '' : ` | ${this.village.name} | 切り抜き`
    }
  }

  // ----------------------------------------------------------------
  // layout
  // ----------------------------------------------------------------
  private layout() {
    return 'village-layout'
  }

  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  /** village_id */
  private villageId: number = 0
  /** anchors */
  private anchors: string = ''
  /** 村情報を取得中か */
  private loadingVillage: boolean = true
  /** 発言を取得中か */
  private loadingMessage: boolean = false

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get village(): Village | null {
    return this.$store.getters.getVillage
  }

  private get messages(): Messages | null {
    return this.$store.getters.getMessages
  }

  /** 村名 */
  private get villageName(): string {
    return this.village!.name
  }

  /** ローカル環境か */
  private get isDebug(): boolean {
    return (process.env as any).ENV === 'local'
  }

  private get charSizeClass(): string {
    const settings: VillageUserSettings = this.$store.getters
      .getVillageUserSettings
    const isCharSizeLarge: boolean =
      settings?.message_display?.is_char_large || false
    return isCharSizeLarge ? 'is-size-6' : 'is-size-7'
  }

  private get isAlreadyAuthenticated(): boolean {
    return this.$store.getters.isAuthenticated
  }

  // ----------------------------------------------------------------
  // mounted
  // ----------------------------------------------------------------
  private mounted() {
    this.$store.dispatch('INIT_VILLAGE', {
      villageId: this.villageId
    })
    // 表示設定が作成されていなかったら作成
    villageUserSettings.createCookieIfNeeded(this)
    this.$store.dispatch('INIT_VILLAGE_SETTINGS')
    this.mountedLoading()
  }

  // ----------------------------------------------------------------
  // methods
  // ----------------------------------------------------------------

  /** 村を読み込み */
  private async loadVillage(): Promise<void> {
    this.loadingVillage = true
    await this.$store.dispatch('LOAD_VILLAGE')
    this.loadingVillage = false
  }

  private async mountedLoading(): Promise<void> {
    // 認証を待つ
    await this.auth()
    // もろもろ読込
    await this.reload()
    // URLから発言読み込み
    this.loadFromUrl()
  }

  /** 認証 */
  private async auth(): Promise<void> {
    // 認証済みなら何もしない
    if (this.isAlreadyAuthenticated) return
    const user = await new Promise((resolve, reject) => {
      onAuthStateChanged(firebaseAuth, user => resolve(user))
    })
    await this.$store.dispatch('LOGINOUT', {
      user
    })
  }

  private async loadFromUrl(): Promise<void> {
    if (!this.anchors) return
    for (const str of this.anchors.split('_')) {
      if (str.length < 2) return
      const type: string = this.convertToType(str.charAt(0))
      if (type === '') return
      const number: number = parseInt(str.substring(1))
      await this.addMessage(type, number)
    }
  }

  private convertToType(str: string): string {
    let type
    switch (str.charAt(0)) {
      case 'n':
        type = MESSAGE_TYPE.NORMAL_SAY
        break
      case 'w':
        type = MESSAGE_TYPE.WEREWOLF_SAY
        break
      case 'S':
        type = MESSAGE_TYPE.SECRET_SAY
        break
      case 'm':
        type = MESSAGE_TYPE.SYMPATHIZE_SAY
        break
      case 'l':
        type = MESSAGE_TYPE.LOVERS_SAY
        break
      case 's':
        type = MESSAGE_TYPE.SPECTATE_SAY
        break
      case 'M':
        type = MESSAGE_TYPE.MONOLOGUE_SAY
        break
      case 'g':
        type = MESSAGE_TYPE.GRAVE_SAY
        break
      case 'a':
        type = MESSAGE_TYPE.ACTION
        break
    }
    return type
  }

  private addScrap(anchorString: string): void {
    let typeCode: string = ''
    let number: number = 0
    try {
      typeCode = getAnchorType(anchorString) || ''
      number = getAnchorNum(anchorString)
    } catch (error) {
      alert('取得できませんでした')
      return
    }
    // urlに追加
    const typeStr = this.convertToTypeStr(typeCode)
    if (typeStr === '') {
      alert('取得できませんでした')
      return
    }
    if (this.anchors) {
      this.anchors = `${this.anchors}_${typeStr}${number}`
    } else {
      this.anchors = `${typeStr}${number}`
    }
    this.$router.replace({
      query: {
        id: this.villageId.toString(),
        anchors: this.anchors
      }
    })
    // 読み込み
    this.addMessage(typeCode, number)
  }

  private async addMessage(typeCode: string, number: number): Promise<void> {
    this.loadingMessage = true
    const anchorMessage: VillageAnchorMessage | null = await this.loadAnchorMessage(
      typeCode,
      number
    )
    if (anchorMessage?.message == null) {
      alert('取得できませんでした')
      return
    }
    this.messages!.list.push(anchorMessage.message)
    this.$store.dispatch('STORE_MESSAGES', {
      messages: this.messages!
    })
    this.loadingMessage = false
  }

  private convertToTypeStr(typeCode: string): string {
    switch (typeCode) {
      case MESSAGE_TYPE.NORMAL_SAY:
        return 'n'
      case MESSAGE_TYPE.WEREWOLF_SAY:
        return 'w'
      case MESSAGE_TYPE.SECRET_SAY:
        return 'S'
      case MESSAGE_TYPE.SYMPATHIZE_SAY:
        return 'm'
      case MESSAGE_TYPE.LOVERS_SAY:
        return 'l'
      case MESSAGE_TYPE.SPECTATE_SAY:
        return 's'
      case MESSAGE_TYPE.MONOLOGUE_SAY:
        return 'M'
      case MESSAGE_TYPE.GRAVE_SAY:
        return 'g'
      case MESSAGE_TYPE.ACTION:
        return 'a'
      default:
        return ''
    }
  }

  private async deleteScrap(): Promise<void> {
    if (!window.confirm('全て削除してよろしいですか？')) return
    await this.$store.dispatch('STORE_MESSAGES', {
      messages: {
        list: []
      }
    })
    this.$router.replace({
      query: {
        id: this.villageId.toString()
      }
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

  /** もろもろ読み込み */
  private async reload(): Promise<void> {
    await this.loadVillage()
    await this.$store.dispatch('STORE_MESSAGES', {
      messages: {
        list: []
      }
    })
  }
}
</script>

<style lang="scss" scoped>
// 全体レイアウト
html {
  overflow-y: auto !important;
}
.village-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;

  .village-article-wrapper {
    width: 100%;

    .village-name {
      margin: 10px 5px;
    }
  }

  @media (min-width: 768px) {
    .village-article-wrapper {
      width: 768px;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
      padding: 10px;
    }
  }

  &.dark-theme {
    .modal-card {
      color: #fff;
      .title {
        color: #fff;
      }
      .modal-card-head,
      .modal-card-foot {
        background-color: $dark;
        .modal-card-title {
          color: $white;
        }
      }
      .modal-card-head {
        border-bottom: none;
      }
      .modal-card-foot {
        border-top: none;
      }
      .modal-card-body {
        background-color: #222;
      }
    }
    .table {
      background-color: transparent;
      color: #fff;
      th {
        color: #fff;
      }
      tr.detail {
        background-color: transparent;
        color: #fff;
      }
    }
    .field .label {
      color: $white;
    }
  }
}
</style>

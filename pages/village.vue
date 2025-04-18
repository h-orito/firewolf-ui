<template>
  <div
    :class="[charSizeClass, $store.getters.isDarkTheme ? 'dark-theme' : '']"
    class="village-wrapper"
  >
    <div v-if="!$window.isMobile" class="village-leftside-wrapper">
      <village-slider
        :charachips="charachips"
        :is-expanded="isSliderExpanded"
        @refresh="reload"
        @hide-slider="hideSlider"
        @chara-filter="charaFilter($event)"
        ref="slider"
      />
    </div>
    <div class="village-rightside-wrapper">
      <village-header
        class="village-header-wrapper"
        :current-village-day="displayVillageDay"
        @to-head="toHead"
        @current-day-change="changeDisplayDay($event)"
      />
      <div
        class="village-main-wrapper"
        :class="$store.getters.isDarkTheme ? 'dark-theme' : ''"
        :style="
          $window.isMobile
            ? 'max-width: 100vw;'
            : 'max-width: calc(100vw - 280px);'
        "
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
        <loading
          v-if="!loadingMessage && loadingSituation"
          :message="'参加状況を読み込み中...'"
          :fixed="true"
        ></loading>
        <div v-if="village" class="village-article-wrapper">
          <h1 class="village-name has-text-left">{{ villageName }}</h1>
          <village-day-list
            v-if="displayVillageDay"
            :display-village-day-id="displayVillageDay.id"
            @current-day-change="changeDisplayDay($event)"
          />
          <message-cards
            v-if="messages"
            :per-page="perPage"
            :is-latest-day="
              displayVillageDay &&
                latestDay &&
                displayVillageDay.id === latestDay.id
            "
            @change-message-page="changeMessagePage($event)"
            @paste-message-input="pasteToMessageInput($event)"
            @disp-latest="dispLatest"
            @reply="reply($event)"
            @secret="secret($event)"
            ref="messageCards"
          />
          <village-day-list
            v-if="displayVillageDay"
            :village="village"
            :display-village-day-id="displayVillageDay.id"
            @current-day-change="changeDisplayDay($event)"
          />
          <div id="message-bottom" />
          <actions
            v-if="village && existsAction"
            :charachips="charachips"
            @reload="reload"
            ref="action"
          ></actions>
        </div>
      </div>
      <village-footer
        class="village-footer-wrapper"
        :exists-new-messages="existsNewMessages"
        @refresh="reload"
        @to-bottom="toBottom"
        @toggle-slider="toggleSlider"
        @filter="filter($event)"
        ref="footer"
      />
      <village-slider
        v-if="$window.isMobile"
        :is-expanded="isSliderExpanded"
        @refresh="reload"
        @hide-slider="hideSlider"
        @chara-filter="charaFilter($event)"
        ref="slider"
      />
      <modal-age-limit
        :is-open="isOpenAgeLimitModal"
        @close-modal="closeAgeLimitModal"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { firebaseAuth, onAuthStateChanged } from '~/plugins/firebase'
// components
import loading from '~/components/loading.vue'
import actions from '~/components/village/action/actions.vue'
import villageFooter from '~/components/village/footer/village-footer.vue'
import villageHeader from '~/components/village/header/village-header.vue'
import villageSlider from '~/components/village/slider/village-slider.vue'
// type
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
import VillageLatest from '~/components/type/village-latest'
import Messages from '~/components/type/messages'
import SituationAsParticipant from '~/components/type/situation-as-participant'
import { VILLAGE_STATUS } from '~/components/const/consts'
import villageUserSettings, {
  VillageUserSettings
} from '~/components/village/user-settings/village-user-settings'
import actionHelper from '~/components/village/action/village-action-helper'
import api from '~/components/village/village-api'
import toast from '~/components/village/village-toast'
import Charachip from '~/components/type/charachip'
// dynamic imports
const messageCards = () =>
  import('~/components/village/message/message-cards.vue')
const villageDayList = () => import('~/components/village/village-day-list.vue')
const modalAgeLimit = () => import('~/components/village/modal-age-limit.vue')

@Component({
  components: {
    loading,
    messageCards,
    actions,
    villageDayList,
    villageFooter,
    villageHeader,
    villageSlider,
    modalAgeLimit
  },
  asyncData({ query }) {
    return {
      villageId: query.id,
      filterId: query.filterId
    }
  }
})
export default class extends Vue {
  // ----------------------------------------------------------------
  // head
  // ----------------------------------------------------------------
  private head() {
    return { title: this.village == null ? '' : ` | ${this.village.name}` }
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
  /** filter_id */
  private filterId: string | null = null
  /** 現在表示している村日付 */
  private displayVillageDay: VillageDay | null = null
  /** 村情報を取得中か */
  private loadingVillage: boolean = true
  /** 発言を取得中か */
  private loadingMessage: boolean = false
  /** 参加状況を取得中か */
  private loadingSituation: boolean = false
  /** 現在の発言ページ番号 */
  private currentPageNum: number | null = 1
  /** 1ページあたりの表示件数 */
  private perPage: number = 0
  /** 最新を表示するか */
  private isDispLatest: boolean = true
  /** 最新発言unix time milli */
  private latestMessageUnixTimeMilli: number = 0
  /** 新しい発言があるか */
  private existsNewMessages: boolean = false
  /** 新しい発言があるか定期的にチェックするtimer */
  private latestTimer: any | null = null
  /** 残り時間表示 */
  private daychangeTimer: any | null = null
  /** この村のキャラチップ */
  private charachips: Charachip[] = []
  /** 発言抽出：発言種別 */
  private messageTypeFilter: string[] | null = null
  /** 発言抽出：参加者 */
  private participantIdFilter: number[] | null = null
  /** 発言抽出：宛先 */
  private toParticipantIdFilter: number[] | null = null
  /** 発言抽出：キーワード */
  private keywordFilter: string | null = null
  /** サイドバー */
  private isSliderExpanded: boolean = false
  /** 年齢制限モーダル */
  private isOpenAgeLimitModal: boolean = false

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------
  private get village(): Village | null {
    return this.$store.getters.getVillage
  }

  private get messages(): Messages | null {
    return this.$store.getters.getMessages
  }

  private get situation(): SituationAsParticipant | null {
    return this.$store.getters.getSituation
  }

  private get latestDay(): VillageDay | null {
    return this.$store.getters.getLatestDay
  }

  private get isFiltering(): boolean {
    return this.$store.getters.isFiltering
  }

  /** 村名と状態 */
  private get villageName(): string {
    const status = this.village!.status
    if (status.code !== VILLAGE_STATUS.PROGRESS || !this.displayVillageDay) {
      return this.village!.name + ' - ' + status.name
    }
    const day = this.displayVillageDay!.day
    return `${this.village!.name} - ${status.name} - ${day}日目`
  }

  /** ローカル環境か */
  private get isDebug(): boolean {
    return (process.env as any).ENV === 'local'
  }

  private get existsAction(): boolean {
    return !!this.situation && actionHelper.existsAction(this.situation)
  }

  private get isAlreadyAuthenticated(): boolean {
    return this.$store.getters.isAuthenticated
  }

  private get charSizeClass(): string {
    const settings: VillageUserSettings = this.$store.getters
      .getVillageUserSettings
    const isCharSizeLarge: boolean =
      settings?.message_display?.is_char_large || false
    return isCharSizeLarge ? 'is-size-6' : 'is-size-7'
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
    this.$nextTick(() => {
      // ビュー全体がレンダリングされた後に実行
      // safari対策
      this.resizeHeight()
      window.addEventListener('resize', () => this.resizeHeight())
    })
  }

  private async mountedLoading(): Promise<void> {
    // 認証を待つ
    await this.auth()
    // もろもろ読込
    await this.reload()
    // 個人抽出があれば抽出
    if (this.filterId) {
      await this.charaFilter({ participantId: parseInt(this.filterId!) })
    } else {
      // なければリセット（初期状態が全員チェックなしなので独り言が見えない）
      // @ts-ignore
      this.$refs.footer.filterRefresh(true, true)
    }
    // キャラチップ名
    this.charachips = await api.fetchCharachips(this, this.village!)
    // 定期的に最新発言がないかチェックする
    if (isNotFinished(this.village!)) {
      this.latestTimer = this.setLatestTimer()
      this.daychangeTimer = setDaychangeTimer(this.$refs.footer)
    } else {
      // 1回だけ実行
      updateDaychangeTimer(this.$refs.footer)
    }
    this.displayAgeLimitIfNeeded()
  }

  // ----------------------------------------------------------------
  // destroyed
  // ----------------------------------------------------------------
  private destroyed(): void {
    this.clearTimer()
  }

  // ----------------------------------------------------------------
  // methods
  // ----------------------------------------------------------------
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

  /** 村を読み込み */
  private async loadVillage(): Promise<void> {
    this.loadingVillage = true
    await this.$store.dispatch('LOAD_VILLAGE')
    this.loadingVillage = false
  }

  /** 発言を読み込み */
  private async loadMessage(
    isDispLatestDay: boolean = false,
    isDispLatestPage: boolean = false
  ): Promise<void> {
    this.loadingMessage = true
    // 村を読み込めていない場合は何もしない
    if (this.latestDay == null) {
      this.loadingMessage = false
      return
    }
    // 表示する日付
    const displayDay = isDispLatestDay ? this.latestDay : this.displayVillageDay
    // 読み込み
    await this.$store.dispatch('STORE_MESSAGES', {
      messages: await api.fetchMessageList(
        this,
        this.villageId,
        displayDay,
        isDispLatestPage,
        this.isDispLatest,
        this.currentPageNum,
        this.messageTypeFilter,
        this.participantIdFilter,
        this.toParticipantIdFilter,
        this.keywordFilter
      )
    })
    if (villageUserSettings.getPaging(this).is_paging) {
      this.perPage = villageUserSettings.getPaging(this).message_per_page
    }
    this.currentPageNum = this.messages!.current_page_num
    this.updateLatestMessageUnixTimeMilliIfNeeded()
    this.loadingMessage = false
  }

  /** 参加状況を読み込み */
  private async loadSituation(): Promise<void> {
    this.loadingSituation = true
    // 村を読み込めていない場合は何もしない
    if (this.village == null) {
      this.loadingSituation = false
      return
    }
    // 参加状況を読み込み
    this.$store.dispatch('STORE_SITUATION', {
      situation: await api.fetchSituation(this, this.villageId)
    })
    this.loadingSituation = false
  }

  /** デバッグ用村情報を読み込み */
  private async loadDebugVillageIfNeeded(): Promise<void> {
    if (!this.isDebug) return
    await this.$store.dispatch('LOAD_DEBUGVILLAGE')
  }

  /** もろもろ読み込み */
  private async reload(): Promise<void> {
    this.isDispLatest = true
    await this.loadVillage()
    await Promise.all([
      this.loadMessage(true, true), // 最新
      this.loadSituation()
    ])
    // デバッグ用村情報
    await this.loadDebugVillageIfNeeded()
    // 最新日を表示
    this.displayVillageDay = this.latestDay!
    this.existsNewMessages = false
    if (isNotFinished(this.village!)) {
      // 能力行使等をリセット
      // @ts-ignore
      if (this.existsAction) this.$refs.action.reset()
    }
    this.toBottom()

    // アンカーメッセージを非表示にする
    // @ts-ignore
    if (this.$refs.messageCards) this.$refs.messageCards.clearAnchorMessages()
  }

  /** 表示する村日付を変更 */
  private async changeDisplayDay({ villageDayId }): Promise<void> {
    const selectedDay = this.village!.day.day_list.find(
      day => day.id === villageDayId
    )
    if (selectedDay == null) return
    this.displayVillageDay = selectedDay
    this.currentPageNum = 1
    this.isDispLatest = false
    await this.loadMessage()
    this.toHead()
  }

  /** 表示するページを変更 */
  private async changeMessagePage({ pageNum }): Promise<void> {
    this.currentPageNum = pageNum
    this.isDispLatest = false
    await this.loadMessage()
    this.toHead()
  }

  private async dispLatest(): Promise<void> {
    this.displayVillageDay = this.latestDay
    this.isDispLatest = true
    await this.loadMessage()
    this.displayVillageDay = this.latestDay!
    this.toBottom()
  }

  /** 発言抽出 */
  private async filter({
    messageTypeList,
    participantIdList,
    toParticipantIdList,
    keyword
  }): Promise<void> {
    this.messageTypeFilter = messageTypeList
    this.participantIdFilter = participantIdList
    this.toParticipantIdFilter = toParticipantIdList
    this.keywordFilter = keyword
    await this.loadMessage()
  }

  private async charaFilter({ participantId }) {
    // @ts-ignore
    await this.$refs.footer.charaFilter(participantId)
    this.hideSlider()
  }

  /** 発言内容の最上部にスクロール */
  private toHead(): void {
    const element = document.getElementsByClassName('site')
    if (element == null) return
    this.$scrollTo(element[0], {
      container: '.village-article-wrapper'
    })
  }

  private toBottom(): void {
    const element = document.getElementById('message-bottom')
    if (element == null) return
    this.$scrollTo(element, {
      container: '.village-article-wrapper',
      offset: -window.innerHeight
    })
  }

  /** 定期的に最新発言がないかチェック */
  private setLatestTimer(): any {
    return setInterval(this.loadVillageLatest, 30 * 1000)
  }

  /** 最新発言チェックを解除 */
  private clearTimer(): void {
    clearInterval(this.latestTimer)
    clearInterval(this.daychangeTimer)
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout)
  }

  private updateLatestMessageUnixTimeMilliIfNeeded(): void {
    if (!this.messages || this.messages.list.length <= 0) return
    const unixTimeMilli = this.messages!.list[this.messages!.list.length - 1]
      .time.unix_time_milli
    if (this.latestMessageUnixTimeMilli < unixTimeMilli)
      this.latestMessageUnixTimeMilli = unixTimeMilli
  }

  /** 最新発言チェック */
  private async loadVillageLatest(): Promise<void> {
    const latest: VillageLatest = await api.fetchVillageLatest(
      this,
      this.villageId,
      this.latestMessageUnixTimeMilli
    )
    const currentLatestVillageDayId: number = this.latestDay!.id
    if (latest.village_day_id !== currentLatestVillageDayId) {
      // 日付が変わった
      this.existsNewMessages = true
      if (
        shouldLoadMessage(
          this.latestDay!,
          this.displayVillageDay!,
          this.messages!,
          this.currentPageNum,
          this.isDispLatest,
          // @ts-ignore
          this.$refs.action && this.$refs.action.isInputting,
          this.isFiltering
        )
      ) {
        this.reload()
        toast.info(this, '日付が変わりました')
      } else {
        toast.info(this, '日付が変わりました。リロードしてください。')
      }
    } else if (this.latestMessageUnixTimeMilli < latest.unix_time_milli) {
      // 発言が増えた
      this.existsNewMessages = true
      if (
        shouldLoadMessage(
          this.latestDay!,
          this.displayVillageDay!,
          this.messages!,
          this.currentPageNum,
          this.isDispLatest,
          // @ts-ignore
          this.$refs.action && this.$refs.action.isInputting,
          this.isFiltering
        )
      ) {
        this.loadMessage()
        toast.info(this, '最新発言を読み込みました')
        this.existsNewMessages = false
      }
    }
  }

  private toggleSlider(): void {
    this.isSliderExpanded = !this.isSliderExpanded
  }

  private hideSlider(): void {
    this.isSliderExpanded = false
  }

  // safariアドレスバーメニューバー対策
  private resizeTimeout: any = null
  private resizeHeight(): void {
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(() => setWindowHeight(), 500)
  }

  private pasteToMessageInput({ text }): void {
    if (this.$refs.action) {
      // @ts-ignore
      this.$refs.action.pasteToMessageInput(text)
    }
  }

  private reply({ text, message }): void {
    if (this.$refs.action) {
      // @ts-ignore
      this.$refs.action.reply(text, message)
    }
  }

  private secret({ message, participantId }): void {
    if (this.$refs.action) {
      // @ts-ignore
      this.$refs.action.secret(message, participantId)
    }
  }

  private displayAgeLimitIfNeeded(): void {
    if (!this.village!.setting.tags.list.some(tag => tag.startsWith('R'))) {
      return // 年齢制限がない
    }
    const ageLimitSettings = villageUserSettings.getAgeLimit(this)
    if (
      ageLimitSettings.confirm_village_ids.some(
        id => parseInt(id) === this.village!.id
      )
    ) {
      return
    }
    this.isOpenAgeLimitModal = true
  }

  private closeAgeLimitModal(): void {
    this.isOpenAgeLimitModal = false
  }
}

/** 自動的に最新発言を読み込むか */
const shouldLoadMessage = (
  latestDay: VillageDay,
  displayVillageDay: VillageDay,
  messages: Messages,
  currentPageNum: number | null,
  isDispLatest: boolean,
  isInputting: boolean,
  isFiltering: boolean
): boolean => {
  // 最新日の最新ページを見ていない場合は勝手に更新したくない
  if (
    !isViewingLatest(
      latestDay,
      displayVillageDay,
      messages,
      currentPageNum,
      isDispLatest
    )
  )
    return false
  // 発言入力中や発言抽出中は勝手に更新したくない
  if (isInputting || isFiltering) return false
  return true
}
/** 最新日の最新ページを見ているか */
const isViewingLatest = (
  latestDay: VillageDay,
  displayVillageDay: VillageDay,
  messages: Messages,
  currentPageNum: number | null,
  isDispLatest: boolean
): boolean => {
  // 最新日を見ていない
  if (displayVillageDay!.id !== latestDay.id) return false
  // 最新ページを見ていない
  const allPageCount: number | null = messages.all_page_count
  if (!allPageCount || isDispLatest) return true
  if (!!allPageCount && currentPageNum !== allPageCount) return false
  return true
}
const isNotFinished = (village: Village): boolean => {
  const status = village.status.code
  return status !== VILLAGE_STATUS.COMPLETE && status !== VILLAGE_STATUS.CANCEL
}
/** 更新までの残り時間を表示 */
const updateDaychangeTimer = (footer: any): void => footer.refreshTimer()
const setDaychangeTimer = (footer: any): any =>
  setInterval(() => updateDaychangeTimer(footer), 1000)
const setWindowHeight = (): void =>
  document.documentElement.style.setProperty(
    '--vh',
    `${window.innerHeight * 0.01}px`
  )
</script>

<style lang="scss">
// 全体レイアウト
html {
  overflow-y: auto !important;
}
.village-wrapper {
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  height: calc(100 * var(--vh, 1vh));

  .village-leftside-wrapper {
    height: 100vh;
    background-color: $dark;
  }

  .village-rightside-wrapper {
    flex: 1;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    height: calc(100 * var(--vh, 1vh));

    .village-header-wrapper {
      height: $village-header-height;
    }

    .village-footer-wrapper {
      height: $village-footer-height;
      height: calc(#{$village-footer-height} + env(safe-area-inset-bottom));
    }

    .village-main-wrapper {
      flex: 1;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      justify-content: space-between;
      overflow-y: auto;

      &.dark-theme {
        background-color: #222;
        color: #fff;
        a:not(.button):not(.is-current) {
          color: $primary-dark;
        }
      }

      .village-article-wrapper {
        flex: 1;
        overflow-y: scroll;
        padding-left: 10px;
        padding-right: 10px;

        .village-name {
          margin: 10px 5px;
        }
      }
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

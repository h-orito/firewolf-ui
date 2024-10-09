<template>
  <div class="menu-wrap">
    <spotlight />
    <div
      v-if="isStg"
      class="p-t-30 p-b-30 p-l-30 p-r-30"
      style="background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);"
    >
      <div
        style="border-radius: 4px; border: 1px solid #ff0000; width: 100%; background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);"
        class="has-text-danger is-size-6 p-t-5 p-b-5 p-l-5 p-r-5"
      >
        テストサーバのため、データは不定期に削除される可能性があります。
      </div>
    </div>
    <intro />
    <player-stats
      :myself-player="user"
      :is-loading="loadingAuth"
      @signin-with-twitter="signinWithTwitter"
      @signin-with-google="signinWithGoogle"
      @link-with-twitter="linkWithTwitter"
      @link-with-google="linkWithGoogle"
      @logout="logout"
    />
    <village-list :loading-villages="isLoadingVillages" :villages="villages" />
    <reserved-village
      v-if="
        !isLoadingReservedVillages &&
          reservedVillages &&
          reservedVillages.list.length > 0
      "
      :is-loading="isLoadingReservedVillages"
      :reserved-villages="reservedVillages"
    />
    <charachip />
    <index-footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import qs from 'qs'
import cookies from 'cookie-universal-nuxt'
import { UserCredential } from 'firebase/auth'
import {
  firebaseAuth,
  onAuthStateChanged,
  linkWithPopup,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  TwitterAuthProvider
} from '~/plugins/firebase'
// component
import spotlight from '~/components/index/spotlight.vue'
import intro from '~/components/index/intro.vue'
import loading from '~/components/loading.vue'
// type
import Villages from '~/components/type/villages'
import SimpleVillage from '~/components/type/simple-village'
import MyselfPlayer from '~/components/type/myself-player'
import { VILLAGE_STATUS } from '~/components/const/consts'

// dynamic imports
const playerStats = () => import('~/components/index/player-stats.vue')
const villageList = () => import('~/components/index/village-list.vue')
const charachip = () => import('~/components/index/charachip.vue')
const indexFooter = () => import('~/components/index/index-footer.vue')

@Component({
  components: {
    spotlight,
    intro,
    playerStats,
    villageList,
    charachip,
    indexFooter,
    loading
  }
})
export default class TopPage extends Vue {
  /** head */
  private head() {
    return { title: '' }
  }

  /** data */
  // 村一覧
  private villages: SimpleVillage[] = []
  // loading
  private loadingAuth: boolean = true
  private isLoadingVillages: boolean = true
  private isLoadingReservedVillages: boolean = true

  /** computed */
  private get user(): MyselfPlayer | null {
    return this.$store.getters.getPlayer
  }

  private get isDebug(): boolean {
    return (process.env as any).ENV === 'local'
  }

  private get isStg(): boolean {
    return (process.env as any).ENV !== 'production'
  }

  private get isAlreadyAuthenticated(): boolean {
    return this.$store.getters.isAuthenticated
  }

  /** created */
  async created() {
    // 認証を待つ
    await this.auth()
    this.loadingAuth = false

    // 村一覧
    this.loadingVillages()
  }

  /** methods */
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

  private async loadingVillages(): Promise<void> {
    this.isLoadingVillages = true
    const res = await this.$axios.$get('/village/list', {
      params: {
        village_status: [
          VILLAGE_STATUS.PROLOGUE,
          VILLAGE_STATUS.PROGRESS,
          VILLAGE_STATUS.EPILOGUE
        ],
        is_auto_generate: true
      },
      paramsSerializer: params =>
        qs.stringify(params, { arrayFormat: 'repeat' })
    })
    this.villages = (res as Villages).list
    this.isLoadingVillages = false
  }

  private openModal(selector: string): void {
    const modal = document.querySelector(selector)
    const html = document.querySelector('html')
    modal!.classList.add('is-active')
    html!.classList.add('is-clipped')
    modal!
      .querySelector('.modal-background')!
      .addEventListener('click', function(e) {
        e.preventDefault()
        modal!.classList.remove('is-active')
        html!.classList.remove('is-clipped')
      })
  }

  private async signinWithTwitter(): Promise<void> {
    const provider = new TwitterAuthProvider()
    const result = await signInWithPopup(firebaseAuth, provider)
    await this.registerUserIfNeeded(result)
    window.location.reload()
  }

  private async signinWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(firebaseAuth, provider)
    await this.registerUserIfNeeded(result)
    window.location.reload()
  }

  private async linkWithTwitter(): Promise<void> {
    const provider = new TwitterAuthProvider()
    await linkWithPopup(firebaseAuth.currentUser!, provider)
    window.location.reload()
  }

  private async linkWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider()
    await linkWithPopup(firebaseAuth.currentUser!, provider)
    window.location.reload()
  }

  private async registerUserIfNeeded(
    redirectResult: UserCredential
  ): Promise<void> {
    if (!redirectResult?.user) {
      return
    }
    const user = redirectResult.user
    let twitterUsername: string | null = null
    twitterUsername =
      // @ts-ignore
      user.reloadUserInfo?.providerUserInfo?.find(
        providerUserInfo => providerUserInfo.providerId === 'twitter.com'
      )?.screenName ?? null
    const idToken = await user.getIdToken(false)
    this.$cookies.set('id-token', idToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })
    // 1時間で有効期限が切れるので50分後に再取得させる
    const now = new Date()
    this.$cookies.set(
      'id-token-check-date',
      now.setMinutes(now.getMinutes() + 50),
      {
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      }
    )
    // 変更しても古いままなので取得できたら無理やりとる
    let displayName = user.displayName
    // @ts-ignore
    if (user.reloadUserInfo?.displayName != null) {
      // @ts-ignore
      displayName = user.reloadUserInfo.displayName
    }
    // nickname登録
    return this.$axios.$post(
      '/player/nickname',
      {
        nickname: displayName,
        twitter_user_name: twitterUsername
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    )
  }

  private async logout(): Promise<void> {
    await signOut(firebaseAuth)
    location.reload()
  }
}
</script>

<style lang="scss">
.spotlight-shadow {
  text-shadow: 2px 2px 5px rgba(97, 69, 69, 1), -2px 2px 5px rgba(97, 69, 69, 1),
    2px -2px 5px rgba(97, 69, 69, 1), -2px -2px 5px rgba(97, 69, 69, 1);
}
.button.spotlight-shadow:hover {
  text-shadow: none;
}
.menu-wrap {
  background-color: #0a0a1a;

  .menu-area {
    background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
    color: $white;
    padding: 30px 30px;
    margin-bottom: 50px;
  }
  .menu-area:last-child {
    margin-bottom: 0;
  }
}
</style>

<template>
  <div class="spotlight-area">
    <img src="~/static/image/top.jpg" alt="top_image" width="100%" />
    <div class="spotlight-tablet is-hidden-mobile has-text-left">
      <p class="spotlight-intro spotlight-shadow is-size-1 has-text-white">
        勝つのは<br /><span class="spotlight-strong">人</span>か
        <span class="spotlight-strong">狼</span>か
      </p>
    </div>
    <div
      class="spotlight-mobile has-text-left is-block-mobile is-hidden-tablet"
    >
      <p class="spotlight-intro spotlight-shadow is-size-3 has-text-white">
        勝つのは<br /><span class="spotlight-strong">人</span>か
        <span class="spotlight-strong">狼</span>か
      </p>
    </div>
    <div
      v-if="!isLogin"
      class="spotlight-mobile-twitter-area is-block-mobile is-hidden-tablet"
    >
      <b-button
        size="is-small"
        type="is-white"
        icon-pack="fab"
        icon-left="twitter"
        outlined
        class="spotlight-signin-button spotlight-shadow"
        @click="$emit('signin')"
      >
        <strong>Sign in</strong>
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class Spotlight extends Vue {
  /** data */
  /** computed */
  public get isLogin(): boolean {
    return this.$store.getters.isLogin
  }

  private get catchCopy(): string {
    return '勝つのは<br /><span class="spotlight-strong">人</span>か　<span class="spotlight-strong">狼</span>か'
  }

  /** methods */
}
</script>

<style lang="scss" scoped>
.spotlight-area {
  position: relative;
  background-color: #0a0a1a;

  .spotlight-tablet {
    position: absolute;
    right: 2%;
    top: 40%;

    .spotlight-signin-button {
      margin-top: 1em;
    }
  }

  .spotlight-mobile {
    position: absolute;
    right: 2%;
    bottom: 20%;
  }

  .spotlight-mobile-twitter-area {
    position: absolute;
    right: 2%;
    bottom: 4%;

    .spotlight-signin-button {
      text-shadow: 2px 2px 5px rgba(133, 97, 69, 1),
        -2px 2px 5px rgba(133, 97, 69, 1), 2px -2px 5px rgba(133, 97, 69, 1),
        -2px -2px 5px rgba(133, 97, 69, 1);
    }
    .spotlight-signin-button:hover {
      text-shadow: none;
    }
  }

  .spotlight-intro {
    line-height: 2em;
    font-family: '游明朝', YuMincho, 'Hiragino Mincho ProN W3',
      'ヒラギノ明朝 ProN W3', 'Hiragino Mincho ProN', 'HG明朝E', 'ＭＳ Ｐ明朝',
      'ＭＳ 明朝', serif;

    .spotlight-strong {
      font-weight: 700;
      color: #ff0000;
      text-shadow: 2px 2px 5px rgba(180, 180, 180, 1),
        -2px 2px 5px rgba(180, 180, 180, 1), 2px -2px 5px rgba(180, 180, 180, 1),
        -2px -2px 5px rgba(180, 180, 180, 1);
    }
  }
}
</style>

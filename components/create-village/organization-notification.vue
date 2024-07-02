<template>
  <notification>
    <li>
      役職1文字略称は<nuxt-link :to="{ path: '/rule#skill' }" target="_blank"
        >ルール</nuxt-link
      >を参照してください。
    </li>
    <li>
      ダミー役欠けなしの場合、村人を1名以上含めてください。
    </li>
    <li>
      ダミー役欠けありの場合、噛まれて死亡する役職を1名以上含めてください。
    </li>
    <li>狼系役職を1名以上含めてください。</li>
    <li>狼系役職が過半数を超えないようにしてください。</li>
    <li>最小で5人、最大で999人設定することができます。</li>
  </notification>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
const notification = () => import('~/components/common/notification.vue')

@Component({
  components: { notification }
})
export default class OrganizationNotification extends Vue {}
</script>

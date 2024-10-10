<template>
  <div>
    <action-card
      title="切り抜き"
      id="scrap-aria-id"
      :is-open="true"
      :exists-footer="false"
    >
      <template v-slot:content>
        <div class="content has-text-left m-b-5">
          <notification type="default" class="m-b-10">
            アンカーを貼り付けて「追加」すると、発言が読み込まれます。<br />
            進行中に推理に利用するためにこの画面を共有するのは禁止です。
          </notification>
          <div
            class="action-say-area"
            :class="$store.getters.isDarkTheme ? 'dark-theme' : ''"
          >
            <div class="action-say-content-area">
              <div class="action-say-input-area" style="display: flex">
                <b-input
                  size="is-small"
                  type="text"
                  v-model="value"
                  placeholder=">>1"
                  style="flex: 1"
                  @keyup.native.enter="addScrap"
                  autofocus
                ></b-input>
                <b-button
                  type="is-primary"
                  size="is-small"
                  :disabled="value == null || value.trim() === ''"
                  @click="addScrap"
                >
                  追加
                </b-button>
              </div>
            </div>
          </div>
        </div>
        <div class="action-button-area"></div>
        <div class="action-button-area m-t-10">
          <b-button
            type="is-danger"
            @click="deleteScrap"
            size="is-small"
            expanded
          >
            全削除
          </b-button>
        </div>
      </template>
    </action-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import actionCard from '~/components/village/action/action-card.vue'
const notification = () =>
  import('~/components/village/village-notification.vue')

@Component({
  components: { actionCard, notification }
})
export default class ScrapCard extends Vue {
  // ----------------------------------------------------------------
  // data
  // ----------------------------------------------------------------
  private value: string = ''

  // ----------------------------------------------------------------
  // computed
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // method
  // ----------------------------------------------------------------
  private addScrap(): void {
    if (this.value == null || this.value.trim() === '') return
    this.$emit('add-scrap', this.value)
    this.value = ''
  }

  private deleteScrap(): void {
    this.$emit('delete-scrap')
  }
}
</script>

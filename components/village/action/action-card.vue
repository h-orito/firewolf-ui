<template>
  <div class="card action-card">
    <b-collapse :aria-id="key" :open="isDefaultOpen" animation="slide">
      <header
        class="card-header"
        slot="trigger"
        slot-scope="props"
        :aria-controls="key"
      >
        <p class="action-card-header-title has-text-grey">
          {{ title }}
        </p>
        <span
          class="action-card-header-title"
          style="float: right; padding-right: 5px;"
        >
          <b-icon
            pack="fas"
            :icon="props.open ? 'angle-down' : 'angle-right'"
            size="is-small"
          />
        </span>
      </header>
      <div v-if="existsContent" class="card-content action-card-content">
        <slot name="content" />
      </div>
      <footer v-if="existsFooter" class="card-footer">
        <div class="card-footer-item action-card-footer-item">
          <slot name="footer" />
        </div>
      </footer>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class ActionCard extends Vue {
  @Prop({ type: String })
  private title!: string

  @Prop({ type: Boolean, default: true })
  private existsContent?: boolean

  @Prop({ type: Boolean, default: true })
  private existsFooter?: boolean

  @Prop({ type: Boolean, default: true })
  private isDefaultOpen?: boolean

  private key: string = Math.random()
    .toString(32)
    .substring(2)
}
</script>

<style lang="scss" scoped>
.action-card {
  margin-bottom: 5px;

  .action-card-header-title {
    padding: 5px;
    font-weight: 700;
  }

  .action-card-content {
    text-align: left;
    padding: 10px;
  }
  .action-card-footer-item {
    padding: 5px;
    justify-content: flex-end !important;
  }
}
</style>

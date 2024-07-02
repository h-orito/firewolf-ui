<template>
  <section>
    <b-input
      :id="id"
      size="is-small"
      type="textarea"
      rows="5"
      :value="value"
      @input="$emit('input', $event)"
      :custom-class="
        `creator-say-input ${$store.getters.isDarkTheme ? 'dark-theme' : ''}`
      "
    ></b-input>
    <p class="has-text-right" v-html="counter"></p>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class CreatorMessageInput extends Vue {
  @Prop({ type: String })
  private id!: string

  @Prop({ type: String })
  private value!: string

  private get counter(): string {
    return `${this.lineCount}, ${this.lengthCount}`
  }

  private get existsOver(): boolean {
    return this.isLineOver || this.isLengthOver
  }

  private get lineCount(): string {
    const max = 40
    const current = this.value.split('\n').length
    if (current > max) {
      return `行数: <span class="has-text-danger">${current.toString()}/${max.toString()}</span>`
    } else {
      return `行数: ${current.toString()}/${max.toString()}`
    }
  }

  private get isLineOver(): boolean {
    const max = 40
    const current = this.value.split('\n').length
    return current > max
  }

  private get lengthCount(): string {
    const max = 400
    const current = this.value.length - this.value.split('\n').length + 1
    if (current > max) {
      return `文字数: <span class="has-text-danger">${current.toString()}/${max.toString()}</span>`
    } else {
      return `文字数: ${current.toString()}/${max.toString()}`
    }
  }

  private get isLengthOver(): boolean {
    const max = 400
    const current = this.value.length - this.value.split('\n').length + 1
    return current > max
  }
}
</script>

<style lang="scss" scoped>
.textarea {
  font-family: sans-serif;
}
</style>

<style lang="scss">
.creator-say-input {
  background-color: $creator-say-bg !important;

  &.dark-theme {
    background-color: $creator-say-bg-dark !important;
    color: $white !important;
  }
}
</style>

<template>
  <section>
    <form-input
      :id="id"
      :rules="rules"
      input-type="textarea"
      :rows="rowSize"
      :input-value.sync="inputValueModel"
      @input="$emit('input', $event)"
      :custom-class="messageClass"
      :error-label="label"
    ></form-input>
    <p class="has-text-right" v-html="counter"></p>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {
    formInput: () => import('~/components/common/validation/form-input.vue')
  }
})
export default class DummyCharaMessageInput extends Vue {
  @Prop({ type: String })
  private id!: string

  @Prop({ type: String })
  private value!: string

  @Prop({ type: Number, default: 9 })
  private rowSize!: number

  @Prop({ type: String })
  private rules!: string

  @Prop({ type: String })
  private label!: string

  private get inputValueModel(): string {
    return this.value
  }

  private set inputValueModel(val: string) {
    this.$emit('update:value', val)
  }

  private get counter(): string {
    return `${this.lineCount}, ${this.lengthCount}`
  }

  private get existsOver(): boolean {
    return this.isLineOver || this.isLengthOver
  }

  private get isInputting(): boolean {
    return this.value.length > 0
  }

  private get lineCount(): string {
    const max = 20
    const current = this.value.split('\n').length
    if (current > max) {
      return `行数: <span class="has-text-danger">${current.toString()}/${max.toString()}</span>`
    } else {
      return `行数: ${current.toString()}/${max.toString()}`
    }
  }

  private get isLineOver(): boolean {
    const max = 20
    const current = this.value.split('\n').length
    return current > max
  }

  private get lengthCount(): string {
    const max = 1000
    const current = this.value.length - this.value.split('\n').length + 1
    if (current > max) {
      return `文字数: <span class="has-text-danger">${current.toString()}/${max.toString()}</span>`
    } else {
      return `文字数: ${current.toString()}/${max.toString()}`
    }
  }

  private get isLengthOver(): boolean {
    const max = 1000
    const current = this.value.length - this.value.split('\n').length + 1
    return current > max
  }

  private get messageClass(): string {
    let className: string = 'normal-say-input'
    if (this.$store.getters.isDarkTheme) className += ' dark-theme'
    return className
  }

  private get validationRules(): Object {
    return {
      required: true,
      max: 1004
    }
  }
}
</script>

<style lang="scss" scoped>
.textarea {
  font-family: sans-serif;
}
</style>

<style lang="scss">
.normal-say-input {
  background-color: $normal-say !important;

  &.dark-theme {
    color: $black !important;
  }
}
.werewolf-say-input {
  background-color: $werewolf-say !important;

  &.dark-theme {
    background-color: $werewolf-say-dark !important;
    color: $black !important;
  }
}
.sympathize-say-input {
  background-color: $sympathize-say !important;

  &.dark-theme {
    background-color: $sympathize-say-dark !important;
    color: $black !important;
  }
}
.lovers-say-input {
  background-color: $lovers-say !important;
  color: $lovers-say-text !important;

  &.dark-theme {
    background-color: $lovers-say-dark !important;
    color: $lovers-say-text !important;
  }
}
.monologue-say-input {
  background-color: $monologue-say !important;

  &.dark-theme {
    background-color: $monologue-say-dark !important;
    color: $black !important;
  }
}
.grave-say-input {
  background-color: $grave-say !important;

  &.dark-theme {
    background-color: $grave-say-dark !important;
    color: $black !important;
  }
}
.spectate-say-input {
  background-color: $spectate-say !important;

  &.dark-theme {
    background-color: $spectate-say-dark !important;
    color: $black !important;
  }
}
.secret-say-input {
  background-color: $secret-say !important;
  color: $black;

  &.dark-theme {
    background-color: $secret-say-dark !important;
    border: 1px solid $secret-say-dark !important;
  }
}
</style>

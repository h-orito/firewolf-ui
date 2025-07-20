<template>
  <form-number
    rules="required"
    label-message="更新後沈黙時間（h）"
    max="23"
    min="0"
    step="1"
    :input-value.sync="inputValueModel"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
const formNumber = () =>
  import('~/components/common/validation/form-number.vue')

@Component({
  components: { formNumber }
})
export default class SilentHours extends Vue {
  @Prop({ type: String, required: true })
  private inputValue!: string

  private get inputValueModel(): string {
    return this.inputValue
  }

  private set inputValueModel(val: string) {
    this.$emit('update:inputValue', val)
  }
}
</script>

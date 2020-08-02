<template>
  <form-select
    class="m-b-20"
    rules="required"
    label-message="キャラチップ"
    :input-value.sync="inputValueModel"
    :options="charachips"
    @input="$emit('load-charas')"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import FormOption from '~/components/common/validation/option'
const formSelect = () =>
  import('~/components/common/validation/form-select.vue')

@Component({
  components: { formSelect }
})
export default class Charachip extends Vue {
  @Prop({ type: String, required: true })
  private inputValue!: string

  @Prop({ type: Array, required: true })
  private charachips!: FormOption[]

  private get inputValueModel(): string {
    return this.inputValue
  }

  private set inputValueModel(val: string) {
    this.$emit('update:inputValue', val)
  }
}
</script>

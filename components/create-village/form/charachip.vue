<template>
  <form-multi-select
    class="m-b-20"
    rules="required"
    label-message="キャラチップ"
    :input-value.sync="inputValueModel"
    :options="charachips"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import FormOption from '~/components/common/validation/option'
const formMultiSelect = () =>
  import('~/components/common/validation/form-multi-select.vue')

@Component({
  components: { formMultiSelect }
})
export default class Charachip extends Vue {
  @Prop({ type: Array, required: true })
  private inputValue!: Array<string>

  @Prop({ type: Array, required: true })
  private charachips!: FormOption[]

  private get inputValueModel(): Array<string> {
    return this.inputValue
  }

  private set inputValueModel(val: Array<string>) {
    this.$emit('update:inputValue', val)
    this.$emit('load-charas', { participantIds: val })
  }
}
</script>

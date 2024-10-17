<template>
  <div class="m-b-20">
    <form-select
      rules=""
      label-message="年齢制限"
      :input-value.sync="inputValueModel"
      :options="options"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import FormOption from '~/components/common/validation/option'

const formSelect = () =>
  import('~/components/common/validation/form-select.vue')

@Component({
  components: { formSelect }
})
export default class AgeLimit extends Vue {
  @Prop({ type: String, required: true })
  private inputValue!: string

  private get inputValueModel(): string {
    return this.inputValue
  }

  private set inputValueModel(val: string) {
    this.$emit('update:inputValue', val)
  }

  private get options(): FormOption[] {
    return [
      {
        key: 'none',
        label: '全年齢',
        value: ''
      },
      {
        key: '15',
        label: 'R15',
        value: 'R15'
      },
      {
        key: '18',
        label: 'R18',
        value: 'R18'
      }
    ]
  }
}
</script>

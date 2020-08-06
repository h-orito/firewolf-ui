<template>
  <form-input
    rules="max:20"
    label-message="参加パスワード（任意）"
    input-type="text"
    max-length="20"
    place-holder-message="参加パスワード（任意）"
    :input-value.sync="inputValueModel"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
const formInput = () => import('~/components/common/validation/form-input.vue')

@Component({
  components: { formInput }
})
export default class JoinPassword extends Vue {
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

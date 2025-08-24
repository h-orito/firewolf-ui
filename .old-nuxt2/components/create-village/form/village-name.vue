<template>
  <form-input
    rules="required|max:40"
    label-message="村名"
    input-type="text"
    max-length="40"
    place-holder-message="村名"
    :input-value.sync="inputValueModel"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
const formInput = () => import('~/components/common/validation/form-input.vue')

@Component({
  components: { formInput }
})
export default class VillageName extends Vue {
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

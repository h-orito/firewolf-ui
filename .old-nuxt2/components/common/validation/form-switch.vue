<template>
  <validation-provider v-slot="{ errors }" :rules="rules" :name="labelMessage">
    <div class="m-b-20">
      <b-field
        :label="labelMessage"
        :message="errors.length ? errors[0] : ''"
        :type="errors.length ? 'is-danger' : ''"
        horizontal
      >
        <b-switch v-model="inputValueModel" size="is-small" expanded>{{
          description
        }}</b-switch>
      </b-field>
      <slot :inputValue="inputValue" />
    </div>
  </validation-provider>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class FormInput extends Vue {
  @Prop({ type: String, required: true })
  private rules!: string

  @Prop({ type: String, required: true })
  private labelMessage!: string

  @Prop({ type: String, required: true })
  private description!: string

  @Prop({ type: Boolean, required: true })
  private inputValue!: boolean

  private get inputValueModel(): boolean {
    return this.inputValue
  }

  private set inputValueModel(val: boolean) {
    this.$emit('update:inputValue', val)
  }
}
</script>

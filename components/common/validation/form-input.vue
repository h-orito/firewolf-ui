<template>
  <validation-provider v-slot="{ errors }" :rules="rules" :name="labelMessage">
    <b-field
      :label="labelMessage"
      :message="errors.length ? errors[0] : ''"
      :type="errors.length ? 'is-danger' : ''"
      horizontal
    >
      <b-input
        v-model="inputValueModel"
        size="is-small"
        :type="inputType"
        :maxlength="maxLength"
        :placeholder="placeHolderMessage"
        expanded
      ></b-input>
    </b-field>
    <slot :inputValue="inputValue" :maxLength="maxLength" />
  </validation-provider>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class FormInput extends Vue {
  @Prop({ required: true })
  private rules!: any

  @Prop({ type: String, required: true })
  private labelMessage!: string

  @Prop({ type: String, required: true })
  private inputType!: string

  @Prop({ type: String, required: true })
  private maxLength!: string

  @Prop({ type: String, required: true })
  private placeHolderMessage!: string

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

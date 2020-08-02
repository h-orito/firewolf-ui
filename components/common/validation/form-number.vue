<template>
  <div>
    <validation-provider
      v-slot="{ errors }"
      :rules="rules"
      :name="labelMessage"
    >
      <b-field
        :label="labelMessage"
        :message="errors.length ? errors[0] : ''"
        :type="errors.length ? 'is-danger' : ''"
        horizontal
      >
        <b-input
          v-model="inputValueModel"
          size="is-small"
          type="number"
          :max="max"
          :min="min"
          :step="step"
        ></b-input>
      </b-field>
      <slot :inputValue="inputValue" />
    </validation-provider>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class FormNumber extends Vue {
  @Prop({ type: String, required: true })
  private rules!: string

  @Prop({ type: String, required: true })
  private labelMessage!: string

  @Prop({ type: String, required: true })
  private max!: string

  @Prop({ type: String, required: true })
  private min!: string

  @Prop({ type: String, required: true })
  private step!: string

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

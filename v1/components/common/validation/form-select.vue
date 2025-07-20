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
        <b-select
          v-model="inputValueModel"
          size="is-small"
          @input="$emit('input', $event)"
          expanded
        >
          <option
            v-for="option in options"
            :key="option.key"
            :value="option.value"
            >{{ option.label }}</option
          >
        </b-select>
      </b-field>
      <slot :inputValue="inputValue" />
    </validation-provider>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import FormOption from '~/components/common/validation/option'

@Component({
  components: {}
})
export default class FormSelect extends Vue {
  @Prop({ type: String, required: true })
  private rules!: string

  @Prop({ type: String, required: true })
  private labelMessage!: string

  @Prop({ type: String, required: true })
  private inputValue!: string

  @Prop({ type: Array, required: true })
  private options!: FormOption[]

  private get inputValueModel(): string {
    return this.inputValue
  }

  private set inputValueModel(val: string) {
    this.$emit('update:inputValue', val)
  }
}
</script>

<template>
  <dir>
    <form-number
      rules="required"
      label-message="最小人数"
      max="999"
      min="5"
      step="1"
      :input-value.sync="capacityMin"
    />
    <form-number
      rules="required"
      label-message="定員"
      max="999"
      min="5"
      step="1"
      :input-value.sync="capacityMax"
    />
    <b-field class="has-text-right">
      <b-button
        :disabled="!capacityMin || !capacityMax"
        size="is-small"
        @click="$emit('override')"
        type="is-primary"
        >人数ごとの編成を生成</b-button
      >
    </b-field>
    <form-input
      :rules="validationRules"
      label-message="編成"
      input-type="textarea"
      max-length="1004"
      place-holder-message="編成"
      :input-value.sync="inputValueModel"
    />
  </dir>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Skill from '~/components/type/skill'
import { contain_skills } from '~/components/create-village/form/organization-rules'
const formInput = () => import('~/components/common/validation/form-input.vue')
const formNumber = () =>
  import('~/components/common/validation/form-number.vue')

@Component({
  components: { formInput, formNumber }
})
export default class Organization extends Vue {
  @Prop({ type: String, required: true })
  private inputValue!: string

  @Prop({ type: Boolean, required: true })
  private availableDummySkill!: boolean

  @Prop({ type: Array, required: true })
  private skills!: Skill[]

  private capacityMin: string = '10'
  private capacityMax: string = '16'

  private get inputValueModel(): string {
    return this.inputValue
  }

  private set inputValueModel(val: string) {
    this.$emit('update:inputValue', val)
  }

  private createGeneralOrg(): string {
    const min = parseInt(this.capacityMin)
    const max = parseInt(this.capacityMax)
    const personNumArr: number[] = []
    for (let i = min; i <= max; i++) {
      personNumArr.push(i)
    }
    const org = personNumArr
      .map(personNum => {
        let str = '狼'
        if (personNum >= 9) str += '狼'
        if (personNum >= 13) str += '狼'
        str += '占'
        if (personNum >= 9) str += '霊狩狂'

        return `${personNum}人：${str.padEnd(personNum, '村')}`
      })
      .join('\n')
    return org
  }

  private get validationRules(): Object {
    return {
      required: true,
      max: 1004,
      contain_skills: this.skills,
      dummy_skill: this.availableDummySkill ? 1 : 0,
      person_num: true,
      person_minmax: true
    }
  }
}
</script>

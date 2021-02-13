<template>
  <validation-provider v-slot="{ errors }" rules="required" name="開始日時">
    <div class="container p-b-20">
      <b-field
        for="start_datetime"
        label="開始日時"
        :message="errors.length ? errors[0] : ''"
        :type="errors.length ? 'is-danger' : ''"
        horizontal
      >
        <b-datetimepicker
          v-model="inputValueModel"
          size="is-small"
          :min-datetime="startDatetimeMin"
          :max-datetime="startDatetimeMax"
          icon-pack="fas"
          :datepicker="datepickerProps"
          :timepicker="timepickerProps"
          :editable="false"
        >
        </b-datetimepicker>
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
export default class StartDatetime extends Vue {
  @Prop({ type: Date, required: true })
  private inputValue!: Date

  private get inputValueModel(): Date {
    // @ts-ignore
    return this.inputValue
  }

  private set inputValueModel(val: Date) {
    // @ts-ignore
    this.$emit('update:inputValue', val)
  }

  private get startDatetimeMin(): Date {
    // @ts-ignore
    return this.$dayjs().toDate()
  }

  private get startDatetimeMax(): Date {
    // @ts-ignore
    return this.$dayjs()
      .add(14, 'days')
      .toDate()
  }

  private get datepickerProps(): any {
    return {
      monthNames: [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月'
      ],
      dayNames: ['日', '月', '火', '水', '木', '金', '土']
    }
  }

  private get timepickerProps(): any {
    return {
      incrementMinutes: 30
    }
  }
}
</script>

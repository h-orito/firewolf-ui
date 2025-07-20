<template>
  <div class="m-b-20">
    <form-select
      rules="required"
      label-message="ダミーキャラ"
      :input-value.sync="inputValueModel"
      :options="charaOptions"
      @input="inputSelect($event)"
    />
    <div class="has-text-right">
      <b-button
        size="is-small"
        @click="isCharaSelectModalOpen = true"
        type="is-primary"
        >画像から選ぶ</b-button
      >
      <b-modal
        class="has-text-left"
        :active.sync="isCharaSelectModalOpen"
        has-modal-card
        trap-focus
        aria-role="dialog"
        aria-modal
      >
        <chara-select-modal
          :chara-list="charas"
          @chara-select="charaSelect($event)"
        />
      </b-modal>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import FormOption from '~/components/common/validation/option'
import Chara from '~/components/type/chara'

const formSelect = () =>
  import('~/components/common/validation/form-select.vue')
const charaSelectModal = () =>
  import('~/components/village/action/participate/chara-select-modal.vue')

@Component({
  components: { formSelect, charaSelectModal }
})
export default class DummyChara extends Vue {
  @Prop({ type: String, required: true })
  private inputValue!: string

  @Prop({ type: Array, required: true })
  private charas!: Chara[]

  private isCharaSelectModalOpen: boolean = false

  private get inputValueModel(): string {
    return this.inputValue
  }

  private set inputValueModel(val: string) {
    this.$emit('update:inputValue', val)
  }

  private get charaOptions(): FormOption[] {
    return this.charas.map((chara: Chara) => ({
      key: chara.id.toString(),
      label: chara.chara_name.name,
      value: chara.id.toString()
    }))
  }

  private charaSelect({ chara }): void {
    this.isCharaSelectModalOpen = false
    this.$emit('chara-select', { chara })
  }

  private inputSelect(charaId: string): void {
    const chara = this.charas.find(c => c.id === parseInt(charaId))
    this.$emit('chara-select', { chara })
  }
}
</script>

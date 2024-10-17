<template>
  <b-modal
    :active="isOpen"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
    :on-cancel="close"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left">年齢制限確認</p>
      </header>
      <section class="modal-card-body has-text-left">
        <p>
          この村は年齢制限が
          <strong class="is-size-4 has-text-danger">{{ ageLimit }}</strong>
          に設定されており、<br />
          暴力表現{{
            ageLimit === 'R18' ? 'や性描写' : ''
          }}などが含まれる可能性があります。
        </p>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="back">
          表示せず戻る
        </b-button>
        <b-button type="is-primary" size="is-small" @click="confirm"
          >表示する</b-button
        >
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// type
import Village from '~/components/type/village'
// component
import villageUserSettings from '~/components/village/user-settings/village-user-settings'
const formInput = () => import('~/components/common/validation/form-input.vue')
const formSwitch = () =>
  import('~/components/common/validation/form-switch.vue')

@Component({
  components: { formInput, formSwitch }
})
export default class ModalUserSettings extends Vue {
  @Prop({ type: Boolean })
  private isOpen!: boolean

  private get village(): Village | null {
    return this.$store.getters.getVillage
  }

  private get ageLimit(): string | null {
    return (
      this.village?.setting?.tags?.list?.find(t => t.startsWith('R')) ?? null
    )
  }

  private back(): void {
    this.$router.push('/')
  }

  private confirm(): void {
    const ageLimitSetting = villageUserSettings.getAgeLimit(this)
    if (
      ageLimitSetting.confirm_village_ids.some(
        id => parseInt(id) === this.village!.id
      )
    ) {
      this.close()
      return
    }
    const ids = ageLimitSetting.confirm_village_ids.concat(
      this.village!.id.toString()
    )
    villageUserSettings.setAgeLimit(this, {
      confirm_village_ids: ids
    })
    this.close()
  }

  private close(): void {
    this.$emit('close-modal')
  }
}
</script>

<style lang="scss" scoped>
/** header, footerを隠さない */
.modal-card {
  max-height: calc(100vh - 6.5rem);
}
</style>

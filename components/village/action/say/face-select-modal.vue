<template>
  <b-modal
    :active.sync="isOpen"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
  >
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">画像から選択</p>
      </header>
      <section class="modal-card-body">
        <div class="chara-select-content">
          <div
            v-for="face in faceList"
            :key="face.type"
            class="has-text-centered chara-select-box"
            @click="selected(face.type)"
          >
            <chara-image :chara="chara" :face-type="face.type" />
            <p class="is-size-7">{{ face.name }}</p>
          </div>
        </div>
      </section>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Chara from '~/components/type/chara'
import CharaFace from '~/components/type/chara-face'
const charaImage = () => import('~/components/village/chara-image.vue')

@Component({
  components: { charaImage }
})
export default class CharaSelectModal extends Vue {
  @Prop({ type: Boolean })
  private isOpen!: boolean

  @Prop({ type: Object })
  private chara!: Chara

  @Prop({ type: Array })
  private faceList!: CharaFace[]

  private selected(type: string): void {
    this.$emit('face-select', { type })
  }
}
</script>

<style lang="scss" scoped>
.chara-select-content {
  display: flex;
  flex-wrap: wrap;

  .chara-select-box {
    border: 1px solid #cccccc;
    border-radius: 16px;
    padding: 5px;
    margin: 5px auto;
    width: 160px;
  }
  .chara-select-box:hover {
    cursor: pointer;
    border: 1px solid $primary;
    font-weight: 700;
  }
}
</style>

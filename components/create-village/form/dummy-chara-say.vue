<template>
  <div class="m-b-20">
    <message-decorators
      :selector="`#${id}`"
      @decorate-message="inputValueModel = $event"
    />
    <div class="say-content-area">
      <div v-if="chara" class="say-face-area">
        <chara-image :chara="chara" face-type="NORMAL" />
      </div>
      <div class="say-input-area">
        <dummy-chara-message-input
          :id="id"
          :label="label"
          :value.sync="inputValueModel"
          :rules="rules"
          ref="messageInput"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import dummyCharaMessageInput from './dummy-chara-message-input.vue'
import messageDecorators from '~/components/village/action/decorator/message-decorators.vue'
import charaImage from '~/components/village/chara-image.vue'
import Chara from '~/components/type/chara'

@Component({
  components: { dummyCharaMessageInput, messageDecorators, charaImage }
})
export default class DummyCharaSay extends Vue {
  @Prop({ type: String, required: true })
  private id!: string

  @Prop({ type: String, required: true })
  private inputValue!: string

  @Prop({ type: Array, required: true })
  private charas!: Chara[]

  @Prop({ type: Number, required: true })
  private charaId!: number

  @Prop({ type: String })
  private label!: string

  @Prop({ type: String })
  private rules!: string

  private get inputValueModel(): string {
    return this.inputValue
  }

  private set inputValueModel(val: string) {
    this.$emit('update:inputValue', val)
  }

  private get chara(): Chara {
    return this.charas.find((chara: Chara) => chara.id === this.charaId)!
  }
}
</script>

<style lang="scss" scoped>
.say-content-area {
  display: flex;

  .say-face-area {
    padding-right: 5px;
  }

  .say-input-area {
    flex: 1;
  }
}
</style>

<style lang="scss">
.say-content-area {
  display: flex;

  .say-face-area {
    padding-right: 5px;

    img {
      cursor: pointer;
    }
  }
  .say-input-area {
    flex: 1;
  }
}
</style>

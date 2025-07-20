<template>
  <div class="m-b-5">
    <decorate-button @click="addTag('b')">
      <strong>B</strong>
    </decorate-button>
    <decorate-button @click="addTag('large')">
      大
    </decorate-button>
    <decorate-button @click="addTag('small')">
      <small>小</small>
    </decorate-button>
    <decorate-button @click="addTag('s')">
      <s>あ</s>
    </decorate-button>
    <decorate-button @click="addRubyTag">
      rb
    </decorate-button>
    <decorate-button @click="addTag('cw')">
      隠
    </decorate-button>
    <decorate-button @click="addTag('#ff0000', '#')">
      <span style="color: #ff0000">■</span>
    </decorate-button>
    <decorate-button @click="addTag('#ff8800', '#')">
      <span style="color: #ff8800">■</span>
    </decorate-button>
    <decorate-button @click="addTag('#ffff00', '#')">
      <span style="color: #ffff00">■</span>
    </decorate-button>
    <decorate-button @click="addTag('#00ff00', '#')">
      <span style="color: #00ff00">■</span>
    </decorate-button>
    <decorate-button @click="addTag('#00ffff', '#')">
      <span style="color: #00ffff">■</span>
    </decorate-button>
    <decorate-button @click="addTag('#0000ff', '#')">
      <span style="color: #0000ff">■</span>
    </decorate-button>
    <decorate-button @click="addTag('#ff00ff', '#')">
      <span style="color: #ff00ff">■</span>
    </decorate-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
const decorateButton = () => import('./decorate-button.vue')

@Component({
  components: { decorateButton }
})
export default class MessageDecorators extends Vue {
  @Prop({ type: String })
  private selector!: string

  private addTag(tagPrefix: string, tagSuffix: string = tagPrefix) {
    const textarea = document.querySelector(this.selector) as
      | HTMLTextAreaElement
      | undefined
    if (!textarea) return ''
    const currentText = textarea.value
    const selectionStart = textarea.selectionStart
    const selectionEnd = textarea.selectionEnd

    const replaced =
      currentText.slice(0, selectionStart) +
      `[[${tagPrefix}]]` +
      currentText.slice(selectionStart, selectionEnd) +
      `[[/${tagSuffix}]]` +
      currentText.slice(selectionEnd)

    this.$emit('decorate-message', replaced)
  }

  private addRubyTag() {
    const textarea = document.querySelector(this.selector) as
      | HTMLTextAreaElement
      | undefined
    if (!textarea) return ''
    const currentText = textarea.value
    const selectionStart = textarea.selectionStart
    const selectionEnd = textarea.selectionEnd

    const replaced =
      currentText.slice(0, selectionStart) +
      `[[ruby]]${currentText.slice(
        selectionStart,
        selectionEnd
      )}[[rt]][[/rt]][[/ruby]]` +
      currentText.slice(selectionEnd)

    this.$emit('decorate-message', replaced)
  }
}
</script>

<style lang="scss" scoped></style>

<style lang="scss"></style>

<template functional>
  <div
    class="hw-message-card"
    :class="[
      props.message.is_anchor_message ? 'anchor-message' : '',
      props.isDarkTheme ? 'dark-theme' : ''
    ]"
  >
    <div class="hw-message-name-area">
      <span v-if="props.message.is_disp_anchor">
        <a
          href="javascript:void(0);"
          @click="listeners['copy-anchor-string']"
          >{{ props.message.anchor_string }}</a
        >.&nbsp;</span
      >
      <p
        class="hw-message-datetime"
        :class="props.isDarkTheme ? 'dark-theme' : ''"
      >
        {{ props.message.is_anchor_message ? props.message.day + 'd' : '' }}
        {{ props.message.datetime }}
      </p>
    </div>
    <div class="hw-message-content-area">
      <div
        class="hw-message-text-area"
        :class="[
          props.message.message_class,
          props.isDarkTheme ? 'dark-theme' : ''
        ]"
      >
        <p class="hw-message-text">
          <span v-for="line in props.message.message_lines" :key="line.id"
            ><span v-for="sentence in line.sentences" :key="sentence.id">
              <a
                v-if="sentence.is_anchor"
                @click="listeners['click-anchor'](sentence.text)"
                v-html="sentence.text"
                href="javascript:void(0);"
              ></a
              ><span v-else v-html="sentence.text"></span>
            </span>
            <br
          /></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { SayMessage } from '~/components/village/message/message-converter'

@Component({})
export default class MessageSay extends Vue {
  @Prop({ type: Object })
  private message!: SayMessage

  @Prop({ type: Boolean })
  private isDarkTheme!: boolean

  @Prop({ type: Boolean })
  private isImgLarge!: boolean
}
</script>

<style lang="scss" scoped>
.hw-message-card {
  margin-bottom: 5px;

  &.anchor-message {
    margin-left: 50px;
    margin-bottom: 5px;
  }

  .hw-message-name-area {
    display: flex;

    p {
      margin-bottom: 0;
    }

    .hw-message-name {
      text-align: left;
      font-weight: bold;
    }

    .hw-message-datetime {
      margin-left: auto;
      text-align: right;
      color: #aaaaaa;

      &.dark-theme {
        color: #ddd;
      }
    }
  }
  .hw-message-content-area {
    display: flex;

    .hw-message-text-area {
      flex: 1;
      border: 1px solid #dddddd;
      border-radius: 5px;
      padding: 10px;
      font-family: sans-serif;

      .hw-message-text {
        text-align: left;
        word-break: break-word;
      }

      &.action-say {
        background-color: $action-say;

        &.dark-theme {
          border: 1px solid $white;
          background-color: $action-say-dark;
          color: $white;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.hw-message-text {
  a:not(.button):not(.is-current) {
    color: $primary !important;
    font-weight: bold;
  }
}
</style>

<template>
  <Modal v-model="isOpen" title="ログイン" @close="close">
    <div class="content">
      <p>いずれかのアカウントと連携してログインしてください。</p>
      <Alert type="warning" class="my-4 text-sm">
        <ul class="list-disc">
          <li>
            既存のアカウントに別のログイン方法を紐付けたい場合は、まず既存のアカウントでログインしてください。<br />
          </li>
          <li>
            ログインしたことがあるアカウントは後から追加で紐付けることができないので、ご注意ください。
          </li>
        </ul>
      </Alert>

      <div class="mt-6 mb-6">
        <hr class="mb-3" />
        <UButton color="primary" @click="signin('twitter')">
          <Icon name="fa6-brands:twitter" class="mt-0.5 mr-2" />
          Twitterログイン
        </UButton>
        <Alert class="my-4 text-sm">
          <ul class="list-disc">
            <li>エピローグでニックネームおよびTwitterのIDが公開されます。</li>
            <li>ニックネームはマイページで変更することができます。</li>
          </ul>
        </Alert>
      </div>

      <div class="my-6">
        <hr class="mb-3" />
        <UButton color="primary" @click="signin('google')">
          <Icon name="fa6-brands:google" class="mt-0.5 mr-2" />
          Googleログイン
        </UButton>
        <Alert class="my-4 text-sm">
          <ul class="list-disc">
            <li>エピローグでニックネームが公開されます。</li>
            <li>メールアドレスが表示されることはありません。</li>
          </ul>
        </Alert>
      </div>
    </div>

    <template #footer>
      <UButton color="neutral" variant="outline" size="sm" @click="close">
        閉じる
      </UButton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/Modal.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  signin: [provider: 'twitter' | 'google']
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const signin = (provider: 'twitter' | 'google') => {
  emit('signin', provider)
  close()
}

const close = () => {
  isOpen.value = false
}
</script>

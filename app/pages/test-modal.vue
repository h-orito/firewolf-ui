<template>
  <div class="p-8">
    <h1 class="mb-6 text-2xl font-bold">Modal Component Test</h1>

    <div class="space-y-6">
      <!-- 基本的なModal -->
      <div class="rounded-lg border p-4">
        <h2 class="mb-4 text-lg font-semibold">Basic Modal</h2>
        <UButton @click="showBasicModal = true">基本的なモーダルを開く</UButton>

        <Modal v-model="showBasicModal" title="基本的なモーダル">
          <div class="space-y-4">
            <p>これは基本的なモーダルです。</p>
            <p>コンテンツが表示されます。</p>
          </div>
          <template #footer>
            <UButton variant="outline" @click="showBasicModal = false"
              >キャンセル</UButton
            >
            <UButton @click="showBasicModal = false">OK</UButton>
          </template>
        </Modal>
      </div>

      <!-- ログインモーダル（現行再現） -->
      <div class="rounded-lg border p-4">
        <h2 class="mb-4 text-lg font-semibold">Login Modal (現行再現)</h2>
        <UButton @click="showLoginModal = true">ログインモーダルを開く</UButton>

        <Modal
          v-model="showLoginModal"
          title="ログイン"
          @close="handleLoginClose"
        >
          <div class="space-y-4">
            <p>いずれかのアカウントと連携してログインしてください。</p>
            <div class="mb-2 text-sm text-red-600">
              <p>
                既存のアカウントに別のログイン方法を紐付けたい場合は、まず既存のアカウントでログインしてください。
              </p>
              <p>
                ログインしたことがあるアカウントは後から追加で紐付けることができないので、ご注意ください。
              </p>
            </div>

            <div class="border-t pt-4">
              <div class="mb-4">
                <hr class="mb-3" />
                <UButton
                  color="blue"
                  size="sm"
                  class="mb-2"
                  @click="signinWithTwitter"
                >
                  Twitterログイン
                </UButton>
                <p class="text-sm text-gray-600">
                  エピローグでニックネームおよびTwitterのIDが公開されます。<br />
                  ニックネームはマイページで変更することができます。
                </p>
              </div>

              <div>
                <hr class="mb-3" />
                <UButton
                  color="blue"
                  size="sm"
                  class="mb-2"
                  @click="signinWithGoogle"
                >
                  Googleログイン
                </UButton>
                <p class="text-sm text-gray-600">
                  エピローグでニックネームが公開されます。<br />
                  ニックネームはマイページで変更することができます。<br />
                  メールアドレスが表示されることはありません。
                </p>
              </div>
            </div>
          </div>
          <template #footer>
            <UButton variant="outline" @click="showLoginModal = false"
              >閉じる</UButton
            >
          </template>
        </Modal>
      </div>

      <!-- 確認モーダル -->
      <div class="rounded-lg border p-4">
        <h2 class="mb-4 text-lg font-semibold">Confirmation Modal</h2>
        <UButton @click="showConfirmModal = true">確認モーダルを開く</UButton>

        <Modal v-model="showConfirmModal" title="確認">
          <div class="space-y-4">
            <p>この操作を実行してもよろしいですか？</p>
            <div class="rounded border border-yellow-200 bg-yellow-50 p-3">
              <p class="text-sm text-yellow-800">
                この操作は元に戻すことができません。
              </p>
            </div>
          </div>
          <template #footer>
            <UButton variant="outline" @click="showConfirmModal = false"
              >キャンセル</UButton
            >
            <UButton color="red" @click="confirmAction">実行</UButton>
          </template>
        </Modal>
      </div>

      <!-- カスタムタイトルスロット -->
      <div class="rounded-lg border p-4">
        <h2 class="mb-4 text-lg font-semibold">Custom Title Slot</h2>
        <UButton @click="showCustomTitleModal = true"
          >カスタムタイトルモーダルを開く</UButton
        >

        <Modal v-model="showCustomTitleModal">
          <template #title>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star" class="text-yellow-500" />
              <span>カスタムタイトル</span>
              <UBadge color="blue" size="xs">NEW</UBadge>
            </div>
          </template>

          <div class="space-y-4">
            <p>タイトル部分をカスタマイズしたモーダルです。</p>
            <div class="rounded border border-blue-200 bg-blue-50 p-3">
              <p class="text-sm text-blue-800">
                スロットを使用してタイトル部分をカスタマイズできます。
              </p>
            </div>
          </div>

          <template #footer>
            <UButton @click="showCustomTitleModal = false">閉じる</UButton>
          </template>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script setup>
import Modal from '~/components/ui/modal/Modal.vue'

const showBasicModal = ref(false)
const showLoginModal = ref(false)
const showConfirmModal = ref(false)
const showCustomTitleModal = ref(false)

const handleLoginClose = () => {
  console.log('ログインモーダルが閉じられました')
}

const signinWithTwitter = () => {
  console.log('Twitterでログイン')
  showLoginModal.value = false
}

const signinWithGoogle = () => {
  console.log('Googleでログイン')
  showLoginModal.value = false
}

const confirmAction = () => {
  console.log('操作が実行されました')
  showConfirmModal.value = false
}
</script>

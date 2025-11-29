<template>
  <div class="menu-area">
    <div class="mb-12">
      <p class="spotlight-shadow text-2xl">その他情報</p>
    </div>
    <div class="grid gap-4 md:grid-cols-2">
      <SpotlightButton href="https://twitter.com/ort_dev" target="_blank">
        <Icon name="twitter" class="mt-0.5 mr-2" />
        <strong>要望、改善提案、不具合報告</strong>
      </SpotlightButton>
      <SpotlightButton @click="openKampaModal">
        <Icon name="gift" class="mt-0.5 mr-2" />
        <strong>投げ銭</strong>
      </SpotlightButton>
      <SpotlightButton @click="openTermModal">
        <Icon name="book-open" class="mt-0.5 mr-2" />
        <strong>利用規約</strong>
      </SpotlightButton>
      <SpotlightButton @click="openPolicyModal">
        <Icon name="book-open" class="mt-0.5 mr-2" />
        <strong>プライバシーポリシー</strong>
      </SpotlightButton>
    </div>

    <!-- モーダル -->
    <KampaModal
      :open="isKampaModalOpen"
      @update:open="isKampaModalOpen = $event"
    />
    <TermModal
      :open="isTermModalOpen"
      @update:open="isTermModalOpen = $event"
    />
    <PolicyModal
      :open="isPolicyModalOpen"
      @update:open="isPolicyModalOpen = $event"
    />
  </div>
</template>

<script setup lang="ts">
import KampaModal from '~/components/layout/KampaModal.vue'
import TermModal from '~/components/layout/TermModal.vue'
import PolicyModal from '~/components/layout/PolicyModal.vue'
import SpotlightButton from './SpotlightButton.vue'

const isKampaModalOpen = ref(false)
const isTermModalOpen = ref(false)
const isPolicyModalOpen = ref(false)

const openKampaModal = () => {
  isKampaModalOpen.value = true
}

const openTermModal = () => {
  isTermModalOpen.value = true
}

const openPolicyModal = () => {
  isPolicyModalOpen.value = true
}
</script>

<style scoped>
.menu-area {
  background: linear-gradient(#0a0a1a 0%, #112 50%, #0a0a1a 100%);
  color: white;
  padding: 30px;
  margin-bottom: 50px;
}

.menu-area:last-child {
  margin-bottom: 0;
}
</style>

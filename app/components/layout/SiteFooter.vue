<template>
  <div class="site-footer">
    <div class="menu-area">
      <div class="mb-12">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center shadow-text">
          その他情報
        </h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <!-- Twitter -->
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          icon="i-simple-icons-x"
          class="justify-center shadow-text"
          :to="'https://twitter.com/ort_dev'"
          target="_blank"
          external
        >
          <span class="font-semibold">要望、改善提案、不具合報告</span>
        </UButton>

        <!-- Donation -->
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          icon="i-lucide-heart"
          class="justify-center shadow-text"
          @click="openKampaModal"
        >
          <span class="font-semibold">投げ銭</span>
        </UButton>

        <!-- Terms -->
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          icon="i-lucide-book-open"
          class="justify-center shadow-text"
          @click="openTermModal"
        >
          <span class="font-semibold">利用規約</span>
        </UButton>

        <!-- Privacy Policy -->
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          icon="i-lucide-shield-check"
          class="justify-center shadow-text"
          @click="openPolicyModal"
        >
          <span class="font-semibold">プライバシーポリシー</span>
        </UButton>
      </div>
    </div>

    <!-- Modals - TODO: Implement in future phase -->
    <!-- <KampaModal v-model:open="isKampaModalOpen" />
    <TermModal v-model:open="isTermModalOpen" />
    <PolicyModal v-model:open="isPolicyModalOpen" /> -->
  </div>
</template>

<script setup lang="ts">
// Modal states
const isKampaModalOpen = ref(false)
const isTermModalOpen = ref(false)
const isPolicyModalOpen = ref(false)

// Modal open handlers
const openKampaModal = () => {
  isKampaModalOpen.value = true
}

const openTermModal = () => {
  isTermModalOpen.value = true
}

const openPolicyModal = () => {
  isPolicyModalOpen.value = true
}

// TODO: Dynamic imports for modals - implement in future phase
// const KampaModal = defineAsyncComponent(() => import('./KampaModal.vue'))
// const TermModal = defineAsyncComponent(() => import('./TermModal.vue'))
// const PolicyModal = defineAsyncComponent(() => import('./PolicyModal.vue'))
</script>

<style scoped>
.site-footer {
  padding: 2rem 1rem;
}

.menu-area {
  max-width: 1200px;
  margin: 0 auto;
}

.shadow-text {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Dark mode adjustments */
.dark .shadow-text {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
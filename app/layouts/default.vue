<template>
  <div class="site min-h-screen">
    <!-- Google Ads -->
    <GoogleAds />

    <!-- Navbar background area -->
    <div class="h-14 w-full bg-black" />

    <!-- Navigation Bar -->
    <NavBar />

    <!-- Site Content -->
    <div class="siteContent text-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// Dynamic imports for components
const GoogleAds = defineAsyncComponent(
  () => import('../components/layout/GoogleAds.vue')
)
const NavBar = defineAsyncComponent(
  () => import('../components/layout/NavBar.vue')
)
</script>

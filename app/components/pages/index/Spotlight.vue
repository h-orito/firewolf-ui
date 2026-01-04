<template>
  <div class="relative bg-[#0a0a1a]">
    <img src="/image/top.jpg" alt="top_image" class="w-full" loading="eager" />
    <div class="absolute top-[40%] right-[2%] hidden text-left md:block">
      <p
        class="spotlight-intro spotlight-shadow text-6xl leading-[2em] text-white"
      >
        勝つのは<br />
        <span class="spotlight-strong">人</span>か
        <span class="spotlight-strong">狼</span>か
      </p>
    </div>
    <div class="absolute right-[2%] bottom-[20%] block text-left md:hidden">
      <p
        class="spotlight-intro spotlight-shadow text-2xl leading-[2em] text-white"
      >
        勝つのは<br />
        <span class="spotlight-strong">人</span>か
        <span class="spotlight-strong">狼</span>か
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.spotlight-shadow {
  text-shadow:
    2px 2px 5px rgba(97, 69, 69, 1),
    -2px 2px 5px rgba(97, 69, 69, 1),
    2px -2px 5px rgba(97, 69, 69, 1),
    -2px -2px 5px rgba(97, 69, 69, 1);
}

.spotlight-intro {
  font-family:
    '游明朝', YuMincho, 'Hiragino Mincho ProN W3', 'ヒラギノ明朝 ProN W3',
    'Hiragino Mincho ProN', 'HG明朝E', 'ＭＳ Ｐ明朝', 'ＭＳ 明朝', serif;
}

.spotlight-strong {
  font-weight: 700;
  color: #ff0000;
  text-shadow:
    2px 2px 5px rgba(180, 180, 180, 1),
    -2px 2px 5px rgba(180, 180, 180, 1),
    2px -2px 5px rgba(180, 180, 180, 1),
    -2px -2px 5px rgba(180, 180, 180, 1);
}
</style>

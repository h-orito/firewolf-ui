<template>
  <div>
    <section class="bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <h1 class="mb-4 text-xl font-semibold">
          キャラチップ: {{ charachip ? charachip.name : '' }}
        </h1>

        <!-- キャラチップ情報 -->
        <div v-if="charachip" class="mb-5">
          <p class="text-sm text-gray-700">
            作者: {{ charachip.designer.name }}
          </p>
          <a
            :href="charachip.description_url"
            target="_blank"
            class="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            作者HP
          </a>
          <p class="text-sm text-gray-700">
            名前変更: {{ charachip.is_available_change_name ? '可能' : '不可' }}
          </p>
        </div>

        <div class="text-sm">
          <!-- ローディング表示 -->
          <Loading
            v-if="loadingCharachip"
            :message="'キャラチップを読み込み中...'"
          />

          <!-- キャラクター一覧 -->
          <div
            v-if="!loadingCharachip && charachip"
            class="flex flex-wrap justify-center gap-4"
          >
            <div
              v-for="chara in charachip.chara_list"
              :key="chara.id"
              class="rounded-2xl border border-gray-300 bg-white p-3 text-center shadow-sm"
              style="width: 300px"
            >
              <!-- キャラクター画像（全ての表情を表示） -->
              <div class="mb-2 flex justify-center gap-1">
                <VillageCharaImage
                  v-for="face in chara.face_list"
                  :key="face.type"
                  :chara="chara"
                  :face-type="face.type"
                />
              </div>
              <p class="text-xs">{{ chara.chara_name.name }}</p>
            </div>
          </div>

          <!-- エラー表示 -->
          <div
            v-if="!loadingCharachip && !charachip"
            class="rounded-lg bg-white p-8 shadow"
          >
            <div class="text-center text-gray-500">
              <p>キャラチップが見つかりませんでした</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { CharachipView } from '~/lib/api/types'
import VillageCharaImage from '~/components/pages/village/CharaImage.vue'

// ルートパラメータからID取得
const route = useRoute()
const charachipId = computed(() => route.query.id as string | undefined)

// SEO設定
const charachip = ref<CharachipView | null>(null)
useHead({
  title: computed(() =>
    charachip.value ? `キャラチップ: ${charachip.value.name}` : 'キャラチップ'
  )
})

// データ
const loadingCharachip = ref(false)

// データ取得
onMounted(async () => {
  if (!charachipId.value) {
    console.error('キャラチップIDが指定されていません')
    return
  }

  loadingCharachip.value = true
  try {
    const { apiCall } = useApi()
    const response = await apiCall<CharachipView>(
      `/charachips/${charachipId.value}`
    )
    charachip.value = response
  } catch (error) {
    console.error('キャラチップの取得に失敗しました:', error)
    charachip.value = null
  } finally {
    loadingCharachip.value = false
  }
})
</script>

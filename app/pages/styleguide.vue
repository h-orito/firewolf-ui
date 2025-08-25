<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        FIREWOLF コンポーネントスタイルガイド
      </h1>

      <!-- カラーパレット -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          カラーパレット
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="space-y-2">
            <div
              class="h-20 bg-primary rounded-lg flex items-center justify-center text-white"
            >
              Primary
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">bg-primary</p>
          </div>
          <div class="space-y-2">
            <div
              class="h-20 bg-info rounded-lg flex items-center justify-center text-white"
            >
              Info
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">bg-info</p>
          </div>
          <div class="space-y-2">
            <div
              class="h-20 bg-success rounded-lg flex items-center justify-center text-white"
            >
              Success
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">bg-success</p>
          </div>
          <div class="space-y-2">
            <div
              class="h-20 bg-warning rounded-lg flex items-center justify-center text-gray-900"
            >
              Warning
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">bg-warning</p>
          </div>
          <div class="space-y-2">
            <div
              class="h-20 bg-danger rounded-lg flex items-center justify-center text-white"
            >
              Danger
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">bg-danger</p>
          </div>
          <div class="space-y-2">
            <div
              class="h-20 bg-light rounded-lg flex items-center justify-center text-gray-900 border"
            >
              Light
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">bg-light</p>
          </div>
          <div class="space-y-2">
            <div
              class="h-20 bg-dark rounded-lg flex items-center justify-center text-white"
            >
              Dark
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">bg-dark</p>
          </div>
        </div>
      </section>

      <!-- ボタン -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          ボタン
        </h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              バリアント
            </h3>
            <div class="flex flex-wrap gap-2">
              <UButton>Default</UButton>
              <UButton color="primary">Primary</UButton>
              <UButton color="neutral" variant="ghost">Ghost</UButton>
              <UButton color="neutral" variant="link">Link</UButton>
              <UButton variant="soft">Soft</UButton>
              <UButton variant="outline">Outline</UButton>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              サイズ
            </h3>
            <div class="flex flex-wrap gap-2 items-center">
              <UButton size="xs">Extra Small</UButton>
              <UButton size="sm">Small</UButton>
              <UButton size="md">Medium</UButton>
              <UButton size="lg">Large</UButton>
              <UButton size="xl">Extra Large</UButton>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              アイコン付き
            </h3>
            <div class="flex flex-wrap gap-2">
              <UButton icon="i-heroicons-home">ホーム</UButton>
              <UButton icon="i-heroicons-cog-6-tooth" trailing>設定</UButton>
              <UButton icon="i-heroicons-arrow-path" loading
                >読み込み中</UButton
              >
            </div>
          </div>
        </div>
      </section>

      <!-- フォーム要素 -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          フォーム要素
        </h2>
        <div class="space-y-6 max-w-md">
          <UFormGroup label="テキスト入力" help="ヘルプテキスト">
            <UInput placeholder="テキストを入力" />
          </UFormGroup>

          <UFormGroup label="セレクトボックス">
            <USelect
              :options="[
                { label: 'オプション1', value: '1' },
                { label: 'オプション2', value: '2' },
                { label: 'オプション3', value: '3' }
              ]"
              placeholder="選択してください"
            />
          </UFormGroup>

          <UFormGroup label="テキストエリア">
            <UTextarea placeholder="複数行のテキスト" :rows="4" />
          </UFormGroup>

          <UFormGroup label="チェックボックス">
            <UCheckbox label="同意する" />
          </UFormGroup>

          <UFormGroup label="ラジオボタン">
            <URadioGroup
              v-model="selectedRadio"
              :options="[
                { label: 'オプション1', value: '1' },
                { label: 'オプション2', value: '2' },
                { label: 'オプション3', value: '3' }
              ]"
            />
          </UFormGroup>

          <UFormGroup label="トグル">
            <UToggle />
          </UFormGroup>
        </div>
      </section>

      <!-- カード -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          カード
        </h2>
        <div class="grid md:grid-cols-2 gap-4">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">カードヘッダー</h3>
            </template>
            <p>カードの本文です。ここに内容が入ります。</p>
            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton variant="ghost">キャンセル</UButton>
                <UButton>確認</UButton>
              </div>
            </template>
          </UCard>

          <UCard>
            <img
              src="https://via.placeholder.com/400x200"
              alt="サンプル画像"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2">画像付きカード</h3>
              <p class="text-gray-600 dark:text-gray-400">
                画像を含むカードの例です。
              </p>
            </div>
          </UCard>
        </div>
      </section>

      <!-- モーダル -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          モーダル
        </h2>
        <div class="flex gap-2">
          <UButton @click="isModalOpen = true">モーダルを開く</UButton>
          <UModal v-model:open="isModalOpen">
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">モーダルタイトル</h3>
              </template>
              <p>モーダルの内容がここに表示されます。</p>
              <template #footer>
                <div class="flex justify-end gap-2">
                  <UButton variant="ghost" @click="isModalOpen = false">
                    閉じる
                  </UButton>
                  <UButton @click="isModalOpen = false">確認</UButton>
                </div>
              </template>
            </UCard>
          </UModal>
        </div>
      </section>

      <!-- アラート・通知 -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          アラート・通知
        </h2>
        <div class="space-y-4">
          <!-- Alertコンポーネント -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              通知コンポーネント
            </h3>
            <div class="space-y-2">
              <!-- デフォルト通知 -->
              <Alert type="default">
                <ul class="list-disc list-inside space-y-1">
                  <li>これはデフォルトの通知です</li>
                  <li>リスト形式で表示されます</li>
                </ul>
              </Alert>

              <!-- Info通知（死亡通知など） -->
              <Alert type="info" description="あなたは死亡しました。" />

              <!-- 村人通知 -->
              <Alert type="default">
                <p class="mb-1">あなたは村人です。</p>
                <p>特別な能力はありません。</p>
              </Alert>

              <!-- Warning通知 -->
              <Alert type="warning">
                <ul class="list-disc list-inside space-y-1">
                  <li>参加パスワードが毎回空になるのでご注意ください。</li>
                </ul>
              </Alert>

              <!-- Success通知 -->
              <Alert
                type="success"
                icon="i-heroicons-check-circle"
                title="成功"
                description="操作が正常に完了しました。"
              />

              <!-- Error通知 -->
              <Alert
                type="error"
                icon="i-heroicons-x-circle"
                title="エラー"
                description="エラーが発生しました。"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- バッジ -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          バッジ
        </h2>
        <div class="flex flex-wrap gap-2">
          <UBadge>Default</UBadge>
          <UBadge color="success">Success</UBadge>
          <UBadge color="warning">Warning</UBadge>
          <UBadge color="error">Danger</UBadge>
          <UBadge variant="outline">Outline</UBadge>
          <UBadge variant="soft">Soft</UBadge>
          <UBadge variant="subtle">Subtle</UBadge>
        </div>
      </section>

      <!-- ローディング -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          ローディング
        </h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              スピナー
            </h3>
            <div class="flex gap-4">
              <Loading />
              <Loading size="sm" />
              <Loading size="lg" />
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              スケルトン
            </h3>
            <div class="space-y-2">
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-3/4" />
              <USkeleton class="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </section>

      <!-- 人狼ゲーム専用コンポーネント -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          人狼ゲーム専用コンポーネント
        </h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              キャラクター画像
            </h3>
            <div class="flex gap-4">
              <PagesVillageCharaImage
                :chara="sampleChara1"
                face-type="NORMAL"
              />
              <PagesVillageCharaImage
                :chara="sampleChara2"
                face-type="NORMAL"
                :is-small="true"
              />
              <PagesVillageCharaImage
                :chara="sampleChara1"
                face-type="NORMAL"
                :is-large="true"
              />
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              メッセージカード
            </h3>
            <!-- test-message-card.vueから正しい実装をコピー -->
            <PagesVillageMessageCard
              :message="{
                from: {
                  id: 1,
                  name: 'アルフレッド',
                  chara_name: {
                    name: 'アルフレッド',
                    short_name: 'ア',
                    full_name: 'アルフレッド'
                  },
                  chara: {
                    id: 1,
                    chara_name: {
                      name: 'アルフレッド',
                      short_name: 'ア',
                      full_name: 'アルフレッド'
                    },
                    charachip_id: 1,
                    face_list: [
                      {
                        type: 'NORMAL',
                        name: '通常',
                        image_url: 'https://wolfort.net/wmansion/6/000_A.png'
                      }
                    ],
                    display: {
                      width: 50,
                      height: 77
                    },
                    default_message: {
                      join_message: '参加しました',
                      first_day_message: 'よろしくお願いします'
                    }
                  },
                  player: {
                    id: 1,
                    nickname: 'プレイヤー1',
                    twitter_user_name: 'player1'
                  },
                  spectator: false,
                  status: { lover_id_list: [] },
                  comming_outs: { list: [] }
                },
                from_character_name: {
                  name: 'アルフレッド',
                  short_name: 'ア',
                  full_name: 'アルフレッド'
                },
                time: {
                  unix_time_milli: 1609459200000,
                  datetime: '2025/08/25 09:00:00',
                  village_day_id: 1,
                  day: 1
                },
                content: {
                  type: {
                    code: 'NORMAL_SAY',
                    name: '通常発言',
                    is_say_type: true,
                    is_owl_viewable_type: false
                  },
                  text: 'おはようございます。これはメッセージカードの例です。',
                  num: 1,
                  count: 1,
                  face_code: 'NORMAL'
                }
              }"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CharaView } from '~/lib/api/types'

const selectedRadio = ref('1')
const isModalOpen = ref(false)

// サンプルキャラクターデータ
const sampleChara1: CharaView = {
  id: 1,
  chara_name: {
    name: 'キャラクター1',
    short_name: 'キャラ1',
    full_name: 'キャラクター1'
  },
  charachip_id: 1,
  face_list: [
    {
      type: 'NORMAL',
      name: '通常',
      image_url: 'https://wolfort.net/wmansion/6/000_A.png'
    }
  ],
  display: {
    width: 50,
    height: 77
  },
  default_message: {
    join_message: '参加しました',
    first_day_message: 'よろしくお願いします'
  }
}

const sampleChara2: CharaView = {
  id: 2,
  chara_name: {
    name: 'キャラクター2',
    short_name: 'キャラ2',
    full_name: 'キャラクター2'
  },
  charachip_id: 1,
  face_list: [
    {
      type: 'NORMAL',
      name: '通常',
      image_url: 'https://wolfort.net/wmansion/6/001_B.png'
    }
  ],
  display: {
    width: 50,
    height: 77
  },
  default_message: {
    join_message: '参加しました',
    first_day_message: 'よろしくお願いします'
  }
}
</script>

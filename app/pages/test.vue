<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">@nuxt/ui コンポーネントテスト</h1>

    <!-- Primary color test -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">カスタムプライマリカラー</h2>
      <div class="bg-primary text-white p-4 rounded mb-2">
        プライマリカラー (#3991f4)
      </div>
      <div class="bg-primary-dark text-white p-4 rounded">
        プライマリダークカラー (rgb(20, 180, 255))
      </div>
    </div>

    <!-- @nuxt/ui components -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">@nuxt/ui コンポーネント</h2>

      <!-- Alerts -->
      <div class="space-y-4 mb-6">
        <UAlert
          icon="i-heroicons-information-circle"
          title="Information"
          description="This is an information alert"
          color="primary"
        />
        <UAlert
          icon="i-heroicons-check-circle"
          title="Success"
          description="This is a success alert"
          color="green"
        />
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          title="Warning"
          description="This is a warning alert"
          color="yellow"
        />
      </div>

      <!-- Buttons -->
      <div class="space-x-2 mb-6">
        <UButton color="primary" variant="solid">Primary</UButton>
        <UButton color="neutral" variant="outline">Secondary</UButton>
        <UButton color="error" variant="soft">Danger</UButton>
        <UButton color="success" variant="ghost">Success</UButton>
      </div>

      <!-- Card -->
      <UCard class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold">Card Header</h3>
        </template>

        <p>This is a card content area with some example text.</p>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton variant="outline" size="sm">Cancel</UButton>
            <UButton color="primary" size="sm">Save</UButton>
          </div>
        </template>
      </UCard>

      <!-- Input -->
      <div class="mb-6">
        <UInput placeholder="Type something..." />
      </div>

      <!-- Badge -->
      <div class="mb-6">
        <UBadge color="primary" variant="solid">Badge</UBadge>
        <UBadge color="green" variant="soft" class="ml-2">Success</UBadge>
        <UBadge color="red" variant="outline" class="ml-2">Error</UBadge>
      </div>
    </div>

    <!-- 人狼ゲーム固有の色テスト -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">人狼ゲーム固有カラー</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Say colors -->
        <div>
          <h3 class="font-bold mb-2">発言色</h3>
          <div class="space-y-2">
            <div class="bg-say-normal border p-3 rounded">通常発言</div>
            <div class="bg-say-werewolf p-3 rounded">人狼発言</div>
            <div class="bg-say-sympathize p-3 rounded">共鳴発言</div>
            <div class="bg-say-grave p-3 rounded">墓場発言</div>
            <div class="bg-say-spectate p-3 rounded">見学発言</div>
            <div class="bg-say-action p-3 rounded">アクション発言</div>
            <div class="bg-say-monologue p-3 rounded">独り言</div>
          </div>
        </div>

        <!-- System colors -->
        <div>
          <h3 class="font-bold mb-2">システムメッセージ色</h3>
          <div class="space-y-2">
            <div
              class="bg-system-private-bg border-system-private-border border-l-4 p-3 rounded"
            >
              プライベートシステム
            </div>
            <div
              class="bg-system-seer-bg border-system-seer-border border-l-4 p-3 rounded"
            >
              占い師システム
            </div>
            <div
              class="bg-system-werewolf-bg border-system-werewolf-border border-l-4 p-3 rounded"
            >
              人狼システム
            </div>
            <div
              class="bg-system-mason-bg border-system-mason-border border-l-4 p-3 rounded"
            >
              共鳴者システム
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Firebase認証テスト -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Firebase認証テスト</h2>

      <div class="space-y-4">
        <!-- 認証状態表示 -->
        <div class="p-4 border rounded-lg">
          <h3 class="font-bold mb-2">認証状態</h3>
          <div class="space-y-2">
            <p>
              <span class="font-semibold">ログイン状態:</span>
              <UBadge :color="isAuthenticated ? 'green' : 'red'" class="ml-2">
                {{ isAuthenticated ? 'ログイン中' : '未ログイン' }}
              </UBadge>
            </p>
            <p v-if="authUser">
              <span class="font-semibold">ユーザーID:</span>
              <code class="ml-2">{{ authUser.uid }}</code>
            </p>
            <p v-if="authUser">
              <span class="font-semibold">Email:</span>
              <span class="ml-2">{{ authUser.email || '未設定' }}</span>
            </p>
            <p>
              <span class="font-semibold">読み込み状態:</span>
              <UBadge :color="authLoading ? 'yellow' : 'gray'" class="ml-2">
                {{ authLoading ? '読み込み中...' : '完了' }}
              </UBadge>
            </p>
          </div>
        </div>

        <!-- 認証操作ボタン -->
        <div class="flex space-x-4 flex-wrap gap-2">
          <UButton
            :loading="isSigningIn"
            color="blue"
            :disabled="isAuthenticated"
            icon="i-simple-icons-google"
            @click="handleGoogleSignIn"
          >
            Googleでログイン
          </UButton>
          <UButton
            :loading="isSigningIn"
            color="gray"
            :disabled="isAuthenticated"
            icon="i-simple-icons-x"
            @click="handleTwitterSignIn"
          >
            X(Twitter)でログイン
          </UButton>
          <UButton
            :loading="isSigningOut"
            color="red"
            variant="outline"
            :disabled="!isAuthenticated"
            @click="handleLogout"
          >
            ログアウト
          </UButton>
        </div>

        <!-- 認証テスト結果 -->
        <div v-if="authTestResults.length > 0" class="mt-4">
          <h3 class="font-bold mb-2">認証テスト結果</h3>
          <div class="space-y-2">
            <UAlert
              v-for="(result, index) in authTestResults"
              :key="index"
              :icon="
                result.success
                  ? 'i-heroicons-check-circle'
                  : 'i-heroicons-x-circle'
              "
              :title="result.action"
              :description="result.message"
              :color="result.success ? 'green' : 'red'"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- API通信テスト -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">API通信テスト</h2>

      <div class="space-y-4">
        <div class="flex space-x-4">
          <UButton
            :loading="isTestingPublic"
            color="primary"
            @click="testPublicAPI"
          >
            パブリックAPI テスト (/health)
          </UButton>
          <UButton
            :loading="isTestingAuth"
            color="green"
            :disabled="!isAuthenticated"
            @click="testAuthenticatedAPI"
          >
            認証付きAPI テスト (/player)
          </UButton>
        </div>

        <div v-if="apiTestResults.length > 0" class="mt-4">
          <h3 class="font-bold mb-2">テスト結果</h3>
          <div class="space-y-2">
            <UAlert
              v-for="(result, index) in apiTestResults"
              :key="index"
              :icon="
                result.success
                  ? 'i-heroicons-check-circle'
                  : 'i-heroicons-x-circle'
              "
              :title="result.endpoint"
              :description="result.message"
              :color="result.success ? 'green' : 'red'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { apiCall } = useApi()
const {
  user: authUser,
  isAuthenticated,
  isLoading: authLoading,
  signInWithGoogle,
  signInWithTwitter,
  logout
} = useAuthStore()

// API通信テスト
const isTestingPublic = ref(false)
const isTestingAuth = ref(false)
const apiTestResults = ref([])

// 認証テスト
const isSigningIn = ref(false)
const isSigningOut = ref(false)
const authTestResults = ref([])

// パブリックAPIテスト
const testPublicAPI = async () => {
  isTestingPublic.value = true
  try {
    await apiCall('/health')
    apiTestResults.value.unshift({
      endpoint: 'GET /health',
      success: true,
      message: 'パブリックAPI呼び出し成功'
    })
  } catch (error) {
    apiTestResults.value.unshift({
      endpoint: 'GET /health',
      success: false,
      message: `エラー: ${error.message || error}`
    })
  } finally {
    isTestingPublic.value = false
  }
}

// 認証付きAPIテスト
const testAuthenticatedAPI = async () => {
  isTestingAuth.value = true
  try {
    await apiCall('/player')
    apiTestResults.value.unshift({
      endpoint: 'GET /player',
      success: true,
      message: '認証付きAPI呼び出し成功'
    })
  } catch (error) {
    apiTestResults.value.unshift({
      endpoint: 'GET /player',
      success: false,
      message: `エラー: ${error.message || error}`
    })
  } finally {
    isTestingAuth.value = false
  }
}

// 認証テスト関数
const handleGoogleSignIn = async () => {
  isSigningIn.value = true
  try {
    await signInWithGoogle()
    authTestResults.value.unshift({
      action: 'Googleログイン',
      success: true,
      message: 'Googleログイン成功'
    })
  } catch (error) {
    authTestResults.value.unshift({
      action: 'Googleログイン',
      success: false,
      message: `エラー: ${error.message || error}`
    })
  } finally {
    isSigningIn.value = false
  }
}

const handleTwitterSignIn = async () => {
  isSigningIn.value = true
  try {
    await signInWithTwitter()
    authTestResults.value.unshift({
      action: 'X(Twitter)ログイン',
      success: true,
      message: 'X(Twitter)ログイン成功'
    })
  } catch (error) {
    authTestResults.value.unshift({
      action: 'X(Twitter)ログイン',
      success: false,
      message: `エラー: ${error.message || error}`
    })
  } finally {
    isSigningIn.value = false
  }
}

const handleLogout = async () => {
  isSigningOut.value = true
  try {
    await logout()
    authTestResults.value.unshift({
      action: 'ログアウト',
      success: true,
      message: 'ログアウト成功'
    })
  } catch (error) {
    authTestResults.value.unshift({
      action: 'ログアウト',
      success: false,
      message: `エラー: ${error.message || error}`
    })
  } finally {
    isSigningOut.value = false
  }
}

useHead({
  title: '@nuxt/ui Component Test - FIREWOLF'
})
</script>

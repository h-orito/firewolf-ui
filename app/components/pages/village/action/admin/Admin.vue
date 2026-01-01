<template>
  <ActionPanel title="管理メニュー" panel-key="admin">
    <!-- 参加者がいない場合 -->
    <p
      v-if="!participantList.length"
      class="text-center text-gray-500 dark:text-gray-400"
    >
      参加者がいません
    </p>

    <!-- 参加者テーブル -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
              キャラ名
            </th>
            <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
              Twitter
            </th>
            <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
              役職
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in participantList"
            :key="p.name"
            class="border-t border-gray-200 dark:border-gray-600"
          >
            <td class="px-4 py-2">{{ p.name }}</td>
            <td class="px-4 py-2">
              <a
                v-if="p.twitter_user_name"
                :href="`https://twitter.com/${p.twitter_user_name}`"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline dark:text-[#14b4ff]"
              >
                {{ p.nickname }}@{{ p.twitter_user_name }}
              </a>
              <span v-else>{{ p.nickname }}</span>
            </td>
            <td class="px-4 py-2">{{ p.skill_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </ActionPanel>
</template>

<script setup lang="ts">
import ActionPanel from '../ActionPanel.vue'
import { useSituation } from '~/composables/village/useSituation'

// Composables
const { situation } = useSituation()

// 参加者一覧
const participantList = computed(
  () => situation.value?.admin.participant_list ?? []
)
</script>

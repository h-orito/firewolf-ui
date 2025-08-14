import { apiClient } from './client'
import type { Skill, SkillsResponse } from '@/types/skill'

export async function getSkillList(): Promise<Skill[] | null> {
  const { data, error } = await apiClient.GET('/skill/list')

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (error) {
    throw new Error('Failed to fetch skill list')
  }

  return data.list
}

export const skillApi = {
  getSkills: async (): Promise<{ data: SkillsResponse }> => {
    const { data, error } = await apiClient.GET('/skill/list')

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (error) {
      throw new Error('Failed to fetch skills')
    }

    return { data }
  },
}

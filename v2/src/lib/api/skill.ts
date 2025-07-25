import { apiClient } from './client'
import type { Skill, SkillsResponse } from '@/types/skill'

export async function getSkillList(): Promise<Skill[] | null> {
  const { data, error } = await apiClient.GET('/skill/list')

  if (error || !data) {
    console.error('Failed to fetch skill list:', error)
    return null
  }

  return data.list
}

export const skillApi = {
  getSkills: async (): Promise<{ data: SkillsResponse }> => {
    const { data, error } = await apiClient.GET('/skill/list')

    if (error || !data) {
      throw new Error('Failed to fetch skills')
    }

    return { data: data as SkillsResponse }
  },
}

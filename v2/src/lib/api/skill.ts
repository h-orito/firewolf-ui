import { apiClient } from './client'
import type { Skill } from '@/types/skill'

export async function getSkillList(): Promise<Skill[] | null> {
  const { data, error } = await apiClient.GET('/skill/list')

  if (error || !data) {
    console.error('Failed to fetch skill list:', error)
    return null
  }

  return data.list
}

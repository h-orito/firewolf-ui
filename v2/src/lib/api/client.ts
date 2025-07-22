import createClient from 'openapi-fetch'
import type { paths } from '@/types/generated/api'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8087/firewolf'

export const apiClient = createClient<paths>({ baseUrl: apiBaseUrl })

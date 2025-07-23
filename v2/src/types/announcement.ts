export interface Announcement {
  id: number
  title: string
  content: string
  date: string
  version?: string
  type: 'feature' | 'bug-fix' | 'improvement' | 'announcement'
}

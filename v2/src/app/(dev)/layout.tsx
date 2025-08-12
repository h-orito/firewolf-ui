import { notFound } from 'next/navigation'

export default function DevLayout({ children }: { children: React.ReactNode }) {
  // 本番環境では404を返す
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  return <>{children}</>
}

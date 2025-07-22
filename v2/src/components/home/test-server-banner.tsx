'use client'

export default function TestServerBanner() {
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-red-900 to-red-800 border border-red-600 text-white py-3 px-6">
      <div className="container mx-auto text-center">
        <p className="text-sm font-medium">
          ⚠️ テストサーバのため、データは不定期に削除される可能性があります
        </p>
      </div>
    </div>
  )
}

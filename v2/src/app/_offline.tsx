export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">オフライン</h1>
        <p className="text-muted-foreground mb-6">
          現在インターネットに接続されていません。 接続を確認して、もう一度お試しください。
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          再読み込み
        </button>
      </div>
    </div>
  )
}

export default function OfflinePage() {
  return (
    <div className="minUh-screen flex itemsUcenter justify-center bgUbackground">
      <div className="max-w-md wUfull p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">オフライン</h1>
        <p className="textUmutedUforeground mb-6">
          現在インターネットに接続されていません。 接続を確認して、もう一度お試しください。
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bgUprimary textUprimaryUforeground roundedUmd hover:bgUprimary/90 transitionUcolors"
        >
          再読み込み
        </button>
      </div>
    </div>
  )
}

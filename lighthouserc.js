/** @type {import('@lhci/cli').Config} */
module.exports = {
  ci: {
    collect: {
      // 測定対象のURL
      url: [
        'http://localhost:3011/',
        'http://localhost:3011/about',
        'http://localhost:3011/village-list',
        'http://localhost:3011/rule',
        'http://localhost:3011/faq'
      ],
      // 開発サーバーの起動コマンド
      startServerCommand: 'pnpm dev',
      // サーバーの準備ができるまで待機するURL
      startServerReadyPattern: 'ready started server',
      // サーバーの起動タイムアウト（ミリ秒）
      startServerReadyTimeout: 60000,
      // 測定回数（平均を取るため複数回測定）
      numberOfRuns: 3,
      // Chromiumの設定
      settings: {
        // モバイルエミュレーション（デフォルト）
        preset: 'desktop',
        // スロットリング設定（開発環境では緩和）
        throttlingMethod: 'devtools',
        // スクリーンショットを取得
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        }
      },
      // ヘッドレスモードで実行
      headless: true
    },
    assert: {
      // アサーション設定
      preset: 'lighthouse:recommended',
      assertions: {
        // パフォーマンス関連
        'categories:performance': ['warn', { minScore: 0.7 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'total-blocking-time': ['warn', { maxNumericValue: 500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],

        // アクセシビリティ関連
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'color-contrast': 'warn',
        'document-title': 'error',
        'html-has-lang': 'error',
        'meta-viewport': 'error',

        // SEO関連
        'categories:seo': ['warn', { minScore: 0.9 }],
        'meta-description': 'error',
        'robots-txt': 'off',

        // ベストプラクティス
        'categories:best-practices': ['warn', { minScore: 0.9 }],

        // PWA関連（SPAなので一部緩和）
        'categories:pwa': 'off',
        'service-worker': 'off',
        installable: 'off',

        // その他の緩和
        'bf-cache': 'off',
        'uses-http2': 'off',
        'is-on-https': 'off',
        redirects: 'off',
        'uses-long-cache-ttl': 'off',
        'unsized-images': 'warn',
        'unused-javascript': 'warn',
        'bootup-time': 'warn',
        'mainthread-work-breakdown': 'warn'
      }
    },
    upload: {
      // レポートの出力先
      target: 'filesystem',
      outputDir: './.lighthouse',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%'
    }
  }
}

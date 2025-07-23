if (!self.define) {
  let e,
    i = {}
  const a = (a, s) => (
    (a = new URL(a + '.js', s).href),
    i[a] ||
      new Promise((i) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;((e.src = a), (e.onload = i), document.head.appendChild(e))
        } else ((e = a), importScripts(a), i())
      }).then(() => {
        let e = i[a]
        if (!e) throw new Error(`Module ${a} didn’t register its module`)
        return e
      })
  )
  self.define = (s, c) => {
    const f = e || ('document' in self ? document.currentScript.src : '') || location.href
    if (i[f]) return
    let o = {}
    const r = (e) => a(e, f),
      n = { module: { uri: f }, exports: o, require: r }
    i[f] = Promise.all(s.map((e) => n[e] || r(e))).then((e) => (c(...e), o))
  }
}
define(['./workbox-ee31f467'], function (e) {
  'use strict'
  ;(importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/firewolf/_next/app-build-manifest.json',
          revision: 'f327352b8ca47a38f629f8bd565c0b8a',
        },
        {
          url: '/firewolf/_next/static/6LTmojRJbaPCVGC8pUxuE/_buildManifest.js',
          revision: '2f08f2e138c28b062fc6fb8409a9076d',
        },
        {
          url: '/firewolf/_next/static/6LTmojRJbaPCVGC8pUxuE/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/firewolf/_next/static/chunks/166-61bfe41710a87aa8.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/231-03363531ddce2a30.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/239-ba86b5e230f37165.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/41e65a6a-5640b2d064c7dfb7.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/437-06c0d51ac69235df.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/665-83ebfc5e7f19926b.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/694-3cac7e47afa373b0.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/768-59ea2c40c88d6ef7.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/(auth)/layout-92d90617a225cbf6.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/(auth)/setting/page-59fabd81b689ca6f.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/(auth)/village/create/page-5e0167244c471441.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/(public)/about/page-34e53a89fb9cae9e.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/(public)/faq/page-cd029c1945317472.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/(public)/layout-a7fcb15c3d3eb953.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/(public)/page-dd952145f1d817af.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/(public)/player-record/%5Bid%5D/page-19c00f2f442b340a.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/(public)/rule/page-3527451fba71ea8e.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/(public)/village/%5Bid%5D/page-87f65e32ef6dc489.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/_not-found/page-fc9639a7430b9ed7.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/api/health/route-b2fb327a2dd91c3f.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/auth-test/page-0888a2e49fc048fe.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/error-b7baff0013fbfec4.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/global-error-309c468043a85ed3.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/layout-af4048213472b50c.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/not-found-19da0c18095c8121.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/app/test-api/page-e3d22b69662f088b.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/ed5c96f2-9b42c75ee2c02ed7.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/framework-02e503447b3c60a7.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/main-653f1fd67e5e73e8.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/main-app-7a119ff581143567.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/pages/_app-02c34fe01ebc892e.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/pages/_error-7ed0c4fb4ca03401.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        {
          url: '/firewolf/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/firewolf/_next/static/chunks/webpack-64b1914a3ab4f078.js',
          revision: '6LTmojRJbaPCVGC8pUxuE',
        },
        { url: '/firewolf/_next/static/css/ce12e178f81d088f.css', revision: 'ce12e178f81d088f' },
        {
          url: '/firewolf/_next/static/media/0aa834ed78bf6d07-s.woff2',
          revision: '324703f03c390d2e2a4f387de85fe63d',
        },
        {
          url: '/firewolf/_next/static/media/26a46d62cd723877-s.woff2',
          revision: 'befd9c0fdfa3d8a645d5f95717ed6420',
        },
        {
          url: '/firewolf/_next/static/media/55c55f0601d81cf3-s.woff2',
          revision: '43828e14271c77b87e3ed582dbff9f74',
        },
        {
          url: '/firewolf/_next/static/media/581909926a08bbc8-s.woff2',
          revision: 'f0b86e7c24f455280b8df606b89af891',
        },
        {
          url: '/firewolf/_next/static/media/67957d42bae0796d-s.woff2',
          revision: '54f02056e07c55023315568c637e3a96',
        },
        {
          url: '/firewolf/_next/static/media/886030b0b59bc5a7-s.woff2',
          revision: 'c94e6e6c23e789fcb0fc60d790c9d2c1',
        },
        {
          url: '/firewolf/_next/static/media/8e9860b6e62d6359-s.woff2',
          revision: '01ba6c2a184b8cba08b0d57167664d75',
        },
        {
          url: '/firewolf/_next/static/media/939c4f875ee75fbb-s.woff2',
          revision: '4a4e74bed5809194e4bc6538eb1a1e30',
        },
        {
          url: '/firewolf/_next/static/media/97e0cb1ae144a2a9-s.woff2',
          revision: 'e360c61c5bd8d90639fd4503c829c2dc',
        },
        {
          url: '/firewolf/_next/static/media/bb3ef058b751a6ad-s.p.woff2',
          revision: '782150e6836b9b074d1a798807adcb18',
        },
        {
          url: '/firewolf/_next/static/media/df0a9ae256c0569c-s.woff2',
          revision: 'd54db44de5ccb18886ece2fda72bdfe0',
        },
        {
          url: '/firewolf/_next/static/media/e4af272ccee01ff0-s.p.woff2',
          revision: '65850a373e258f1c897a2b3d75eb74de',
        },
        {
          url: '/firewolf/_next/static/media/f911b923c6adde36-s.woff2',
          revision: '0f8d347d49960d05c9430d83e49edeb7',
        },
        {
          url: '/firewolf/icons/apple-touch-icon.png',
          revision: '6c5c7791bb66516632194a1c5e9d05a2',
        },
        { url: '/firewolf/icons/icon-128x128.png', revision: 'bc79287aade665a5c42cdbd69723783b' },
        { url: '/firewolf/icons/icon-144x144.png', revision: 'bc79287aade665a5c42cdbd69723783b' },
        { url: '/firewolf/icons/icon-152x152.png', revision: 'bc79287aade665a5c42cdbd69723783b' },
        { url: '/firewolf/icons/icon-192x192.png', revision: 'bc79287aade665a5c42cdbd69723783b' },
        { url: '/firewolf/icons/icon-384x384.png', revision: 'bc79287aade665a5c42cdbd69723783b' },
        { url: '/firewolf/icons/icon-512.png', revision: 'bc79287aade665a5c42cdbd69723783b' },
        { url: '/firewolf/icons/icon-512x512.png', revision: 'bc79287aade665a5c42cdbd69723783b' },
        { url: '/firewolf/icons/icon-72x72.png', revision: 'bc79287aade665a5c42cdbd69723783b' },
        { url: '/firewolf/icons/icon-96x96.png', revision: 'bc79287aade665a5c42cdbd69723783b' },
        { url: '/firewolf/icons/icon.png', revision: '8945ec87bfdef868ce15d994afc8b586' },
        { url: '/firewolf/manifest.json', revision: '58a0b3d04859940d9dada54bdf58ce81' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/firewolf',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: i, event: a, state: s }) =>
              i && 'opaqueredirect' === i.type
                ? new Response(i.body, { status: 200, statusText: 'OK', headers: i.headers })
                : i,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 31536e3 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js|css|json)$/i,
      new e.StaleWhileRevalidate({ cacheName: 'static-resources', plugins: [] }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/api\.howling-wolf\.com\/.*/i,
      new e.NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 300 }),
          new e.CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
      }),
      'GET'
    ))
})

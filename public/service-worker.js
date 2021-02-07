importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);
if (workbox) console.log(`Workbox berhasil dimuat`);
else console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute(
    [
        { url: "/index.html", revision: "4" },
        { url: "/nav.html", revision: "1" },
        { url: "/article.html", revision: "1" },
        { url: "/manifest.json", revision: "2" },
        { url: "/push.js", revision: "1" },
        { url: "/css/main.css", revision: "2" },
        { url: "/css/materialize.min.css", revision: "1" },
        { url: "/js/materialize.min.js", revision: "1" },
        { url: "/js/api.js", revision: "2" },
        { url: "/js/check-worker.js", revision: "1" },
        { url: "/js/article-sw.js", revision: "1" },
        { url: "/js/check-notif.js", revision: "1" },
        { url: "/js/db.js", revision: "2" },
        { url: "/js/idb.js", revision: "1" },
        { url: "/js/nav.js", revision: "1" },
        { url: "/js/getPremierLeague.js", revision: "1" },
        { url: "/img/icon192.png", revision: "2" },
        { url: "/img/icon192Apple.png", revision: "2" },
        { url: "/img/icon512.png", revision: "2" },
    ],
    {
        // Ignore all URL parameters.
        ignoreUrlParametersMatching: [/.*/],
    }
);

// Cache Workbox
workbox.routing.registerRoute(
    ({ url }) =>
        url.origin ===
        "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js",
    workbox.strategies.cacheFirst({
        cacheName: "workbox",
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp("/pages/"),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "pages",
    })
);

// Menyimpan cache untuk file API Football selama 1 tahun
workbox.routing.registerRoute(
    ({ url }) => url.origin,
    workbox.strategies.staleWhileRevalidate({
        cacheName: "football-data",
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

self.addEventListener("push", function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }
    var options = {
        body: body,
        icon: "/img/icon192.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
    };
    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});

const { warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// The precacheAndRoute() method takes an array of URLs to precache. The self._WB_MANIFEST is an array that contains the list of URLs to precache.
precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
    cacheName: 'page-cache',
    plugins: [
        new CacheableResponsePlugin({
            statuses: [0, 200],
        }),
        new ExpirationPlugin({
            maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
    ],
});

warmStrategyCache({
    urls: ['/index.html', '/'],
    strategy: pageCache,
});

// Registering a route for certain types of assets (style, script, worker)
registerRoute(
    // Using a function to determine if the request's destination is one of the specified types
    ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
    // Using Stale-While-Revalidate strategy for caching assets
    new StaleWhileRevalidate({
        // Setting a name for the cache
        cacheName: 'asset-cache',
        // Adding plugins to customize caching behavior
        plugins: [
            // CacheableResponsePlugin to specify which response statuses are cacheable
            new CacheableResponsePlugin({
                statuses: [0, 200], // Cache responses with status codes 0 (offline) and 200 (OK)
            }),
            // ExpirationPlugin to specify maximum entries and age for cached items
            new ExpirationPlugin({
                maxEntries: 60, // Maximum number of entries in the cache
                maxAgeSeconds: 30 * 24 * 60 * 60, // Maximum age of cached items (30 days)
            })
        ],
    })
);
var CACHE_NAME = 'v1-biblio-cache';
var urlsToCache = [
        'index.html',
        'manifest.json',
        'js/main.js',
        'js/bootstrap.min.js',
        'js/jquery-1.12.4.min.js',
        'sw.js',
        'css/bootstrap.min.css',
        'css/bootstrap.min.css.map',
        'css/custom.css',
        'favicon.png',
        'manifest.json',
        'img/Android_icon.png',
        'img/Android_tab.png',
        'img/iPad_icon.png',
        'img/iPhone_icon.png',
        'img/itunes.svg',
        'img/google-play-badge.png',
        'img/mini2.png',
        'img/web8-android-device.png',
        'img/tab.png',
        'img/tel/accueil.png',
        'img/tel/edit1.png',
        'img/tel/edit2.png',
        'img/tel/list.png',
        'img/tel/msg.png',
        'img/tel/pret.png',
        'img/tel/visit.png',
        'img/tel/visit2.png',
        'img/tab/accueil.png',
        'img/tab/edit1.png',
        'img/tab/edit2.png',
        'img/tab/list.png',
        'img/tab/msg.png',
        'img/tab/pret.png',
        'img/tab/readlist.png',
        'img/tab/search.png',
        'img/tab/visit1.png',
        'img/tab/visit2.png',
        'img/tab/visit3.png',
        'icon/icon-48.png',
        'icon/icon-72.png',
        'icon/icon-96.png',
        'icon/icon-144.png',
        'icon/icon-192.png'
      ];
/*
// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', function(event) {
    console.log('it was used only one time')
    // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(urlsToCache)
            .then(function() {
              console.log('install');
                return self.skipWaiting();
            });
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('Activate');
    event.waitUntil(
        caches.keys().then(function(keyList) {
          return Promise.all(keyList.map(function(key) {
            console.log('Removing old cache__'+ key);
            if (key !== CACHE_NAME) {
                return caches.delete(key);
            }
        }));
      })
    );
    return self.clients.claim();
});


// Use ServiceWorker (or not) to fetch data
self.addEventListener('fetch', function(event) {
   console.log('Fetch___'+ event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log(response)
      return response || fetch(event.request);
    })
  );
});
*/

self.addEventListener('install', (event) => {
    console.info('Event: Install');

    event.waitUntil(
      caches.open(CACHE_NAME)
      .then((cache) => {
        //[] of files to cache & if any of the file not present `addAll` will fail
        return cache.addAll(urlsToCache)
        .then(() => {
          console.info('All files are cached');
          return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
        })
        .catch((error) =>  {
          console.error('Failed to cache', error);
        })
      })
    );
  });


  self.addEventListener('fetch', (event) => {
  console.info('Event: Fetch');

  var request = event.request;

  //Tell the browser to wait for newtwork request and respond with below
  event.respondWith(
    //If request is already in cache, return it
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      //if request is not cached, add it to cache
      return fetch(request).then((response) => {
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache).catch((err) => {
              console.warn(request.url + ': ' + err.message);
            });
          });

        return response;
      });
    })
  );
});

/*
  ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
*/

//Adding `activate` event listener
self.addEventListener('activate', (event) => {
  console.info('Event: Activate');

  //Remove old and unwanted caches
  event.waitUntil(
    caches.keys().then((CACHE_NAME) => {
      return Promise.all(
        CACHE_NAME.map((cache) => {
          if (cache !== CACHE_NAME) {     //cacheName = 'cache-v1'
            return caches.delete(cache); //Deleting the cache
          }
        })
      );
    })
  );
});




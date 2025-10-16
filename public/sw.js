const CACHE_NAME = 'garatge-estacio-cache-v1'; // Versió inicial de la cache

// Esdeveniment 'install': S'activa quan el navegador detecta el nou SW.
self.addEventListener('install', event => {
  console.log('SW: Instal·lant v1...');
  // Forcem l'activació del nou SW immediatament
  event.waitUntil(self.skipWaiting()); 
});

// Esdeveniment 'activate': Neteja les caches antigues.
self.addEventListener('activate', event => {
  console.log('SW: Activant v1...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        // Filtrem i esborrem totes les caches que no coincideixen amb el CACHE_NAME actual
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  // Reclamem el control de les pàgines obertes immediatament
  self.clients.claim(); 
});

// Esdeveniment 'fetch': Gestió de sol·licituds de xarxa/cache.
self.addEventListener('fetch', event => {
  // Ignorem peticions que no siguin GET i peticions d'extensions (p. ex., Live Reload de Chrome)
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension')) {
    return;
  }

  // Estratègia "Stale-While-Revalidate" per a la majoria de recursos
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        
        // 1. Demanem la versió més nova a la xarxa, independentment de si tenim la vella.
        const fetchPromise = fetch(event.request).then(networkResponse => {
          
          // IMPORTANT: No cachejar respostes invàlides o no segures
          if (networkResponse.status === 200 && networkResponse.type === 'basic') {
            // 2. Actualitzem la cache amb la resposta de xarxa
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(error => {
            // Error de xarxa: Si no hi ha res a la cache, llança l'error.
            console.log('SW: Fetch failed, returning fallback or cache failure.', error);
            // Podríeu afegir un fallback aquí (e.g., retornar una pàgina offline)
            return new Response('Offline', { status: 503 }); 
        });

        // 3. Retorna la versió de la cache si existeix (immediat), si no existeix, espera la de la xarxa.
        return response || fetchPromise;
      });
    })
  );
});

// Nota: No he inclòs l'esdeveniment 'push' ja que la seva implementació depèn d'un backend de notificacions real.
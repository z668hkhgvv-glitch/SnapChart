// Service worker — caches the app so it opens with no internet.
var CACHE = "play-chart-v2";
var FILES = ["./", "index.html", "manifest.json", "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", function(e){
  self.skipWaiting();
  // add each file on its own so one missing file can't break the whole cache
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return Promise.all(FILES.map(function(f){ return c.add(f).catch(function(){}); }));
    })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ if(k !== CACHE) return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;

  // Any page navigation: serve the cached app shell first (works offline at "/" or "/index.html")
  if(req.mode === "navigate"){
    e.respondWith(
      caches.match("index.html").then(function(hit){
        return hit || caches.match("./").then(function(h2){
          return h2 || fetch(req).catch(function(){ return caches.match("index.html"); });
        });
      })
    );
    return;
  }

  // Everything else: cache-first, then network, caching new GETs as they load
  e.respondWith(
    caches.match(req).then(function(hit){
      return hit || fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ try{ c.put(req, copy); }catch(_){ } });
        return res;
      }).catch(function(){ return caches.match("index.html"); });
    })
  );
});

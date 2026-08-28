// Service worker — caches the app so it opens with no internet.
var CACHE = "play-chart-v92";
var FILES = ["./", "index.html", "manifest.json", "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", function(e){
  // Do NOT call skipWaiting() — let the SW wait until all tabs are closed
  // before activating. Calling skipWaiting() can force a page reload mid-session
  // and interrupt in-flight localStorage writes, causing data loss.
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return Promise.all(FILES.map(function(f){ return c.add(f).catch(function(){}); }));
    })
  );
});

// Allow the page to trigger SW activation intentionally (e.g. on next open)
self.addEventListener("message", function(e){
  if(e.data === "skipWaiting") self.skipWaiting();
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

  // Page navigation: network-FIRST so new versions load when online,
  // then fall back to the cached app shell when offline.
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ try{ c.put("index.html", copy); }catch(_){ } });
        return res;
      }).catch(function(){
        return caches.match("index.html").then(function(hit){ return hit || caches.match("./"); });
      })
    );
    return;
  }

  // Other assets: cache-first, then network, caching new GETs as they load.
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

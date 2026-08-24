const CACHE_NAME="arcana-shell-v21";
const APP_SHELL=["./","./index.html","./styles.css","./data-safety.js","./db.js","./routine-excel.js","./app.js","./manifest.webmanifest","./assets/icons/arcana.svg"];
const YOUTUBE_CATALOG_RE=/\/data\/youtube\/catalog\.json$/;

function catalogCacheRequest(url){
  return new Request(`${url.origin}${url.pathname}`);
}

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()))
});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))
});

self.addEventListener("fetch",event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=="GET"||url.origin!==location.origin||url.pathname.startsWith("/api/")){
    return
  }
  if(YOUTUBE_CATALOG_RE.test(url.pathname)){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok){
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(catalogCacheRequest(url),copy))
      }
      return response
    }).catch(async()=>{
      const found=await caches.match(catalogCacheRequest(url));
      if(found){
        return found
      }
      throw new Error("Catalog unavailable offline")
    }));
    return
  }
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy))
    }
    return response
  }).catch(()=>caches.match(event.request).then(found=>found||caches.match("./index.html"))))
});

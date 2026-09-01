const APP_CACHE = "slb-futsal-stable-app-v1";
const BACKUP_CACHE = "slb-futsal-user-backup-v1";
const APP_SHELL = ["./index.html","./manifest.json","./icon-192.png","./icon-512.png"];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil((async()=>{
    const cache=await caches.open(APP_CACHE);
    for(const url of APP_SHELL){
      try{
        const r=await fetch(url,{cache:"reload"});
        if(r&&r.ok)await cache.put(url,r.clone());
      }catch(e){}
    }
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);

  /* version.json é minúsculo: procura online, mas não interfere com a app offline. */
  if(url.pathname.endsWith("/version.json")){
    event.respondWith(
      fetch(event.request,{cache:"no-store"}).then(async r=>{
        if(r&&r.ok){
          const c=await caches.open(APP_CACHE);
          await c.put("./version.json",r.clone());
        }
        return r;
      }).catch(()=>caches.open(APP_CACHE).then(c=>c.match("./version.json")))
    );
    return;
  }

  /* Qualquer navegação da app usa SEMPRE primeiro o index validado em cache. */
  if(event.request.mode==="navigate"){
    event.respondWith(
      caches.open(APP_CACHE).then(async cache=>{
        const cached=await cache.match("./index.html");
        if(cached)return cached;
        try{
          const r=await fetch("./index.html");
          if(r&&r.ok)await cache.put("./index.html",r.clone());
          return r;
        }catch(e){
          return new Response("App indisponível offline nesta primeira abertura.",{status:503});
        }
      })
    );
    return;
  }

  /* Recursos estáticos: cache-first. */
  event.respondWith(
    caches.match(event.request).then(cached=>{
      if(cached)return cached;
      return fetch(event.request).then(async r=>{
        if(r&&r.ok&&r.type!=="opaque"){
          const c=await caches.open(APP_CACHE);
          await c.put(event.request,r.clone());
        }
        return r;
      });
    })
  );
});

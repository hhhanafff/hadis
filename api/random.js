const SOURCES = {
  bukhari: {name:"Shahih Al-Bukhari", max:7563},
  muslim: {name:"Shahih Muslim", max:3033},
  abudawud: {name:"Sunan Abu Dawud", max:5274},
  tirmidzi: {name:"Jami' At-Tirmidzi", max:3956},
  nasai: {name:"Sunan An-Nasa'i", max:5758},
  ibnumajah: {name:"Sunan Ibnu Majah", max:4341},
  ahmad: {name:"Musnad Ahmad", max:27647}
};

function decode(s){
  return s.replace(/&nbsp;/gi," ").replace(/&#39;|&#x27;/gi,"'")
    .replace(/&quot;/gi,'"').replace(/&amp;/gi,"&").replace(/&hellip;/gi,"…")
    .replace(/&#x([0-9a-f]+);/gi,(_,x)=>String.fromCodePoint(parseInt(x,16)))
    .replace(/&#([0-9]+);/g,(_,x)=>String.fromCodePoint(Number(x)));
}
function clean(s){return decode(s.replace(/<[^>]*>/g," ")).replace(/\s+/g," ").trim()}

function parse(html, source, number, url){
  // Remove non-content areas first.
  const main=(html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)||[,html])[1];
  const ps=[...main.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(m=>clean(m[1])).filter(Boolean);
  const arabic=ps.find(x=>/[\u0600-\u06FF]/.test(x))||"";
  const translation=ps.filter(x=>x!==arabic).find(x=>x.length>=50)||"";
  const hs=[...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>clean(m[1])).filter(Boolean);
  const heading=hs.find(x=>/Hadits/i.test(x))||"";
  const kitab=(heading.match(/-\s*Kitab\s+(.+)$/i)||[, ""])[1]||"";
  return {collection:source.name,number,kitab,arabic,translation,url};
}

export async function onRequestGet(context){
  const {request}=context;
  const u=new URL(request.url);
  const requested=u.searchParams.get("collection");
  const tries=8;
  for(let i=0;i<tries;i++){
    const keys=requested&&SOURCES[requested]?[requested]:Object.keys(SOURCES);
    const key=keys[Math.floor(Math.random()*keys.length)];
    const source=SOURCES[key];
    const n=1+Math.floor(Math.random()*source.max);
    const url=`https://www.hadits.id/hadits/${key}/${n}`;
    try{
      const r=await fetch(url,{headers:{
        "User-Agent":"Mozilla/5.0 (compatible; HaditsRandomPages/1.0)",
        "Accept":"text/html,application/xhtml+xml"
      },cf:{cacheTtl:300,cacheEverything:true}});
      if(!r.ok) continue;
      const html=await r.text();
      const data=parse(html,source,n,url);
      if(data.arabic.length>10 && data.translation.length>20){
        return Response.json({ok:true,data},{headers:{"Cache-Control":"no-store"}});
      }
    }catch{}
  }
  return Response.json({ok:false,error:"Hadis belum berhasil dimuat. Coba refresh."},{status:502,headers:{"Cache-Control":"no-store"}});
}

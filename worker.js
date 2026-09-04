export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    };

    if (request.method === "OPTIONS") return new Response(null,{headers:cors});

    const u=new URL(request.url);

    if(u.pathname==="/scrape"){
      const target=u.searchParams.get("url");
      if(!target) return json({error:"url wajib diisi"},400,cors);

      let parsed;
      try {
        parsed=new URL(target);
        if(!["http:","https:"].includes(parsed.protocol)) throw 0;
      } catch {
        return json({error:"URL tidak valid"},400,cors);
      }

      try {
        const r=await fetch(parsed.toString(),{
          redirect:"follow",
          headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
            "Accept":"text/html,application/xhtml+xml"
          }
        });
        const html=await r.text();

        return json({
          success:r.ok,
          status:r.status,
          finalUrl:r.url,
          html:html
        },r.ok?200:r.status,cors);
      } catch(e) {
        return json({error:String(e)},500,cors);
      }
    }

    return new Response("OK",{headers:{"Content-Type":"text/plain",...cors}});
  }
};

function json(data,status,extra={}){
  return new Response(JSON.stringify(data),{
    status,
    headers:{"Content-Type":"application/json;charset=UTF-8",...extra}
  });
}

const BOOKS = [
  ["bukhari", "Shahih Al-Bukhari", 7563],
  ["muslim", "Shahih Muslim", 3033],
  ["abu-dawud", "Sunan Abu Dawud", 5274],
  ["tirmidzi", "Jami' At-Tirmidzi", 3956],
  ["nasai", "Sunan An-Nasa'i", 5758],
  ["ibnu-majah", "Sunan Ibnu Majah", 4341],
  ["ahmad", "Musnad Ahmad", 27647]
];

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      });
    }

    if (url.pathname === "/api/random") {
      try {
        const hadis = await getRandomHadis();
        return json(hadis);
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    if (url.pathname === "/api/test") {
      try {
        const hadis = await scrapeHadis("muslim", 1);
        return json(hadis);
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    return new Response(HTML, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "no-store"
      }
    });
  }
};

async function getRandomHadis() {
  for (let attempt = 0; attempt < 20; attempt++) {
    const book = BOOKS[Math.floor(Math.random() * BOOKS.length)];
    const number = Math.floor(Math.random() * book[2]) + 1;

    try {
      const result = await scrapeHadis(book[0], number);

      if (result && result.arab && result.translation) {
        return result;
      }
    } catch (_) {}
  }

  throw new Error("Tidak berhasil mengambil hadis dari Hadits.id.");
}

async function scrapeHadis(slug, number) {
  const source =
    `https://www.hadits.id/hadits/${slug}/${number}`;

  const response = await fetch(source, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,text/html;q=0.9,*/*;q=0.8"
    }
  });

  if (!response.ok) {
    throw new Error(`Hadits.id HTTP ${response.status}`);
  }

  const html = await response.text();
  const text = htmlToText(html);

  const lines = text
    .split("\n")
    .map(clean)
    .filter(Boolean);

  const marker = lines.findIndex(line =>
    /·\s*No\.\s*\d+\s*$/.test(line)
  );

  if (marker < 0) {
    throw new Error("Marker hadis tidak ditemukan.");
  }

  const metaLine = lines[marker];
  const metaParts = metaLine
    .split("·")
    .map(clean);

  const kitab = metaParts[0] || "";
  const bab = metaParts[1] || "";

  const foundNumber =
    (metaLine.match(/No\.\s*(\d+)/) || [])[1] ||
    String(number);

  let title = lines[marker + 1] || "";

  let status = "";

  for (
    let i = marker + 2;
    i <= marker + 6 && i < lines.length;
    i++
  ) {
    if (
      /^(Shahih|Hasan|Dhaif|Daif|Hasan Shahih)$/i
        .test(lines[i])
    ) {
      status = lines[i];
      break;
    }
  }

  let arabIndex = -1;

  for (
    let i = marker + 1;
    i < Math.min(lines.length, marker + 30);
    i++
  ) {
    const arabicCount =
      (lines[i].match(/[\u0600-\u06FF]/g) || [])
        .length;

    if (
      arabicCount >= 15 &&
      lines[i].length >= 40
    ) {
      arabIndex = i;
      break;
    }
  }

  if (arabIndex < 0) {
    throw new Error("Teks Arab tidak ditemukan.");
  }

  const arab = lines[arabIndex];

  let translation = "";

  for (
    let i = arabIndex + 1;
    i < Math.min(lines.length, arabIndex + 15);
    i++
  ) {
    const line = lines[i];

    if (line.length < 70) continue;
    if (/[\u0600-\u06FF]/.test(line)) continue;

    if (
      /^Selengkapnya\s*Sembunyikan$/i.test(line)
    ) continue;

    if (
      /^(Simpan|Penjelasan|Komunitas|Follow|Jazakumullah)/i
        .test(line)
    ) continue;

    translation = line;
    break;
  }

  if (!translation) {
    throw new Error("Terjemahan tidak ditemukan.");
  }

  return {
    kitab,
    bab,
    number: foundNumber,
    title,
    status: status || "Hadis",
    arab,
    translation,
    source
  };
}

function htmlToText(html) {
  let s = html
    .replace(
      /<script[\s\S]*?<\/script>/gi,
      "\n"
    )
    .replace(
      /<style[\s\S]*?<\/style>/gi,
      "\n"
    )
    .replace(
      /<noscript[\s\S]*?<\/noscript>/gi,
      "\n"
    )
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(
      /<\/(p|div|section|article|h1|h2|h3|li|blockquote|header|footer)>/gi,
      "\n"
    )
    .replace(/<[^>]+>/g, " ");

  s = decodeEntities(s);

  return s.replace(/\u00a0/g, " ");
}

function clean(s) {
  return String(s)
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(
      /&#(\d+);/g,
      (_, n) => {
        try {
          return String.fromCodePoint(Number(n));
        } catch {
          return _;
        }
      }
    )
    .replace(
      /&#x([0-9a-f]+);/gi,
      (_, n) => {
        try {
          return String.fromCodePoint(
            parseInt(n, 16)
          );
        } catch {
          return _;
        }
      }
    );
}

function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "content-type":
          "application/json; charset=UTF-8",
        "access-control-allow-origin": "*",
        "cache-control": "no-store"
      }
    }
  );
}

const HTML = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport"
content="width=device-width,initial-scale=1">
<title>Hadis Random</title>

<style>
*{box-sizing:border-box}

body{
 margin:0;
 background:#f5f5f5;
 color:#111;
 font-family:Arial,sans-serif
}

.wrap{
 max-width:850px;
 margin:45px auto;
 padding:20px
}

.card{
 background:#fff;
 border-radius:16px;
 padding:32px;
 box-shadow:0 5px 25px #00000012
}

.header{
 border-bottom:1px solid #eee;
 padding-bottom:18px;
 margin-bottom:25px
}

.kitab{
 font-size:18px;
 font-weight:700
}

.meta{
 font-size:14px;
 color:#777;
 margin-top:7px
}

.status{
 display:inline-block;
 margin-top:12px;
 padding:6px 10px;
 border-radius:20px;
 background:#eaf7ed;
 color:#18743b;
 font-size:13px;
 font-weight:bold
}

.title{
 font-size:22px;
 line-height:1.5;
 margin:0 0 24px
}

.arab{
 font-family:"Times New Roman",serif;
 font-size:30px;
 line-height:2.2;
 text-align:right;
 direction:rtl;
 margin:25px 0
}

.translation{
 font-size:16px;
 line-height:1.9;
 color:#444
}

.source{
 font-size:12px;
 color:#999;
 margin-top:20px;
 word-break:break-all
}

button{
 width:100%;
 margin-top:25px;
 padding:16px;
 border:0;
 border-radius:9px;
 background:#111;
 color:#fff;
 font-size:15px;
 font-weight:bold;
 cursor:pointer
}

button:disabled{
 opacity:.5
}

.loading{
 text-align:center;
 color:#777;
 font-size:13px;
 margin-top:12px
}

.error{
 color:red
}
</style>
</head>

<body>

<div class="wrap">
<div class="card">

<div class="header">

<div id="kitab"
class="kitab">
Hadis Random
</div>

<div id="meta"
class="meta">
Memuat hadis...
</div>

<div id="hadisStatus"
class="status">
—
</div>

</div>

<h1 id="title"
class="title">
—
</h1>

<div id="arab"
class="arab">
—
</div>

<div id="translation"
class="translation">
—
</div>

<div id="source"
class="source">
</div>

<button id="btn">
HADIS RANDOM
</button>

<div id="loading"
class="loading">
</div>

</div>
</div>

<script>

const btn =
document.getElementById("btn");

const loading =
document.getElementById("loading");

async function randomHadis(){

 btn.disabled=true;

 loading.textContent =
 "Mengambil hadis...";

 try{

  const r =
  await fetch(
   "/api/random",
   {cache:"no-store"}
  );

  const d =
  await r.json();

  if(!r.ok || d.error){
   throw new Error(
    d.error ||
    "Gagal mengambil hadis."
   );
  }

  document.getElementById(
   "kitab"
  ).textContent=d.kitab;

  document.getElementById(
   "meta"
  ).textContent=
   (d.bab ?
    d.bab+" · " : "")+
   "No. "+d.number;

  document.getElementById(
   "hadisStatus"
  ).textContent=d.status;

  document.getElementById(
   "title"
  ).textContent=d.title;

  document.getElementById(
   "arab"
  ).textContent=d.arab;

  document.getElementById(
   "translation"
  ).textContent=
   d.translation;

  document.getElementById(
   "source"
  ).textContent=d.source;

  loading.textContent="";

 }catch(e){

  loading.innerHTML=
   '<span class="error">'+
   String(e.message)+
   '</span>';

 }finally{

  btn.disabled=false;

 }
}

btn.addEventListener(
 "click",
 randomHadis
);

randomHadis();

</script>

</body>
</html>`;

const SOURCES = {
  bukhari: {
    name: "Shahih Al-Bukhari",
    max: 7563
  },
  muslim: {
    name: "Shahih Muslim",
    max: 3033
  },
  abudawud: {
    name: "Sunan Abu Dawud",
    max: 5274
  },
  tirmidzi: {
    name: "Jami' At-Tirmidzi",
    max: 3956
  },
  nasai: {
    name: "Sunan An-Nasa'i",
    max: 5758
  },
  ibnumajah: {
    name: "Sunan Ibnu Majah",
    max: 4341
  },
  ahmad: {
    name: "Musnad Ahmad",
    max: 27647
  }
};


// =========================
// HTML WEBSITE
// =========================

const PAGE = `<!doctype html>
<html lang="id">

<head>

<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<meta
  name="theme-color"
  content="#f6f7f9"
>

<title>Hadis Hari Ini</title>

<meta
  name="description"
  content="Satu hadis random setiap kali dibuka atau diperbarui."
>

<link rel="preconnect" href="https://fonts.googleapis.com">

<link
  rel="preconnect"
  href="https://fonts.gstatic.com"
  crossorigin
>

<link
  href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap"
  rel="stylesheet"
>

<style>

:root{

  --bg:#f6f7f9;
  --card:#ffffff;
  --text:#111827;
  --muted:#64748b;
  --line:#e2e8f0;
  --dark:#111827;

}

*{
  box-sizing:border-box;
}

html,
body{

  margin:0;
  min-height:100%;

  background:var(--bg);
  color:var(--text);

}

body{

  font-family:"DM Sans",system-ui,sans-serif;

}

.wrap{

  width:min(100% - 28px,760px);

  margin:auto;

  padding:
    18px
    0
    35px;

}


/* HEADER */

header{

  height:44px;

  display:flex;

  align-items:center;

  justify-content:space-between;

}

.logo{

  font-weight:700;

  font-size:18px;

  letter-spacing:-.04em;

}

.theme{

  border:1px solid var(--line);

  background:var(--card);

  width:42px;

  height:42px;

  border-radius:50%;

  cursor:pointer;

  color:var(--text);

}


/* HERO */

.hero{

  padding:
    58px
    0
    25px;

}

.eyebrow{

  text-transform:uppercase;

  letter-spacing:.15em;

  font-weight:700;

  font-size:12px;

  color:#64748b;

}

h1{

  font-size:
    clamp(
      34px,
      8vw,
      52px
    );

  line-height:1.02;

  letter-spacing:-.06em;

  margin:
    10px
    0
    13px;

  max-width:650px;

}

.sub{

  font-size:14px;

  color:var(--muted);

}


/* HADIS CARD */

.card{

  background:var(--card);

  border:1px solid var(--line);

  border-radius:26px;

  padding:
    clamp(
      25px,
      6vw,
      48px
    );

  box-shadow:
    0
    20px
    60px
    rgba(15,23,42,.08);

  min-height:380px;

}

.meta{

  display:flex;

  gap:8px;

  flex-wrap:wrap;

  margin-bottom:25px;

}

.pill{

  font-size:12px;

  font-weight:700;

  background:#f1f5f9;

  padding:
    8px
    11px;

  border-radius:999px;

}


/* ARABIC */

.arabic{

  font-family:Amiri,serif;

  font-size:
    clamp(
      30px,
      8vw,
      47px
    );

  line-height:1.9;

  text-align:right;

  direction:rtl;

  margin:
    0
    0
    25px;

}


/* TRANSLATION */

.translation{

  font-size:
    clamp(
      17px,
      4.5vw,
      21px
    );

  line-height:1.75;

  margin:0;

  letter-spacing:-.01em;

}


/* SOURCE */

.source{

  border-top:
    1px
    solid
    var(--line);

  margin-top:28px;

  padding-top:17px;

  font-size:13px;

  color:var(--muted);

}


/* BUTTON */

.actions{

  display:grid;

  grid-template-columns:
    1fr
    1fr;

  gap:10px;

  margin-top:14px;

}

button.action{

  height:52px;

  border-radius:15px;

  border:
    1px
    solid
    var(--line);

  background:var(--card);

  font:
    600
    14px
    "DM Sans";

  cursor:pointer;

  color:var(--text);

}

button.primary{

  background:var(--dark);

  color:#fff;

  border-color:var(--dark);

}

button:active{

  transform:scale(.985);

}


/* STATUS */

.status{

  text-align:center;

  color:var(--muted);

  font-size:12px;

  min-height:20px;

  margin-top:12px;

}


/* LOADING */

.loading .content{

  display:none;

}

.loading .skeleton{

  display:block;

}

.skeleton{

  display:none;

}

.sk{

  background:#e5e7eb;

  border-radius:10px;

  animation:pulse 1.1s infinite;

}

.sk1{

  height:18px;

  width:35%;

  margin-bottom:25px;

}

.sk2{

  height:170px;

  margin-bottom:25px;

}

.sk3{

  height:95px;

}

@keyframes pulse{

  50%{
    opacity:.45;
  }

}


/* ANIMATION */

.fade{

  animation:
    fade
    .3s
    ease;

}

@keyframes fade{

  from{

    opacity:.2;

    transform:
      translateY(5px);

  }

  to{

    opacity:1;

    transform:none;

  }

}


/* DARK MODE */

body.dark{

  --bg:#0b1120;

  --card:#111827;

  --text:#f8fafc;

  --muted:#94a3b8;

  --line:#263449;

}

body.dark .pill{

  background:#1e293b;

}

body.dark button.primary{

  background:#f8fafc;

  color:#0f172a;

  border-color:#f8fafc;

}


/* MOBILE */

@media(max-width:560px){

  .hero{

    padding-top:45px;

  }

  .card{

    border-radius:22px;

  }

  .actions{

    grid-template-columns:1fr;

  }

  .source{

    font-size:12px;

  }

}


/* DESKTOP */

@media(min-width:700px){

  .hero{

    padding-top:45px;

  }

  .actions{

    grid-template-columns:
      180px
      180px;

  }

}

</style>

</head>


<body>

<div class="wrap">


<header>

  <div class="logo">
    Hadis
  </div>

  <button
    class="theme"
    id="theme"
    aria-label="Tema"
  >
    ☾
  </button>

</header>


<section class="hero">

  <div class="eyebrow">
    Hadis hari ini
  </div>

  <h1>
    Satu hadis. Satu menit untuk merenung.
  </h1>

  <div class="sub">
    Hadis dipilih secara acak setiap kali diperbarui.
  </div>

</section>


<main
  class="card"
  id="card"
>


  <div class="skeleton">

    <div class="sk sk1"></div>

    <div class="sk sk2"></div>

    <div class="sk sk3"></div>

  </div>


  <div class="content">


    <div class="meta">

      <span
        class="pill"
        id="collection"
      >
        Memuat
      </span>

      <span
        class="pill"
        id="number"
      >
        Hadis —
      </span>

    </div>


    <p
      class="arabic"
      id="arabic"
    ></p>


    <p
      class="translation"
      id="translation"
    ></p>


    <div
      class="source"
      id="source"
    ></div>


  </div>

</main>


<div class="actions">


  <button
    class="action primary"
    id="next"
  >
    Hadis berikutnya
  </button>


  <button
    class="action"
    id="share"
  >
    Bagikan
  </button>


</div>


<div
  class="status"
  id="status"
></div>


</div>


<script>

const $ = id =>
  document.getElementById(id);


const card =
  $("card");


async function loadHadith(){

  card.classList.add("loading");

  $("status").textContent =
    "Memuat hadis…";


  try{

    const response =
      await fetch(
        "/api/random?t=" +
        Date.now(),
        {
          cache:"no-store"
        }
      );


    const data =
      await response.json();


    if(
      !response.ok ||
      !data.ok
    ){

      throw new Error(
        data.error ||
        "Gagal mengambil hadis."
      );

    }


    $("collection").textContent =
      data.data.collection ||
      "Hadis";


    $("number").textContent =
      "Hadis " +
      data.data.number;


    $("arabic").textContent =
      data.data.arabic ||
      "";


    $("translation").textContent =
      data.data.translation ||
      "";


    $("source").textContent =
      (
        data.data.kitab
          ? data.data.kitab + " · "
          : ""
      ) +
      "Sumber: Hadits.id";


    card.classList.remove(
      "fade"
    );

    void card.offsetWidth;

    card.classList.add(
      "fade"
    );


    $("status").textContent = "";


  }catch(error){

    $("status").textContent =
      error.message ||
      "Gagal memuat hadis.";

  }


  finally{

    card.classList.remove(
      "loading"
    );

  }

}


/* HADIS BERIKUTNYA */

$("next").onclick =
  loadHadith;


/* SHARE */

$("share").onclick =
  async () => {

    const text =
      $("arabic").textContent +
      "\n\n" +
      $("translation").textContent +
      "\n\n" +
      $("source").textContent;


    if(
      navigator.share
    ){

      try{

        await navigator.share({
          title:
            "Hadis Hari Ini",

          text:text

        });

      }catch(error){}

    }

    else{

      try{

        await navigator.clipboard.writeText(
          text
        );

        $("status").textContent =
          "Hadis disalin.";

      }catch(error){}

    }

  };


/* DARK MODE */

$("theme").onclick =
  () => {

    document.body.classList.toggle(
      "dark"
    );


    localStorage.setItem(

      "theme",

      document.body.classList.contains(
        "dark"
      )
        ? "dark"
        : "light"

    );

  };


if(
  localStorage.getItem("theme") ===
  "dark"
){

  document.body.classList.add(
    "dark"
  );

}


/* LOAD PERTAMA */

loadHadith();

</script>


</body>

</html>`;


// =========================
// HTML PARSER
// =========================

function decodeHTML(text){

  return text

    .replace(
      /&nbsp;/gi,
      " "
    )

    .replace(
      /&amp;/gi,
      "&"
    )

    .replace(
      /&quot;/gi,
      '"'
    )

    .replace(
      /&#39;|&#x27;/gi,
      "'"
    )

    .replace(
      /&hellip;/gi,
      "…"
    )

    .replace(
      /&#x([0-9a-f]+);/gi,
      (_, hex) =>
        String.fromCodePoint(
          parseInt(hex,16)
        )
    )

    .replace(
      /&#([0-9]+);/g,
      (_, num) =>
        String.fromCodePoint(
          Number(num)
        )
    );

}


function visibleBlocks(html){

  let text = html;


  text =
    text.replace(
      /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      " "
    );


  text =
    text.replace(
      /<style\b[^>]*>[\s\S]*?<\/style>/gi,
      " "
    );


  text =
    text.replace(
      /<(br|\/p|\/div|\/li|\/h[1-6]|\/section|\/article|\/blockquote|\/header|\/footer|\/main|\/span)>/gi,
      "\n"
    );


  text =
    text.replace(
      /<[^>]+>/g,
      " "
    );


  text =
    decodeHTML(text);


  return text

    .split(/\n+/)

    .map(
      item =>
        item
          .replace(
            /\s+/g,
            " "
          )
          .trim()
    )

    .filter(
      item =>
        item.length > 0
    );

}


function parseHadith(
  html,
  source,
  number,
  url
){

  const blocks =
    visibleBlocks(html);


  /*
    Cari teks Arab.
  */

  const arabicIndex =
    blocks.findIndex(
      item =>
        /[\u0600-\u06FF]/.test(item) &&
        item.length > 20
    );


  let arabic =
    arabicIndex >= 0
      ? blocks[arabicIndex]
      : "";


  /*
    Cari terjemahan Indonesia
    setelah teks Arab.
  */

  let translation = "";


  if(
    arabicIndex >= 0
  ){

    for(
      let i =
        arabicIndex + 1;

      i <
        Math.min(
          blocks.length,
          arabicIndex + 20
        );

      i++
    ){

      const item =
        blocks[i];


      if(
        /[\u0600-\u06FF]/.test(
          item
        )
      ){

        continue;

      }


      if(
        item.length < 45
      ){

        continue;

      }


      if(
        /^(Selengkapnya|Sembunyikan|Simpan|Follow|Penjelasan|Komunitas|Hasil untuk|Hadits\.id)/i
          .test(item)
      ){

        continue;

      }


      /*
        Hindari mengambil
        transliterasi Latin.
      */

      if(
        /^[a-z0-9 .,'"-]+$/i.test(
          item
        ) &&
        item.length < 180
      ){

        continue;

      }


      translation =
        item;

      break;

    }

  }


  /*
    Cari nama kitab.
  */

  let title = "";


  const titleIndex =
    blocks.findIndex(
      item =>
        /Hadits\s+(Shahih\s+)?/i.test(
          item
        ) &&
        new RegExp(
          "\\b" +
          number +
          "\\b"
        ).test(item)
    );


  if(
    titleIndex >= 0
  ){

    title =
      blocks[titleIndex];

  }


  let kitab = "";


  const kitabMatch =
    title.match(
      /-\s*Kitab\s+(.+?)(?:\s+·\s+No\.|$)/i
    );


  if(
    kitabMatch
  ){

    kitab =
      kitabMatch[1].trim();

  }


  if(!kitab){

    const kitabBlock =
      blocks.find(
        item =>
          /^Kitab\s+/i.test(item)
      );


    if(
      kitabBlock
    ){

      kitab =
        kitabBlock
          .replace(
            /^Kitab\s+/i,
            ""
          )
          .trim();

    }

  }


  return {

    collection:
      source.name,

    number:

      number,

    kitab:

      kitab,

    arabic:

      arabic,

    translation:

      translation,

    url:

      url

  };

}


// =========================
// AMBIL HADIS RANDOM
// =========================

async function getRandomHadith(){

  const keys =
    Object.keys(SOURCES);


  /*
    Maksimal 12 percobaan.
    Karena tidak semua nomor
    random pasti memiliki halaman.
  */

  for(
    let attempt = 0;
    attempt < 12;
    attempt++
  ){

    const key =
      keys[
        Math.floor(
          Math.random() *
          keys.length
        )
      ];


    const source =
      SOURCES[key];


    const number =
      1 +
      Math.floor(
        Math.random() *
        source.max
      );


    const url =
      `https://www.hadits.id/hadits/${key}/${number}`;


    try{

      const response =
        await fetch(
          url,
          {
            headers:{
              "User-Agent":
                "Mozilla/5.0 (compatible; HadisRandom/1.0)",

              "Accept":
                "text/html,application/xhtml+xml"
            },

            cf:{
              cacheTtl:300,
              cacheEverything:true
            }

          }
        );


      if(
        !response.ok
      ){

        continue;

      }


      const html =
        await response.text();


      const data =
        parseHadith(
          html,
          source,
          number,
          url
        );


      /*
        Pastikan benar-benar
        mendapatkan teks hadis.
      */

      if(

        data.arabic.length > 20 &&

        data.translation.length > 30

      ){

        return data;

      }

    }catch(error){

      continue;

    }

  }


  throw new Error(
    "Hadis belum berhasil dimuat. Coba refresh."
  );

}


// =========================
// CLOUDFLARE WORKER
// =========================

export default {

  async fetch(
    request
  ){

    const url =
      new URL(
        request.url
      );


    /*
      API RANDOM HADIS
    */

    if(
      url.pathname ===
      "/api/random"
    ){

      try{

        const data =
          await getRandomHadith();


        return new Response(

          JSON.stringify({
            ok:true,
            data:data
          }),

          {
            status:200,

            headers:{
              "Content-Type":
                "application/json;charset=UTF-8",

              "Cache-Control":
                "no-store"
            }

          }

        );

      }catch(error){

        return new Response(

          JSON.stringify({

            ok:false,

            error:
              error.message

          }),

          {

            status:502,

            headers:{

              "Content-Type":
                "application/json;charset=UTF-8",

              "Cache-Control":
                "no-store"

            }

          }

        );

      }

    }


    /*
      SEMUA REQUEST LAIN
      MENAMPILKAN WEBSITE
    */

    return new Response(

      PAGE,

      {

        status:200,

        headers:{

          "Content-Type":
            "text/html;charset=UTF-8",

          "Cache-Control":
            "no-store"

        }

      }

    );

  }

};

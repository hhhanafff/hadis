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


/* =========================================
   DECODE HTML
========================================= */

function decodeHTML(text) {

  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&hellip;/gi, "…")

    .replace(
      /&#x([0-9a-f]+);/gi,
      (_, hex) =>
        String.fromCodePoint(
          parseInt(hex, 16)
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


/* =========================================
   HTML → TEXT
========================================= */

function htmlToText(html) {

  let text = html;


  /* Hapus script */

  text = text.replace(
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    " "
  );


  /* Hapus style */

  text = text.replace(
    /<style\b[^>]*>[\s\S]*?<\/style>/gi,
    " "
  );


  /*
    Beri pemisah sebelum elemen
    block supaya teks tidak
    menempel semuanya.
  */

  text = text.replace(
    /<(br|hr|\/p|\/div|\/li|\/h1|\/h2|\/h3|\/h4|\/h5|\/h6|\/section|\/article|\/main|\/blockquote|\/header|\/footer)>/gi,
    "\n"
  );


  /* Hapus tag HTML */

  text = text.replace(
    /<[^>]+>/g,
    " "
  );


  /* Decode entity */

  text = decodeHTML(text);


  return text
    .split("\n")
    .map(
      line =>
        line
          .replace(/\s+/g, " ")
          .trim()
    )
    .filter(Boolean);

}


/* =========================================
   CARI TEKS ARAB
========================================= */

function isArabic(text) {

  return (
    /[\u0600-\u06FF]/.test(text) &&
    text.length > 20
  );

}


/* =========================================
   PARSE HADIS
========================================= */

function parseHadith(
  html,
  source,
  number,
  url
) {

  const lines =
    htmlToText(html);


  /*
    Cari posisi teks Arab.
  */

  const arabicIndex =
    lines.findIndex(
      line =>
        isArabic(line)
    );


  if (arabicIndex === -1) {

    return null;

  }


  const arabic =
    lines[arabicIndex];


  /*
    Cari "Selengkapnya Sembunyikan".
    
    Pada halaman Hadits.id,
    terjemahan berada setelah
    bagian tersebut.
  */

  let translation = "";


  const moreIndex =
    lines.findIndex(
      (line, index) =>
        index > arabicIndex &&
        /Selengkapnya/i.test(line)
    );


  if (moreIndex !== -1) {

    for (
      let i = moreIndex + 1;

      i < lines.length;

      i++
    ) {

      const line =
        lines[i];


      /*
        Lewati teks UI.
      */

      if (
        !line ||
        line.length < 30
      ) {

        continue;

      }


      if (
        /^(Sembunyikan|Simpan|Penjelasan|Follow|Komunitas|Hasil untuk|Hadits\.id|Lihat teks hadits)/i
          .test(line)
      ) {

        continue;

      }


      /*
        Jangan ambil teks Arab.
      */

      if (
        /[\u0600-\u06FF]/.test(line)
      ) {

        continue;

      }


      /*
        Jangan ambil transliterasi.
      */

      if (
        /^[a-z0-9\s.,'"()\-]+$/i.test(line) &&
        line.length < 300
      ) {

        continue;

      }


      translation =
        line;

      break;

    }

  }


  /*
    Fallback.
    
    Kalau "Selengkapnya" tidak
    berhasil ditemukan, cari teks
    Indonesia setelah Arab.
  */

  if (!translation) {

    for (
      let i = arabicIndex + 1;

      i < lines.length;

      i++
    ) {

      const line =
        lines[i];


      if (
        line.length < 50
      ) {

        continue;

      }


      if (
        /[\u0600-\u06FF]/.test(line)
      ) {

        continue;

      }


      if (
        /^(Selengkapnya|Sembunyikan|Simpan|Penjelasan|Follow|Komunitas)/i
          .test(line)
      ) {

        continue;

      }


      translation =
        line;

      break;

    }

  }


  /*
    Cari kitab.
  */

  let kitab = "";


  /*
    Cari teks yang diawali
    "Kitab".
  */

  const kitabLine =
    lines.find(
      line =>
        /^Kitab\s+/i.test(line)
    );


  if (kitabLine) {

    kitab =
      kitabLine
        .replace(
          /^Kitab\s+/i,
          ""
        )
        .trim();

  }


  /*
    Fallback dari judul halaman.
  */

  if (!kitab) {

    const titleLine =
      lines.find(
        line =>
          /No\.\s*${number}/i.test(line)
      );


    if (titleLine) {

      const match =
        titleLine.match(
          /Kitab\s+(.+?)(?:\s+·|$)/i
        );


      if (match) {

        kitab =
          match[1].trim();

      }

    }

  }


  /*
    Pastikan translation ada.
  */

  if (
    !arabic ||
    !translation
  ) {

    return null;

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


/* =========================================
   RANDOM HADIS
========================================= */

async function getRandomHadith() {

  const keys =
    Object.keys(SOURCES);


  /*
    Coba sampai 20 kali.

    Karena nomor hadis random
    belum tentu tersedia.
  */

  for (
    let attempt = 0;
    attempt < 20;
    attempt++
  ) {

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
      Math.floor(
        Math.random() *
        source.max
      ) + 1;


    const url =
      `https://www.hadits.id/hadits/${key}/${number}`;


    try {

      const response =
        await fetch(
          url,
          {
            headers: {

              "User-Agent":
                "Mozilla/5.0 (compatible; HadisRandom/1.0)",

              "Accept":
                "text/html,application/xhtml+xml"

            },

            cf: {

              cacheTtl: 300,

              cacheEverything: true

            }

          }
        );


      /*
        Kalau 404 atau error,
        coba nomor lain.
      */

      if (
        !response.ok
      ) {

        continue;

      }


      const html =
        await response.text();


      const hadith =
        parseHadith(
          html,
          source,
          number,
          url
        );


      /*
        Kalau parsing berhasil,
        langsung return.
      */

      if (
        hadith &&
        hadith.arabic &&
        hadith.translation
      ) {

        return hadith;

      }

    }

    catch (error) {

      continue;

    }

  }


  throw new Error(
    "Gagal mengambil hadis dari Hadits.id."
  );

}


/* =========================================
   CLOUDFLARE PAGES FUNCTION
========================================= */

export async function onRequestGet(
  context
) {

  try {

    const hadith =
      await getRandomHadith();


    return new Response(

      JSON.stringify({

        ok: true,

        data: hadith

      }),

      {

        status: 200,

        headers: {

          "Content-Type":
            "application/json; charset=UTF-8",

          "Cache-Control":
            "no-store, no-cache, must-revalidate"

        }

      }

    );

  }

  catch (error) {

    return new Response(

      JSON.stringify({

        ok: false,

        error:
          error.message ||
          "Gagal mengambil hadis."

      }),

      {

        status: 502,

        headers: {

          "Content-Type":
            "application/json; charset=UTF-8",

          "Cache-Control":
            "no-store, no-cache, must-revalidate"

        }

      }

    );

  }

}

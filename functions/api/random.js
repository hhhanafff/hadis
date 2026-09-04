const BOOKS = [
  {
    slug: "bukhari",
    name: "Shahih Al-Bukhari",
    max: 7563
  },
  {
    slug: "muslim",
    name: "Shahih Muslim",
    max: 3033
  },
  {
    slug: "abudawud",
    name: "Sunan Abu Dawud",
    max: 5274
  },
  {
    slug: "tirmidzi",
    name: "Jami' At-Tirmidzi",
    max: 3956
  },
  {
    slug: "nasai",
    name: "Sunan An-Nasa'i",
    max: 5758
  },
  {
    slug: "ibnumajah",
    name: "Sunan Ibnu Majah",
    max: 4341
  },
  {
    slug: "ahmad",
    name: "Musnad Ahmad",
    max: 27647
  }
];


// ========================================
// HTML ENTITY DECODER
// ========================================

function decodeHTML(text) {

  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
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


// ========================================
// HTML → TEXT
// ========================================

function cleanHTML(html) {

  return decodeHTML(

    html
      .replace(
        /<script[\s\S]*?<\/script>/gi,
        ""
      )

      .replace(
        /<style[\s\S]*?<\/style>/gi,
        ""
      )

      .replace(
        /<br\s*\/?>/gi,
        "\n"
      )

      .replace(
        /<\/p>/gi,
        "\n"
      )

      .replace(
        /<\/div>/gi,
        "\n"
      )

      .replace(
        /<\/section>/gi,
        "\n"
      )

      .replace(
        /<\/article>/gi,
        "\n"
      )

      .replace(
        /<\/li>/gi,
        "\n"
      )

      .replace(
        /<[^>]+>/g,
        ""
      )

  );

}


// ========================================
// EXTRACT HADIS
// ========================================

function extractHadith(
  html,
  book,
  number,
  url
) {

  const text =
    cleanHTML(html);


  const lines =
    text
      .split("\n")
      .map(
        x =>
          x
            .replace(/\s+/g, " ")
            .trim()
      )
      .filter(Boolean);


  // --------------------------------------
  // CARI TEKS ARAB
  // --------------------------------------

  let arabic = "";

  let arabicIndex = -1;


  for (
    let i = 0;
    i < lines.length;
    i++
  ) {

    const line =
      lines[i];


    if (
      /[\u0600-\u06FF]/.test(line) &&
      line.length > 40
    ) {

      arabic =
        line;

      arabicIndex =
        i;

      break;

    }

  }


  if (
    arabicIndex === -1
  ) {

    return null;

  }


  // --------------------------------------
  // CARI TERJEMAHAN
  // --------------------------------------

  let translation = "";


  /*
    Pada halaman Hadits.id:

    Arab
    ↓
    transliterasi
    ↓
    "Selengkapnya Sembunyikan"
    ↓
    terjemahan
  */


  let moreIndex = -1;


  for (
    let i = arabicIndex + 1;
    i < lines.length;
    i++
  ) {

    if (
      /Selengkapnya/i.test(
        lines[i]
      )
    ) {

      moreIndex = i;

      break;

    }

  }


  if (
    moreIndex !== -1
  ) {

    for (
      let i = moreIndex + 1;
      i < lines.length;
      i++
    ) {

      const line =
        lines[i];


      if (
        line.length < 40
      ) {

        continue;

      }


      if (
        /[\u0600-\u06FF]/.test(
          line
        )
      ) {

        continue;

      }


      if (
        /^(Sembunyikan|Simpan|Penjelasan|Follow|Komunitas|Hadits\.id)/i
          .test(line)
      ) {

        continue;

      }


      translation =
        line;

      break;

    }

  }


  // --------------------------------------
  // FALLBACK TRANSLATION
  // --------------------------------------

  if (!translation) {

    for (
      let i = arabicIndex + 1;
      i < lines.length;
      i++
    ) {

      const line =
        lines[i];


      if (
        line.length < 60
      ) {

        continue;

      }


      if (
        /[\u0600-\u06FF]/.test(
          line
        )
      ) {

        continue;

      }


      if (
        /^[a-z0-9\s.,'"()\-]+$/i.test(
          line
        )
      ) {

        continue;

      }


      translation =
        line;

      break;

    }

  }


  if (
    !translation
  ) {

    return null;

  }


  // --------------------------------------
  // KITAB
  // --------------------------------------

  let kitab = "";


  const kitabMatch =
    text.match(
      /Kitab\s+([^·\n]+?)\s*·\s*No\.\s*\d+/i
    );


  if (
    kitabMatch
  ) {

    kitab =
      kitabMatch[1].trim();

  }


  return {

    collection:
      book.name,

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


// ========================================
// RANDOM HADIS
// ========================================

async function getRandomHadith() {

  /*
    Coba sampai 30 kali.
  */

  for (
    let attempt = 0;
    attempt < 30;
    attempt++
  ) {

    const book =
      BOOKS[
        Math.floor(
          Math.random() *
          BOOKS.length
        )
      ];


    const number =
      Math.floor(
        Math.random() *
        book.max
      ) + 1;


    const url =
      `https://www.hadits.id/hadits/${book.slug}/${number}`;


    try {

      const response =
        await fetch(
          url,
          {
            headers: {

              "User-Agent":
                "Mozilla/5.0",

              "Accept":
                "text/html"

            }

          }
        );


      if (
        !response.ok
      ) {

        continue;

      }


      const html =
        await response.text();


      const hadith =
        extractHadith(
          html,
          book,
          number,
          url
        );


      if (
        hadith &&
        hadith.arabic &&
        hadith.translation
      ) {

        return hadith;

      }

    }

    catch (
      error
    ) {

      continue;

    }

  }


  throw new Error(
    "Tidak berhasil mengambil hadis."
  );

}


// ========================================
// CLOUDFLARE PAGES FUNCTION
// ========================================

export async function onRequestGet() {

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

  catch (
    error
  ) {

    return new Response(

      JSON.stringify({

        ok: false,

        error:
          error.message

      }),

      {

        status: 500,

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

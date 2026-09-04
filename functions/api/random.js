const BOOKS = [
  ["bukhari", 7563, "Shahih Al-Bukhari"],
  ["muslim", 3033, "Shahih Muslim"],
  ["abudawud", 5274, "Sunan Abu Dawud"],
  ["tirmidzi", 3956, "Jami' At-Tirmidzi"],
  ["nasai", 5758, "Sunan An-Nasa'i"],
  ["ibnumajah", 4341, "Sunan Ibnu Majah"],
  ["ahmad", 27647, "Musnad Ahmad"]
];

function clean(text) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function scrape(html, book, number, url) {

  /*
   * Cari teks Arab.
   * Hadits.id menampilkan teks Arab
   * langsung sebagai text node.
   */

  const arabicMatch = html.match(
    />([^<>]*[\u0600-\u06FF][^<>]*)</
  );

  if (!arabicMatch) {
    return null;
  }

  const arabic = clean(arabicMatch[1]);

  if (arabic.length < 20) {
    return null;
  }


  /*
   * Cari terjemahan.
   *
   * Pada halaman Hadits.id:
   *
   * Arab
   * transliterasi
   * Selengkapnya Sembunyikan
   * Terjemahan
   */

  const afterArabic =
    html.substring(
      arabicMatch.index + arabicMatch[0].length
    );


  const translationMatch =
    afterArabic.match(
      /Selengkapnya[\s\S]*?Sembunyikan[\s\S]*?<[^>]*>\s*([^<]{40,})\s*</i
    );


  let translation = "";


  if (translationMatch) {
    translation =
      clean(translationMatch[1]);
  }


  /*
   * Fallback jika struktur HTML berubah.
   */

  if (!translation) {

    const text =
      clean(afterArabic);

    const parts =
      text.split(
        /Simpan|Penjelasan|Follow/i
      );

    if (parts.length) {

      const candidates =
        parts[0]
          .split(/\n/)
          .map(x => x.trim())
          .filter(
            x =>
              x.length > 50 &&
              !/^[a-z0-9\s.,'"()-]+$/i.test(x)
          );

      translation =
        candidates[0] || "";

    }

  }


  if (!translation) {
    return null;
  }


  /*
   * Cari nama kitab.
   */

  let kitab = "";

  const kitabMatch =
    html.match(
      /Kitab\s+([^<·]+?)\s*·\s*No\./i
    );

  if (kitabMatch) {
    kitab =
      clean(kitabMatch[1]);
  }


  /*
   * Cari bab.
   */

  let bab = "";

  const babMatch =
    html.match(
      /<h1[^>]*>([^<]+)<\/h1>/i
    );

  if (babMatch) {
    bab =
      clean(babMatch[1]);
  }


  return {
    collection: book[2],
    number: number,
    kitab: kitab,
    bab: bab,
    arabic: arabic,
    translation: translation,
    url: url
  };
}


async function getRandomHadith() {

  for (let attempt = 0; attempt < 20; attempt++) {

    const book =
      BOOKS[
        Math.floor(
          Math.random() * BOOKS.length
        )
      ];

    const number =
      Math.floor(
        Math.random() * book[1]
      ) + 1;

    const url =
      `https://www.hadits.id/hadits/${book[0]}/${number}`;


    try {

      const response =
        await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0",
            "Accept":
              "text/html"
          }
        });


      if (!response.ok) {
        continue;
      }


      const html =
        await response.text();


      const result =
        scrape(
          html,
          book,
          number,
          url
        );


      if (result) {
        return result;
      }

    } catch (error) {

      continue;

    }

  }


  throw new Error(
    "Gagal mengambil hadis."
  );
}


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
            "no-store"
        }
      }

    );

  } catch (error) {

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
            "no-store"
        }
      }

    );

  }

}

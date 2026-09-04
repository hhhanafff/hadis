export async function onRequestGet() {

  const url =
    "https://www.hadits.id/hadits/muslim/2842";

  try {

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html"
      }
    });

    const html = await response.text();

    return new Response(
      JSON.stringify({
        status: response.status,
        length: html.length,
        preview: html.substring(0, 500)
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {

    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  }
}

export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);

    if (url.pathname === "/scrape") {
      const target = url.searchParams.get("url");

      if (!target) {
        return Response.json(
          { error: "Parameter url wajib diisi." },
          { status: 400, headers: cors }
        );
      }

      let targetUrl;
      try {
        targetUrl = new URL(target);
        if (!["http:", "https:"].includes(targetUrl.protocol)) {
          throw new Error("Hanya URL HTTP/HTTPS yang diperbolehkan.");
        }
      } catch {
        return Response.json(
          { error: "URL tidak valid." },
          { status: 400, headers: cors }
        );
      }

      try {
        const response = await fetch(targetUrl.toString(), {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml"
          },
          redirect: "follow"
        });

        const html = await response.text();

        return new Response(
          JSON.stringify({
            success: response.ok,
            status: response.status,
            finalUrl: response.url,
            html
          }),
          {
            status: response.ok ? 200 : response.status,
            headers: {
              ...cors,
              "Content-Type": "application/json; charset=UTF-8"
            }
          }
        );
      } catch (error) {
        return Response.json(
          { error: "Gagal mengambil halaman: " + error.message },
          { status: 500, headers: cors }
        );
      }
    }

    return new Response("Web Scraper API aktif. Gunakan /scrape?url=https://example.com", {
      headers: cors
    });
  }
};

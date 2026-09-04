# HADIS RANDOM

## Deploy
1. Deploy `worker.js` ke Cloudflare Workers.
2. Salin URL Worker.
3. Buka `index.html`.
4. Ganti:
   GANTI_DENGAN_URL_WORKER_KAMU
   dengan URL Worker kamu.
5. Upload `index.html` ke hosting.

## Endpoint test
Setelah Worker aktif, buka:
https://URL-WORKER-KAMU.workers.dev/scrape?url=https%3A%2F%2Fwww.hadits.id%2Fhadits%2Fmuslim%2F1

Harus keluar JSON yang mempunyai:
"success": true
dan
"html": "..."

Frontend kemudian memilih nomor hadis secara acak dan mengambil halaman Hadits.id tersebut.

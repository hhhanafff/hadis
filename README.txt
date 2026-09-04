# Web Scraper

## 1. Deploy Worker
Upload `worker.js` ke Cloudflare Workers.

## 2. Salin URL Worker
Contoh:
https://nama-worker.username.workers.dev

## 3. Edit index.html
Ubah:
GANTI_DENGAN_URL_WORKER_KAMU

menjadi URL Worker kamu.

## 4. Buka index.html
Masukkan URL website target lalu klik AMBIL DATA.

## Catatan
Versi ini mengambil HTML yang dikirim server. Jika website target merender data menggunakan JavaScript di browser, data tersebut tidak selalu muncul di HTML hasil fetch. Untuk kasus tersebut diperlukan browser rendering/headless browser atau endpoint data yang memang dipanggil halaman tersebut.

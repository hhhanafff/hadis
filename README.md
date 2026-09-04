# Hadis Random — Cloudflare Pages

Website mobile-first yang hanya menampilkan satu hadis random. Refresh halaman atau tekan "Hadis berikutnya" untuk mendapatkan hadis lain.

## Deploy ke Cloudflare Pages

1. Extract ZIP ini.
2. Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Upload assets**.
3. Upload folder hasil extract sebagai project.
4. Deploy.
5. Buka URL Pages Anda.

Penting: folder `functions/api/random.js` harus ikut ter-upload karena itu yang mengambil data Hadits.id dari server Cloudflare.

## Struktur

- `index.html` — tampilan website.
- `functions/api/random.js` — Cloudflare Pages Function.
- `assets/` — folder aset.

## API internal

`/api/random`

Opsional memilih koleksi:
`/api/random?collection=muslim`

Koleksi:
- bukhari
- muslim
- abudawud
- tirmidzi
- nasai
- ibnumajah
- ahmad

Catatan penggunaan:
Website ini mengambil data dari halaman publik Hadits.id. Pastikan penggunaan dan redistribusi konten sesuai ketentuan situs dan hak yang berlaku.

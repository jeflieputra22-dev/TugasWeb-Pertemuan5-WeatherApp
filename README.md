# Weather App — Tugas Rutin 5 (Pemrograman Web)

Aplikasi cuaca sederhana memakai **OpenWeatherMap API**, JavaScript ES6+ (`const`/`let`, arrow function, template literals, destructuring, `async/await`, Fetch API).

## Fitur
- Cari cuaca berdasarkan nama kota: nama kota, suhu, deskripsi, ikon, kelembaban
- Loading state saat data diambil
- Error handling: kota tidak ditemukan (404), network error, input kosong, API key tidak valid (401)
- Array method `map` dan `filter` (riwayat pencarian)
- UI responsif (mobile-friendly)
- **Bonus:** riwayat pencarian (LocalStorage), toggle °C/°F, latar berubah sesuai cuaca

## Cara menjalankan
1. Daftar gratis di https://openweathermap.org dan ambil API key.
2. Buka `app.js`, ganti `YOUR_API_KEY_HERE` dengan API key Anda.
3. Buka `index.html` di browser (atau pakai Live Server di VS Code).

> API key baru aktif beberapa menit sampai 2 jam setelah dibuat.

# Panduan desain website OSIS SMAN 1 Nyuatan

Arah: portal siswa dengan bahasa jurnal kegiatan sekolah. ENERGY 2 / RHYTHM 3 / MOTION 1, ditambah satu animasi centang 0,6 detik setelah kiriman berhasil.

## Berkas kode lengkap

- `index.html`: struktur navigasi, halaman, footer, dan urutan pemuatan skrip.
- `style.css`: seluruh CSS situs, termasuk mesh, kartu, galeri, form, responsif, focus keyboard, dan reduced motion.
- `experience.js`: struktur HTML hero, aspirasi, program/divisi, album, validasi, dan umpan balik kiriman.
- `cms.js`: menampilkan konten terbitan panel admin dan menjaga pengaturan warna/huruf.
- `app.js`: router halaman dan fitur dasar yang sudah ada.

Urutan skrip harus `app.js`, `experience.js`, lalu `cms.js`. Tidak membutuhkan framework atau pustaka tambahan.

## Alasan desain

- Biru pudar mengikuti identitas yang dipilih pemilik; mesh radial beropasitas rendah memberi kedalaman tanpa mengganggu teks.
- Tema terang dipertahankan untuk portal sekolah yang dibaca di berbagai perangkat pada siang hari.
- Huruf sistem mudah dibaca dan tidak memerlukan unduhan font; pilihan huruf dari admin tetap dihormati.
- Form berupa catatan untuk pengurus agar siswa tidak merasa sedang mengisi formulir birokrasi.
- Kartu program berbentuk baris editorial supaya judul, penjelasan, dan tindakan terlihat berurutan.
- Divisi memakai dua kolom bergeser karena tanggung jawab dan panjang teksnya berbeda.
- Foto memakai susunan kolom dan rotasi kecil seperti album dokumentasi; tidak ada foto kegiatan rekaan saat galeri kosong.
- Bayangan dipakai untuk kertas form, album, dan elevasi hover. Semua elemen tidak dibuat melayang.
- Centang hanya menandai respons server yang berhasil, bukan timer keberhasilan palsu.
- Animasi dan transisi dimatikan jika perangkat memilih `prefers-reduced-motion`.

## Struktur HTML form

HTML sebenarnya dibuat di `pages.aspirasi` dalam `experience.js`. Bagian utama:

```html
<section class="aspiration-layout">
  <div class="aspiration-intro">
    <h1>Ada yang mau kamu suarakan?</h1>
    <p>Ide lomba, sudut sekolah yang perlu dibenahi, atau hal kecil yang bikin kepikiran.</p>
  </div>
  <section class="aspiration-paper" aria-label="Formulir aspirasi siswa">
    <form id="aspiration-form" class="form" novalidate>
      <div class="asp-fields">
        <label for="topic">Kamu mau bahas apa?</label>
        <select id="topic" name="topic"><option>Kegiatan siswa</option></select>
        <label for="idea">Ceritain di sini</label>
        <textarea id="idea" name="idea" minlength="10" maxlength="3000"
          placeholder="Tulis kritik, saran, atau ide event seru untuk sekolah kita di sini..."></textarea>
        <button class="btn" type="submit">Kirim ke pengurus</button>
      </div>
      <div class="send-success" hidden><h2>Sudah masuk. Makasih, ya.</h2></div>
      <div id="draft-status" class="status" role="status" aria-live="polite"></div>
    </form>
  </section>
</section>
```

Cuplikan ini menjelaskan susunannya. Gunakan berkas `experience.js` lengkap untuk semua label bantuan, kategori, penghitung karakter, validasi, SVG sukses, dan tombol draf.

## CSS yang paling mudah disesuaikan

Semua kode lengkap ada di `style.css`. Contoh bagian utamanya:

```css
body {
  background-color: var(--paper);
  background-image:
    radial-gradient(ellipse 80% 620px at 2% 8%, #c7dceb80, transparent 75%),
    radial-gradient(ellipse 65% 640px at 98% 37%, #dce9f299, transparent 78%);
}
.program-card:hover, .program-card:focus-within {
  transform: translateY(-4px);
  border-color: #537d9e;
  box-shadow: 0 12px 24px #2d4b6214;
}
.memory-wall { columns: 3 235px; column-gap: 30px; }
.memory { break-inside: avoid; transform: rotate(-.8deg); }
.memory:nth-child(3n + 2) { transform: rotate(1.1deg); }
.memory:hover, .memory:focus-within { transform: rotate(0) translateY(-4px); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

Ubah warna dan huruf melalui panel admin. Untuk jarak dan layout, ubah class terkait di CSS. Atur isi hero melalui **Beranda & Logo**. Teks hero lama yang masih berupa judul sekolah dan slogan stok diberi pengganti saat tampil; teks khusus yang ditulis pemilik tetap dipakai.

## Alur kiriman

1. Validasi 10–3000 karakter, pertahankan label dan pesan kesalahan.
2. Kirim JSON `{topic, idea, requestId}` ke endpoint `/api/aspirations` yang sudah digunakan situs.
3. Nonaktifkan kontrol selama permintaan berjalan untuk mencegah klik ganda.
4. Tampilkan centang dan ucapan terima kasih hanya setelah respons `{ok:true}`.
5. Jika gagal/timeout, simpan tulisan di form. Request ID yang sama dipakai saat mencoba ulang agar server tidak menggandakan pesan.
6. **Simpan dulu** tetap menyimpan draf di perangkat dan tidak mengirim ke admin.

Pengiriman tetap tanpa nama dan masuk ke **Rekapitulasi Aspirasi**, bukan ke galeri atau berita publik. Draf dan konten terbitan tidak diubah oleh tampilan baru.

## Tiga opsi hero

### 1. Dipakai pada tampilan awal

Tagline: Kabar, kegiatan, dan suara siswa di Nyuatan.

Judul: Sekolah ini punya kita.

Subjudul: Dari kelas di Nyuatan, ide kecil bisa jadi awal kegiatan yang berarti. Cek rencana OSIS, ikuti kabarnya, atau titipkan usulmu.

Tombol: Titipkan idemu / Lihat rencana OSIS.

### 2. Lebih berani mengajak

Tagline: Buat teman-teman SMAN 1 Nyuatan.

Judul: Jangan cuma jadi penonton di sekolah sendiri.

Subjudul: Punya ide lomba, kegiatan, atau hal yang perlu dibenahi? Sampaikan ke OSIS. Kita mulai dari usul yang jelas dan langkah yang bisa dikerjakan.

Tombol: Aku punya usul / Cek program kerja.

### 3. Lebih hangat dan lokal

Tagline: Cerita pelajar dari Kutai Barat.

Judul: Dari obrolan di kelas, jadi ide buat sekolah.

Subjudul: Ada banyak hal yang kita temui setiap hari di SMAN 1 Nyuatan. Di sini kamu bisa mengikuti kabar pengurus, melihat kegiatan, dan menitipkan masukan tanpa harus menunggu rapat.

Tombol: Titip masukan / Baca kabar sekolah.

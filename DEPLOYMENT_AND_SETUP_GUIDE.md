# 🌸 Jane × Josh Universe — Panduan Lengkap Supabase & Vercel

Panduan praktis langkah demi langkah untuk menghubungkan **Supabase** dan mendeploy ke **Vercel**.

---

## 📋 DAFTAR ISI
1. [Bagian 1: Konfigurasi Supabase](#bagian-1-konfigurasi-supabase)
   - [Langkah 1: Jalankan SQL Migration](#langkah-1-jalankan-sql-migration)
   - [Langkah 2: Buat Akun Josh & Jane](#langkah-2-buat-akun-josh--jane)
   - [Langkah 3: Assign Role Profile](#langkah-3-assign-role-profile)
   - [Langkah 4: Setup Storage Bucket Foto](#langkah-4-setup-storage-bucket-foto)
   - [Langkah 5: Aktifkan Realtime](#langkah-5-aktifkan-realtime)
2. [Bagian 2: Deploy ke Vercel](#bagian-2-deploy-ke-vercel)
   - [Langkah 1: Push ke GitHub](#langkah-1-push-ke-github)
   - [Langkah 2: Import ke Vercel & Set Environment Variables](#langkah-2-import-ke-vercel--set-environment-variables)
   - [Langkah 3: Selesai & Live!](#langkah-3-selesai--live)
3. [Ringkasan URL & Akun](#ringkasan-url--akun)

---

## 🗄️ BAGIAN 1: Konfigurasi Supabase

Buka dashboard Supabase kamu di: [https://supabase.com/dashboard/project/nndxgxeqbcppoycabpuw](https://supabase.com/dashboard/project/nndxgxeqbcppoycabpuw)

### Langkah 1: Jalankan SQL Migration
1. Di menu sidebar kiri Supabase, klik ikon **SQL Editor**.
2. Klik tombol **New query**.
3. Buka file [`supabase/migrations/001_initial.sql`](./supabase/migrations/001_initial.sql) di IDE ini, copy seluruh kodenya (`Ctrl+A` lalu `Ctrl+C`).
4. Paste ke SQL Editor Supabase, lalu klik tombol **Run** (hijau di kanan bawah).
5. Pastikan muncul pesan `Success. No rows returned`.

---

### Langkah 2: Buat Akun Josh & Jane
1. Di sidebar kiri, klik **Authentication** → **Users**.
2. Klik tombol **Add user** → pilih **Create user**:
   * **Akun Josh**:
     * Email: `josh@jane-josh.app`
     * Password: *(buat password yang kamu ingat)*
     * Centang **Auto confirm user?** ✅
     * Klik **Create user**.
   * **Akun Jane**:
     * Email: `jane@jane-josh.app`
     * Password: *(buat password untuk Jane)*
     * Centang **Auto confirm user?** ✅
     * Klik **Create user**.

---

### Langkah 3: Assign Role Profile
Kembali ke **SQL Editor** di Supabase, buat **New query**, lalu paste dan jalankan query berikut:

```sql
-- 1. Setup Profil Josh
UPDATE profiles 
SET username = 'josh', display_name = 'Josh', avatar_emoji = '💻'
WHERE id = (SELECT id FROM auth.users WHERE email = 'josh@jane-josh.app');

-- 2. Setup Profil Jane
UPDATE profiles 
SET username = 'jane', display_name = 'Jane', avatar_emoji = '🌸'
WHERE id = (SELECT id FROM auth.users WHERE email = 'jane@jane-josh.app');
```
*Klik **Run**. Sekarang sistem mengenali Josh sebagai admin (💻) dan Jane sebagai VIP (🌸).*

---

### Langkah 4: Setup Storage Bucket Foto
Untuk fitur **Memory Archive (`/memories`)** upload foto polaroid:

1. Di sidebar kiri, klik **Storage**.
2. Klik **New bucket**.
3. Masukkan konfigurasi berikut:
   * **Name**: `memories`
   * **Public bucket**: Aktifkan toggle **ON** (Hijau) ✅
4. Klik **Save**.
5. Buka kembali **SQL Editor**, lalu jalankan policy SQL ini untuk mengizinkan upload:

```sql
-- Izinkan upload foto untuk user yang login
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'memories');

-- Izinkan semua orang melihat foto publik
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'memories');
```

---

### Langkah 5: Aktifkan Realtime
Agar surat baru, mood, dan interaksi pet muncul seketika tanpa refresh:

1. Di sidebar kiri, klik **Database** → **Replication**.
2. Di tabel `supabase_realtime`, aktifkan toggle **ON** pada 6 tabel ini:
   * [x] `letters`
   * [x] `moods`
   * [x] `pet`
   * [x] `pet_actions`
   * [x] `surprises`
   * [x] `profiles`

---

## 🚀 BAGIAN 2: Deploy ke Vercel

### Langkah 1: Push ke GitHub Kamu
Buka terminal dan jalankan:

```bash
# 1. Buat repository baru di github.com/new (misal: jane-josh-universe)
# 2. Hubungkan remote dan push:
git remote add origin https://github.com/USERNAME-KAMU/jane-josh-universe.git
git branch -M main
git push -u origin main
```

---

### Langkah 2: Import ke Vercel & Set Environment Variables
1. Buka [https://vercel.com](https://vercel.com) → login.
2. Klik tombol **Add New...** → **Project**.
3. Pilih repository `jane-josh-universe` yang baru saja kamu push.
4. Di bagian **Environment Variables**, masukkan 2 variabel ini:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nndxgxeqbcppoycabpuw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZHhneGVxYmNwcG95Y2FicHV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MTgwOTAsImV4cCI6MjEwMjk5NDA5MH0.0EMSHgzMi9PwHdxSOCfD-4P6RxjY5KTBuws4dUfTSNQ` |

5. Klik tombol **Deploy**! 🚀

---

### Langkah 3: Selesai & Live! 🎉
Dalam ~1 menit, website kamu sudah resmi online di alamat seperti `https://jane-josh-universe.vercel.app`.

---

## 🗺️ Ringkasan Fitur & Easter Eggs

| Halaman | URL | Keterangan |
|---|---|---|
| 🏠 **Home Dashboard** | `/` | Bento grid realtime 10 widget |
| 🪄 **Our 3D Room** | `/room` | Kamar 3D interaktif Three.js |
| 💌 **Mailbox** | `/letters` | Kirim & baca surat rahasia |
| 🎧 **Soundtrack** | `/music` | Playlist lagu Jane & Josh |
| 📸 **Memories** | `/memories` | Foto polaroid & scrapbook |
| 🌸 **Jane Lore™** | `/jane` | Karakter RPG (Bisa diedit oleh Jane) |
| 💭 **Daily Corner** | `/daily` | Pertanyaan harian & mood tracker |
| 🎁 **Surprise Box** | `/surprises` | Kado rahasia + animasi confetti |
| 🧠 **Jane Quiz** | `/quiz` | Kuis interaktif menguji pengetahuan tentang Jane |
| 🔐 **Secret Room** | `/secret` | Surat cinta terminal retro (Klik komputer di 3D room) |

### 🎮 Easter Eggs Rahasia:
* **Klik Logo 7×** → Memunculkan pesan rahasia & konfeti.
* **Konami Code** (`↑` `↑` `↓` `↓` `←` `→` `←` `→` `B` `A`) → Ledakan confetti di layar!
* **Komputer di 3D Room** → Membuka akses ke `/secret`.
* **Cursor Trail** → Partikel cinta dan bunga mengikuti gerakan mouse.

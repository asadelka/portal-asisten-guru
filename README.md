# Portal Asisten Guru BK — Vercel Deployment

## Struktur Proyek

```
vercel-project/
├── api/
│   └── analisis.js       ← Backend proxy (API key aman di sini)
├── public/
│   └── index.html        ← Frontend aplikasi
├── .env.example          ← Template environment variable
├── .gitignore
└── vercel.json           ← Konfigurasi routing Vercel
```

## Cara Deploy ke Vercel

### Langkah 1 — Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

### Langkah 2 — Import di Vercel
1. Buka https://vercel.com → Login dengan akun GitHub
2. Klik **"Add New Project"**
3. Pilih repository ini → Klik **"Import"**
4. Klik **"Deploy"** (tanpa ubah apapun)

### Langkah 3 — Tambah API Key (PENTING)
1. Di dashboard Vercel → Project → **Settings → Environment Variables**
2. Tambahkan:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `gsk_xxxx...` (API key Groq kamu)
   - Environment: centang **Production**, **Preview**, **Development**
3. Klik **Save**
4. Klik **Deployments → Redeploy** agar env variable aktif

### Langkah 4 — Selesai
Aplikasi sudah online di `https://nama-project.vercel.app`

---

## Development Lokal

```bash
npm install -g vercel
cp .env.example .env.local
# Edit .env.local, isi GROQ_API_KEY dengan key asli
vercel dev
```

## Keamanan
- API key **tidak pernah** ada di file HTML atau JavaScript frontend
- Semua request ke Groq melewati `/api/analisis` di server
- File `.env.local` di-ignore oleh Git

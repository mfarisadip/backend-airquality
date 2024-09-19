# Dokumentasi Proyek: API CRUD Sensor Lingkungan dan Dashboard

## Daftar Isi
1. [Pengantar](#pengantar)
2. [Struktur Proyek](#struktur-proyek)
3. [Instalasi](#instalasi)
4. [Penggunaan API](#penggunaan-api)
5. [Dashboard](#dashboard)
6. [Pengembangan](#pengembangan)
7. [Lisensi](#lisensi)

## Pengantar

Proyek ini terdiri dari dua komponen utama:
1. API CRUD untuk mengelola data sensor lingkungan
2. Dashboard untuk visualisasi data sensor

API dikembangkan menggunakan ElysiaJS dengan database PostgreSQL, sementara dashboard dibuat menggunakan Svelte dan Tailwind CSS.

## Struktur Proyek

```
project-root/
├── prisma/
│   ├── database/
│   │   └── ISPU_Jakarta_2024.sql
│   ├── migrations/
│   ├── schema.prisma/
├── src/
│   ├── controllers/
│   │   └── airQualityController.ts
│   ├── models/
│   │   └── airQualityModel.ts
│   ├── utils/
│   │   └── airQualityUtils.ts
│   ├── middleware/
│   │   └── authMiddleware.ts
│   └── index.ts
├── tests/
├── .env
├── .gitignore
├── bun.lockb
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## Instalasi

### Prasyarat
- Bun
- PostgreSQL

### Langkah-langkah

1. Clone repository:
   ```
   git clone https://github.com/mfarisadip/backend-airquality.git
   cd backend-airquality
   ```

2. Instal dependensi backend:
   ```
   cd backend-airquality
   bun install
   ```

3. Clone Frontend:
   ```
   git clone https://github.com/mfarisadip/frontend-airquality.git
   cd frontend-airquality
   ```

4. Instal dependensi frontend:
   ```
   cd frontend-airquality
   bun install
   ```

## Penggunaan API

API menyediakan endpoint berikut:

- `POST /api/v1/air-quality   `: Membuat data sensor baru
- `GET /api/v1/air-quality`: Mengambil semua data sensor
- `GET /api/v1/air-quality/:id`: Mengambil data sensor berdasarkan ID
- `PUT /api/v1/air-quality/:id`: Memperbarui data sensor
- `DELETE /api/v1/air-quality/:id`: Menghapus data sensor

### Autentikasi

API menggunakan autentikasi bearer token. Sertakan token dalam header Authorization untuk setiap request:

```
Authorization: Bearer <your-token-here>
```

### Contoh Penggunaan

```bash
# Membuat sensor baru
curl -X POST http://localhost:3000/api/v1/air-quality \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"location": "Area1", "parameter": "PM2.5", "value": 35}'

# Mengambil semua data sensor
curl http://localhost:3000/api/v1/air-quality \
  -H "Authorization: Bearer <your-token>"
```

## Dashboard

Dashboard dapat diakses melalui browser di `http://localhost:5000` setelah menjalankan aplikasi Svelte.

Fitur utama dashboard:
- Visualisasi data sensor dalam bentuk grafik dan tabel
- Formulir untuk menambah dan mengedit data sensor

## Pengembangan

### Menjalankan API dalam mode development

```
cd backend-airquality
bun dev
```

API akan berjalan di `http://localhost:3000`.

### Menjalankan Dashboard dalam mode development

```
cd frontend-airquality
bun dev
```

Dashboard akan tersedia di `http://localhost:5000`.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

# 📦 Kabtour - Backend Developer Test

**Teknologi yang Digunakan**:

- NestJS
- TypeORM
- PostgreSQL
- Typescript
- ts-jest

---

## 📑 Daftar Isi

- [📦 Kabtour App ](#-kabtour-app)
  - [📑 Daftar Isi](#-daftar-isi)
  - [📑 Tentang Aplikasi](#-tentang-aplikasi)
    - [🧱 Struktur Table & Diagram relasi](#-struktur-table-diagram-relasi)
    - [🌱 Seeder Dummyi](#-seeder-dummyi)
  - [🔗 Dokumentasi API](#-Dokumentasi-api)
  - [📁 Struktur Proyek](#-struktur-proyek)
  - [🔧 Prasyarat](#-prasyarat)
  - [🛠️ Setup](#-setup)
  - [🧪 Unit Tase](#-unit-tase)
  - [🚀 Menjalankan Aplikasi](#-menjalankan-aplikasi)

---

## 📑 Tentang Aplikasi

Aplikasi **Kabtour** adalah backend service untuk sistem manajemen transaksi berbasis produk yang dikembangkan menggunakan framework **NestJS** dan database **PostgreSQL**. Aplikasi ini dirancang modular dan scalable untuk mengelola tiga entitas utama:

- **Users** – merepresentasikan pengguna sistem, yang dapat menjadi customer atau owner.
- **Products** – data produk yang dijual oleh user yang type nya owner.
- **Transactions** – representasi transaksi pembelian produk, yang bisa melakukan transaksi hanya user yang type nya customer, lalu update status yang default nya PENDING bisa REJECTED atau ACCEPTED, khusus update status untuk hanya bisa dilakukan owner yang mempunyai product tersebut

---

### 🧱 Struktur Table & Diagram relasi

### 1. 🧑 Users

| Kolom     | Tipe Data | Keterangan              |
| --------- | --------- | ----------------------- |
| id        | integer   | Primary key             |
| name      | string    | Nama user               |
| email     | string    | Email user (unik)       |
| type_user | string    | `customer` atau `owner` |
| createdAt | timestamp | Tanggal dibuat          |
| updatedAt | timestamp | Tanggal diubah          |

---

### 2. 📦 Products

| Kolom       | Tipe Data | Keterangan                 |
| ----------- | --------- | -------------------------- |
| id          | integer   | Primary key                |
| name        | string    | Nama produk                |
| price       | number    | Harga produk               |
| description | text      | Deskripsi produk           |
| stock       | integer   | Jumlah stok                |
| createdAt   | timestamp | Tanggal dibuat             |
| updatedAt   | timestamp | Tanggal diubah             |
| ownerId     | integer   | Foreign key ke `users(id)` |

---

### 3. 💰 Transactions

| Kolom      | Tipe Data | Keterangan                         |
| ---------- | --------- | ---------------------------------- |
| id         | integer   | Primary key                        |
| quantity   | integer   | Jumlah produk yang dibeli          |
| totalPrice | number    | Total harga                        |
| status     | string    | PENDING, REJECTED, ACCEPTE         |
| createdAt  | timestamp | Tanggal dibuat                     |
| updatedAt  | timestamp | Tanggal diubah                     |
| customerId | integer   | Foreign key ke `users(id)` (buyer) |
| productId  | integer   | Foreign key ke `products(id)`      |

---

## 🌱 Seeder Dummyi

Secara default anda akan mendapatkan user & product dummy, ketika aplikasi di jalankan

### 📂 Lokasi File

- `src/seeder/user.seeder.ts`
- `src/seeder/product.seeder.ts`

---

### 🧑 Dummy Users

Seeder akan membuat 2 user:

| Name       | Email                | Type_user |
| ---------- | -------------------- | --------- |
| nurmaarizd | nurmaarizd@gmail.com | OWNER     |
| customer   | customer@example.com | CUSTOMER  |

Seeder akan **mengecek terlebih dahulu** apakah user dengan type OWNER sudah ada sebelum membuat data baru.

---

### 📦 Dummy Products

Seeder akan membuat produk dummy yang dimiliki oleh user OWNER:

| Name                 | Stock | Price  |
| -------------------- | ----- | ------ |
| Kemeja Katun Premium | 10    | 250000 |
| Celana Chino Pria    | 20    | 180000 |
| Jaket Parka Wanita   | 0     | 350000 |

Seeder hanya berjalan jika belum ada produk sebelumnya.

---

### Fitur Utama:

- ✅ Manajemen User
- ✅ Manajemen Produk
- ✅ Transaksi
- ✅ Validasi produk saat transaksi dan update status transaksi
- ✅ API telah terdokumentasi dengan baik via Postman

---

---

## 🔗 Dokumentasi API

**Dokumentasi API**

```bash
https://documenter.getpostman.com/view/19287808/2sB34oCHP2
```

---

## 📁 Struktur Proyek

```
takaboure/
├── config/
│ └── databases/
│   └── database.config.ts
├── dist/ # Hasil build (output)
├── node_modules/
├── src/
│ ├── common/ # Pipe dan helper global
│ │ └── setupValidationPipeResponse.ts
│ ├── models/ # Entitas database (TypeORM)
│ │ ├── products/entities/product.entity.ts
│ │ ├── transactions/entities/Transaction.entities.ts
│ │ └── users/entities/user.entities.ts
│ ├── modules/
│ │ ├── products/
│ │ │ ├── dto/
│ │ │ ├── test/
│ │ │ ├── products.controller.ts
│ │ │ ├── products.module.ts
│ │ │ └── products.service.ts
│ │ ├── transactions/
│ │ │ ├── dto/
│ │ │ ├── transactions.controller.ts
│ │ │ ├── transactions.module.ts
│ │ │ └── transactions.service.ts
│ │ └── users/
│ │ │ ├── test/
│ │ ├── users.controller.ts
│ │ ├── users.module.ts
│ │ └── users.service.ts
│ ├── seeder/
│ │ ├── product.seeder.ts
│ │ └── user.seeder.ts
│ ├── app.controller.ts
│ ├── app.module.ts
│ └── app.service.ts
├── README.md
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## 🔧 Prasyarat

Pastikan Anda telah menginstal:

- Node.js (v20 atau lebih baru)
- PostgreSQL

---

## 🛠️ Setup

1. **Install Dependensi**

   ```bash
   npm install
   ```

2. **Konfigurasi .env**

   ```bash
   Rubah file .env.example menjadi .env
   ```

3. **Konfigurasi dataase**
   - pastikan anda sudah membuat databse dan konfigurasi database .env

   ```bash
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=kabtour
   ```

---

## 🛠️ Unit Tase

1. **Untuk per masing-masing test**

   ```bash
   npm run test user
   ```

   ```bash
   npm run test product
   ```

2. **Semua tes**

   ```bash
   npm run test

   ```

---

## 🚀 Menjalankan Aplikasi

1. **Development Mode**

   ```bash
   npm run start
   ```

2. **Watch Mode**

   ```bash
   npm run start:dev

   ```

3. **Build untuk Production**

   ```bash
   npm run start:prod
   ```

---

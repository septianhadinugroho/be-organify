# Organify API

Organify API adalah layanan backend yang dibangun untuk aplikasi to-do list "Organify". API ini menyediakan fungsionalitas untuk manajemen tugas, kategori, pengguna, dan otentikasi. Dibangun dengan Node.js dan framework Hapi, serta menggunakan MongoDB sebagai database.

## Fitur Utama

* **Manajemen Pengguna:**
    * Pendaftaran pengguna baru dengan verifikasi OTP melalui email.
    * Login pengguna dengan otentikasi berbasis JWT (JSON Web Token).
    * Fitur lupa password dan reset password melalui OTP.
    * Penghapusan akun pengguna.
* **Manajemen Catatan (Tugas) Per Pengguna:**
    * Membuat, membaca, memperbarui, dan menghapus catatan (CRUD) yang terikat pada pengguna yang terotentikasi.
    * Memfilter catatan berdasarkan status (selesai/belum selesai) dan deadline (dalam 7 hari).
    * Menghapus semua catatan yang sudah selesai secara massal.
* **Manajemen Todo Item (Sub-tugas) Per Pengguna:**
    * Menambah, memperbarui, dan menghapus *todo item* di dalam sebuah catatan.
* **Manajemen Kategori Per Pengguna:**
    * Membuat kategori baru yang terikat pada pengguna.
    * Mendapatkan daftar semua kategori beserta jumlah catatan yang terkait untuk pengguna yang sedang login.
* **Visualisasi Data Per Pengguna:**
    * Menyediakan data untuk grafik yang menampilkan jumlah tugas yang selesai dalam rentang 7 hari dari tanggal yang ditentukan, spesifik untuk pengguna yang login.

## Teknologi yang Digunakan

* **Backend:** Node.js, Hapi.js
* **Database:** MongoDB (dengan Mongoose ODM)
* **Otentikasi:** JSON Web Token (JWT)
* **Validasi:** Joi
* **Email Service:** Nodemailer (untuk pengiriman OTP)
* **Deployment:** Vercel

## Struktur Proyek

```

.
├── controllers/      # Logika bisnis untuk setiap route
│   ├── catatanController.js
│   ├── grafikController.js
│   ├── kategoriController.js
│   └── userController.js
├── models/           # Skema database Mongoose
│   ├── catatan.js
│   ├── kategori.js
│   └── user.js
├── routes/           # Definisi route dan validasi
│   ├── index.js
│   └── userRoutes.js
├── utils/            # Utilitas pendukung
│   └── mailer.js
├── .gitignore        # File yang diabaikan oleh Git
├── package.json      # Daftar dependensi dan skrip proyek
├── server.js         # Titik masuk utama aplikasi (server Hapi)
└── vercel.json       # Konfigurasi untuk deployment di Vercel

````

## Setup & Instalasi Lokal

1.  **Clone repository:**

    ```bash
    git clone <URL_REPOSITORY_ANDA>
    cd be-organify
    ```

2.  **Install dependensi:**

    ```bash
    npm install
    ```

3.  **Buat file `.env`:**
    Salin isi dari `.env.example` (jika ada) atau buat file `.env` baru di root proyek dan isi variabel lingkungan yang dibutuhkan:

    ```env
    MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
    JWT_SECRET=rahasia_super_aman
    PORT=3001
    NODE_ENV=development

    # Konfigurasi Nodemailer (Gmail)
    EMAIL_USER=emailanda@gmail.com
    EMAIL_PASS=password_app_gmail_anda

    # URL Frontend untuk link verifikasi
    CLIENT_URL=http://localhost:3000
    ```

    > **Penting:** Untuk `EMAIL_PASS`, gunakan "App Password" dari akun Google Anda jika 2-Step Verification aktif.

4.  **Jalankan server:**

    ```bash
    npm start
    ```

    Server akan berjalan di `http://localhost:3001` (atau port yang didefinisikan di `.env`).

## Ringkasan API Endpoints

Semua endpoint yang memerlukan otentikasi harus menyertakan token JWT pada header `Authorization`.
**Format:** `Authorization: Bearer <token>`

### User

| Method | Endpoint | Deskripsi | Otentikasi |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Mendaftarkan pengguna baru. | Tidak |
| `POST` | `/login` | Login dan mendapatkan token JWT. | Tidak |
| `GET` | `/verify-email` | Verifikasi email melalui token dari link. | Tidak |
| `POST` | `/verify-otp` | Verifikasi email menggunakan kode OTP. | Tidak |
| `POST` | `/forgot-password` | Mengirim OTP untuk reset password. | Tidak |
| `POST` | `/reset-password` | Mereset password dengan OTP baru. | Tidak |
| `DELETE` | `/delete-account` | Menghapus akun pengguna yang sedang login. | **JWT** |

### Catatan (Tugas)

| Method | Endpoint | Deskripsi | Otentikasi |
| :--- | :--- | :--- | :--- |
| `POST` | `/catatan` | Membuat catatan baru. | **JWT** |
| `GET` | `/catatan` | Mendapatkan semua catatan milik pengguna. | **JWT** |
| `GET` | `/catatan/{id}` | Mendapatkan detail satu catatan milik pengguna. | **JWT** |
| `PUT` | `/catatan/{id}` | Memperbarui catatan milik pengguna. | **JWT** |
| `DELETE` | `/catatan/{id}` | Menghapus satu catatan milik pengguna. | **JWT** |
| `GET` | `/catatan/filter` | Memfilter catatan (deadline 7 hari, status belum selesai) milik pengguna. | **JWT** |
| `DELETE` | `/catatan/hapusBeres`| Menghapus semua catatan milik pengguna dengan `status: true`. | **JWT** |

### Todo Item (Sub-tugas)

Setiap catatan hanya dapat memiliki satu `todoItem`.

| Method | Endpoint | Deskripsi | Otentikasi |
| :--- | :--- | :--- | :--- |
| `POST` | `/catatan/{id}/todoItem` | Menambahkan todo item ke catatan milik pengguna. | **JWT** |
| `PUT` | `/catatan/{id}/todoItem` | Memperbarui todo item di catatan milik pengguna. | **JWT** |
| `DELETE` | `/catatan/{id}/todoItem` | Menghapus todo item dari catatan milik pengguna. | **JWT** |

### Kategori

| Method | Endpoint | Deskripsi | Otentikasi |
| :--- | :--- | :--- | :--- |
| `GET` | `/kategori` | Mendapatkan semua kategori & jumlah catatan terkait milik pengguna. | **JWT** |
| `POST` | `/kategori` | Membuat kategori baru milik pengguna. | **JWT** |

### Grafik

| Method | Endpoint | Deskripsi | Otentikasi |
| :--- | :--- | :--- | :--- |
| `GET` | `/grafik`| Mendapatkan data jumlah tugas selesai untuk 7 hari milik pengguna (Query: `tanggalAwal`). | **JWT** |

# 📚 EduMatch - Platform Mentoring Digital

EduMatch adalah platform mentoring digital yang menghubungkan mahasiswa (mentee) dengan mentor berpengalaman. Platform ini memungkinkan pencarian mentor, penjadwalan sesi, komunikasi terintegrasi, dan sistem rating & review.

## ✨ Fitur Utama

- **Autentikasi** - Login/Register dengan role (Admin, Mentor, Mentee)
- **Admin Dashboard** - Kelola pengguna, verifikasi mentor, pantau transaksi
- **Mentor Dashboard** - Kelola profil, jadwal, sesi mentoring, dan pendapatan
- **Mentee Dashboard** - Cari mentor, booking sesi, riwayat & tagihan
- **Virtual Meeting** - Integrasi Google Meet untuk sesi mentoring online
- **Sistem Pembayaran** - Tagihan dan riwayat pembayaran

## 🛠️ Teknologi

### Backend
- Django 4.2.7
- Django REST Framework
- PostgreSQL / SQLite
- JWT Authentication

### Frontend
- React 18
- Vite
- Axios
- React Router DOM

## 🚀 Cara Menjalankan

### Prasyarat
- Python 3.11+
- Node.js 18+
- pip
- npm

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
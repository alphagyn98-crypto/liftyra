# WA Blast Setup Guide

Panduan setup integrasi WhatsApp Blast untuk notifikasi member.

## Prerequisites

1. WA Blast Server running (default: `http://localhost:3000`)
2. Master API Key dari WA Blast server

## Setup Steps

### 1. Buat Session WhatsApp

```bash
curl -X POST 'http://localhost:3000/api/v1/sessions' \
  -H 'X-Master-Key: YOUR_MASTER_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"sessionId": "gym-session"}'
```

Response:
```json
{
  "status": "success",
  "message": "Session gym-session created.",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Simpan token ini!**

### 2. Scan QR Code

Buka WA Blast admin dashboard di `http://localhost:3000/admin/dashboard.html` dan scan QR code dengan WhatsApp.

### 3. Konfigurasi Backend

Edit file `backend/.env`:

```env
# WA Blast Configuration
WA_BLAST_API_URL=http://localhost:3000/api/v1
WA_BLAST_SESSION_ID=gym-session
WA_BLAST_TOKEN=eyJhbGciOiJIUzI1NiIs...
```

### 4. Restart Backend

```bash
cd backend
npm run dev
```

### 5. Test Koneksi

Buka Settings > WA Blast di aplikasi, cek status koneksi, dan kirim pesan test.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| WA_BLAST_API_URL | Base URL WA Blast API v1 | `http://localhost:3000/api/v1` |
| WA_BLAST_SESSION_ID | Session ID yang dibuat | `gym-session` |
| WA_BLAST_TOKEN | Bearer token dari create session | `eyJhbGciOiJIUzI1NiIs...` |

## Fitur Notifikasi

### Notifikasi Otomatis (via code)

Service `WABlastService` menyediakan method untuk berbagai notifikasi:

| Method | Trigger |
|--------|---------|
| `notifyMembershipRequestSubmitted` | Member submit pendaftaran |
| `notifyMembershipRequestApproved` | Admin approve pendaftaran |
| `notifyMembershipRequestRejected` | Admin reject pendaftaran |
| `notifyMembershipSale` | Pembelian membership |
| `notifyPTSessionSale` | Pembelian PT session |
| `notifyMembershipExpiringSoon` | Reminder expiry (1/3/7 hari) |
| `notifyMembershipExpired` | Membership expired |
| `notifyBirthdayGreeting` | Ulang tahun member |
| `notifyCheckinSuccess` | Check-in berhasil |

### Notifikasi Manual (via UI)

Di Settings > WA Blast:

1. **Kirim Pesan Test** - Test koneksi dengan nomor sendiri
2. **Reminder Expiry** - Kirim reminder ke member yang akan expired
3. **Ucapan Ulang Tahun** - Kirim ucapan ke member yang ultah hari ini

### Bulk Message (via API)

```bash
POST /api/wa-blast/bulk
{
  "profileIds": ["uuid1", "uuid2", "uuid3"],
  "message": "Halo {name}, ini pesan broadcast!",
  "delayMs": 3000
}
```

Variable `{name}` akan diganti dengan nama member.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wa-blast/status` | Cek status koneksi |
| POST | `/api/wa-blast/test` | Kirim pesan test |
| POST | `/api/wa-blast/send` | Kirim pesan ke member |
| POST | `/api/wa-blast/bulk` | Kirim bulk message |
| GET | `/api/wa-blast/preview/expiry` | Preview member expiring |
| POST | `/api/wa-blast/reminders/expiry` | Kirim reminder expiry |
| GET | `/api/wa-blast/preview/birthday` | Preview member ultah |
| POST | `/api/wa-blast/reminders/birthday` | Kirim ucapan ultah |

## Troubleshooting

### Session Disconnected

1. Buka WA Blast admin dashboard
2. Scan ulang QR code
3. Refresh status di Settings > WA Blast

### Message Failed

1. Pastikan nomor format benar (628xxx tanpa +)
2. Cek session status CONNECTED
3. Cek rate limit (max 100 req/menit)

### Token Invalid

1. Buat session baru dengan Master API Key
2. Update token di `.env`
3. Restart backend

## Best Practices

1. **Delay antar pesan**: Minimum 3 detik untuk menghindari ban
2. **Batch size**: Maksimal 500 penerima per batch
3. **Timing**: Hindari kirim di jam 22:00 - 07:00
4. **Personalisasi**: Gunakan nama member untuk engagement lebih baik

## Referensi

Lihat dokumentasi lengkap API di folder `docs/`:
- [Quick Start](docs/1-QUICK-START.md)
- [API Reference](docs/2-API-REFERENCE.md)
- [Campaign & Blast](docs/3-CAMPAIGN-BLAST.md)
- [Webhook & Events](docs/4-WEBHOOK-EVENTS.md)

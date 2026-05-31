# WA Blast Integration Guide

Dokumentasi lengkap cara mengintegrasikan WA Blast ke project lain.

## Daftar Isi

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup WA Blast Server](#setup-wa-blast-server)
4. [Backend Integration](#backend-integration)
5. [Frontend Integration](#frontend-integration)
6. [API Reference](#api-reference)
7. [Template Notifikasi](#template-notifikasi)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Overview

WA Blast adalah sistem untuk mengirim pesan WhatsApp secara programmatic. Integrasi ini memungkinkan:

- Kirim notifikasi otomatis (membership, transaksi, reminder)
- Kirim pesan manual ke member
- Bulk messaging dengan personalisasi
- Reminder otomatis (expiry, birthday)

### Arsitektur

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │────▶│  WA Blast   │
│   (React)   │     │  (Express)  │     │   Server    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Database   │
                    │  (Prisma)   │
                    └─────────────┘
```

---

## Prerequisites

1. **WA Blast Server** - Server WhatsApp API (self-hosted atau cloud)
2. **Node.js** >= 18
3. **Database** dengan Prisma ORM
4. **WhatsApp** yang akan digunakan untuk mengirim pesan

---

## Setup WA Blast Server

### 1. Buat Session WhatsApp

```bash
curl -X POST 'http://YOUR_WA_BLAST_URL/api/v1/sessions' \
  -H 'X-Master-Key: YOUR_MASTER_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"sessionId": "my-app-session"}'
```

Response:
```json
{
  "status": "success",
  "message": "Session my-app-session created.",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

> ⚠️ **SIMPAN TOKEN INI!** Token digunakan untuk autentikasi semua request.

### 2. Scan QR Code

Buka WA Blast admin dashboard dan scan QR code dengan WhatsApp yang akan digunakan.

### 3. Konfigurasi Environment

Tambahkan ke file `.env`:

```env
# WA Blast Configuration
WA_BLAST_API_URL=http://YOUR_WA_BLAST_URL/api/v1
WA_BLAST_SESSION_ID=my-app-session
WA_BLAST_TOKEN=eyJhbGciOiJIUzI1NiIs...
```

---

## Backend Integration

### 1. Install Dependencies

Tidak ada dependency tambahan, menggunakan native `fetch`.

### 2. Buat Service File

Buat file `src/services/wa-blast.service.ts`:

```typescript
/**
 * WA Blast Service
 * Handles WhatsApp messaging via WA Blast API v1
 */

const WA_BLAST_API_URL = process.env.WA_BLAST_API_URL || '';
const WA_BLAST_SESSION_ID = process.env.WA_BLAST_SESSION_ID || '';
const WA_BLAST_TOKEN = process.env.WA_BLAST_TOKEN || '';

export interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class WABlastService {
  /**
   * Check if WA Blast is configured
   */
  isConfigured(): boolean {
    return !!(WA_BLAST_SESSION_ID && WA_BLAST_TOKEN);
  }

  /**
   * Format phone number to international format (628xxx)
   */
  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    
    // Convert 08xxx to 628xxx
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    
    // Add 62 if not present
    if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Send text message
   */
  async sendMessage(to: string, body: string): Promise<SendMessageResult> {
    if (!this.isConfigured()) {
      console.warn('[WABlast] Not configured, skipping message');
      return { success: false, error: 'WA Blast not configured' };
    }

    try {
      const formattedPhone = this.formatPhoneNumber(to);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(
        `${WA_BLAST_API_URL}/messages?sessionId=${WA_BLAST_SESSION_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${WA_BLAST_TOKEN}`,
          },
          body: JSON.stringify({
            to: formattedPhone,
            type: 'text',
            text: { body },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      const result = await response.json() as any;
      const data = Array.isArray(result) ? result[0] : result;

      if (data?.status === 'success') {
        console.log(`[WABlast] Message sent to ${formattedPhone}`);
        return { success: true, messageId: data.messageId };
      } else {
        console.error(`[WABlast] Failed:`, data?.message || result);
        return { success: false, error: data?.message || 'Unknown error' };
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout' };
      }
      console.error(`[WABlast] Error:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send bulk messages with delay
   */
  async sendBulkMessages(
    messages: { to: string; body: string }[],
    delayMs: number = 3000
  ): Promise<SendMessageResult[]> {
    const results: SendMessageResult[] = [];
    
    for (const msg of messages) {
      const result = await this.sendMessage(msg.to, msg.body);
      results.push(result);
      
      // Delay between messages
      if (messages.indexOf(msg) < messages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    return results;
  }

  /**
   * Get session status
   */
  async getSessionStatus(): Promise<{ connected: boolean; status: string; detail?: string }> {
    if (!WA_BLAST_API_URL || !WA_BLAST_SESSION_ID) {
      return { connected: false, status: 'NOT_CONFIGURED' };
    }

    try {
      const response = await fetch(
        `${WA_BLAST_API_URL}/sessions/${WA_BLAST_SESSION_ID}/status`,
        {
          headers: { 'Authorization': `Bearer ${WA_BLAST_TOKEN}` },
        }
      );

      const result = await response.json() as any;
      
      if (result.status === 'error') {
        return { connected: false, status: 'ERROR', detail: result.message };
      }

      const data = result.data || result;
      const sessionStatus = data.status || 'UNKNOWN';
      const isConnected = data.isConnected === true || sessionStatus === 'CONNECTED';
      
      return {
        connected: isConnected,
        status: sessionStatus,
        detail: isConnected ? 'Session connected' : 'Scan QR code to connect',
      };
    } catch (error: any) {
      return { connected: false, status: 'ERROR', detail: error.message };
    }
  }
}

// Export singleton instance
export const waBlastService = new WABlastService();
```

### 3. Buat Controller

Buat file `src/controllers/wa-blast.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { waBlastService } from '../services/wa-blast.service';

export class WABlastController {
  /**
   * GET /api/wa-blast/status
   */
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const isConfigured = waBlastService.isConfigured();
      const sessionStatus = isConfigured 
        ? await waBlastService.getSessionStatus()
        : { connected: false, status: 'NOT_CONFIGURED' };
      
      res.json({
        success: true,
        data: {
          configured: isConfigured,
          session: sessionStatus,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { message: error.message },
      });
    }
  }

  /**
   * POST /api/wa-blast/send
   */
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { phone, message } = req.body;

      if (!phone || !message) {
        res.status(400).json({
          success: false,
          error: { message: 'Phone and message are required' },
        });
        return;
      }

      const result = await waBlastService.sendMessage(phone, message);

      if (result.success) {
        res.json({ success: true, data: result });
      } else {
        res.status(400).json({
          success: false,
          error: { message: result.error },
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { message: error.message },
      });
    }
  }

  /**
   * POST /api/wa-blast/bulk
   */
  async sendBulkMessages(req: Request, res: Response): Promise<void> {
    try {
      const { messages, delayMs } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({
          success: false,
          error: { message: 'Messages array is required' },
        });
        return;
      }

      const results = await waBlastService.sendBulkMessages(messages, delayMs);
      const sent = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      res.json({
        success: true,
        data: { total: messages.length, sent, failed, results },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { message: error.message },
      });
    }
  }
}
```

### 4. Buat Routes

Buat file `src/routes/wa-blast.routes.ts`:

```typescript
import { Router } from 'express';
import { WABlastController } from '../controllers/wa-blast.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new WABlastController();

// Protect all routes
router.use(authMiddleware);

router.get('/status', controller.getStatus.bind(controller));
router.post('/send', controller.sendMessage.bind(controller));
router.post('/bulk', controller.sendBulkMessages.bind(controller));

export default router;
```

### 5. Register Routes

Di `src/index.ts` atau `src/app.ts`:

```typescript
import waBlastRoutes from './routes/wa-blast.routes';

app.use('/api/wa-blast', waBlastRoutes);
```

---

## Frontend Integration

### 1. Buat API Client

Buat file `lib/wa-blast.ts`:

```typescript
import api from './api'; // Your axios instance

export interface WABlastStatus {
  configured: boolean;
  session: {
    connected: boolean;
    status: string;
    detail?: string;
  };
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Get status
export async function getWABlastStatus(): Promise<WABlastStatus> {
  const response = await api.get('/wa-blast/status');
  return response.data.data;
}

// Send single message
export async function sendMessage(phone: string, message: string): Promise<SendResult> {
  const response = await api.post('/wa-blast/send', { phone, message });
  return response.data.data;
}

// Send bulk messages
export async function sendBulkMessages(
  messages: { to: string; body: string }[],
  delayMs?: number
): Promise<{ sent: number; failed: number; results: SendResult[] }> {
  const response = await api.post('/wa-blast/bulk', { messages, delayMs });
  return response.data.data;
}
```

### 2. Buat UI Component

Contoh React component untuk WA Blast:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { getWABlastStatus, sendMessage, WABlastStatus } from '@/lib/wa-blast';

export default function WABlastPage() {
  const [status, setStatus] = useState<WABlastStatus | null>(null);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await getWABlastStatus();
      setStatus(data);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const handleSend = async () => {
    if (!phone || !message) return;

    setSending(true);
    setResult(null);

    try {
      await sendMessage(phone, message);
      setResult('✅ Pesan berhasil dikirim!');
      setPhone('');
      setMessage('');
    } catch (error: any) {
      setResult(`❌ Gagal: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">WA Blast</h1>

      {/* Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        status?.session?.connected 
          ? 'bg-green-100 border-green-300' 
          : 'bg-red-100 border-red-300'
      } border`}>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${
            status?.session?.connected ? 'bg-green-500' : 'bg-red-500'
          }`}></span>
          <span className="font-medium">
            {status?.session?.connected ? 'Terhubung' : 'Terputus'}
          </span>
        </div>
        <p className="text-sm mt-1">{status?.session?.detail}</p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nomor WhatsApp</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08123456789"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pesan</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={sending || !status?.session?.connected}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {sending ? 'Mengirim...' : 'Kirim'}
        </button>
        {result && <p className="text-sm">{result}</p>}
      </div>
    </div>
  );
}
```

---

## API Reference

### WA Blast Server API (v1)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/sessions` | Buat session baru |
| GET | `/api/v1/sessions/:id/status` | Cek status session |
| POST | `/api/v1/messages?sessionId=xxx` | Kirim pesan |

### Request Format - Send Message

```json
{
  "to": "628123456789",
  "type": "text",
  "text": {
    "body": "Halo, ini pesan dari WA Blast!"
  }
}
```

### Request Format - Send Image

```json
{
  "to": "628123456789",
  "type": "image",
  "image": {
    "id": "media-id-from-upload",
    "caption": "Caption gambar"
  }
}
```

### Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wa-blast/status` | Cek status koneksi |
| POST | `/api/wa-blast/send` | Kirim pesan ke nomor |
| POST | `/api/wa-blast/bulk` | Kirim bulk message |

---

## Template Notifikasi

### 1. Notifikasi Transaksi

```typescript
async function notifyTransaction(data: {
  phone: string;
  name: string;
  invoiceNumber: string;
  amount: number;
  items: string;
}) {
  const message = `Halo ${data.name}! 🎉

Transaksi Anda berhasil!

📋 *Detail:*
• Invoice: ${data.invoiceNumber}
• Item: ${data.items}
• Total: Rp ${data.amount.toLocaleString('id-ID')}

Terima kasih! 🙏`;

  return waBlastService.sendMessage(data.phone, message);
}
```

### 2. Reminder Expiry

```typescript
async function notifyExpiry(data: {
  phone: string;
  name: string;
  expiryDate: string;
  daysRemaining: number;
}) {
  const urgency = data.daysRemaining <= 1 
    ? '⚠️ *BESOK BERAKHIR!*' 
    : '📢 *REMINDER*';

  const message = `Halo ${data.name}!

${urgency}

Layanan Anda akan berakhir dalam *${data.daysRemaining} hari*.

📅 Berakhir: ${data.expiryDate}

Perpanjang sekarang! 🙏`;

  return waBlastService.sendMessage(data.phone, message);
}
```

### 3. Birthday Greeting

```typescript
async function notifyBirthday(data: {
  phone: string;
  name: string;
}) {
  const message = `🎂 *SELAMAT ULANG TAHUN!* 🎉

Halo ${data.name}!

Semoga panjang umur dan sehat selalu!

Salam hangat 💚`;

  return waBlastService.sendMessage(data.phone, message);
}
```

---

## Best Practices

### 1. Rate Limiting

```typescript
// Minimum 3 detik antar pesan untuk menghindari ban
const DELAY_MS = 3000;

// Maksimal 500 penerima per batch
const MAX_BATCH_SIZE = 500;
```

### 2. Format Nomor

```typescript
// ✅ Format yang benar
"628123456789"  // Tanpa +
"08123456789"   // Akan dikonversi otomatis

// ❌ Format yang salah
"+628123456789" // Jangan pakai +
"8123456789"    // Kurang prefix
```

### 3. Timing

- Hindari kirim pesan jam 22:00 - 07:00
- Gunakan scheduler untuk reminder otomatis
- Batch processing untuk bulk message

### 4. Error Handling

```typescript
const result = await waBlastService.sendMessage(phone, message);

if (!result.success) {
  // Log error untuk debugging
  console.error(`Failed to send to ${phone}: ${result.error}`);
  
  // Simpan ke queue untuk retry
  await saveToRetryQueue(phone, message, result.error);
}
```

---

## Troubleshooting

### Session Disconnected

1. Buka WA Blast admin dashboard
2. Scan ulang QR code
3. Refresh status di aplikasi

### Message Failed

| Error | Solusi |
|-------|--------|
| `Session not found` | Buat session baru |
| `Not connected` | Scan QR code |
| `Invalid phone` | Cek format nomor (628xxx) |
| `Rate limited` | Tambah delay antar pesan |
| `Timeout` | Cek koneksi ke WA Blast server |

### Token Invalid

1. Buat session baru dengan Master API Key
2. Update token di `.env`
3. Restart backend

---

## Quick Test Script

Buat file `test-wa-blast.js` untuk testing:

```javascript
const WA_BLAST_API_URL = 'http://YOUR_WA_BLAST_URL/api/v1';
const SESSION_ID = 'your-session-id';
const TOKEN = 'your-token';

const recipient = {
  phone: '628123456789',
  name: 'Test User'
};

const message = `Halo ${recipient.name}! 👋

Ini adalah pesan test dari WA Blast.
Jika Anda menerima pesan ini, konfigurasi berhasil! ✅`;

async function sendMessage() {
  try {
    const response = await fetch(
      `${WA_BLAST_API_URL}/messages?sessionId=${SESSION_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
          to: recipient.phone,
          type: 'text',
          text: { body: message }
        })
      }
    );

    const result = await response.json();
    console.log(response.ok ? '✅ BERHASIL!' : '❌ GAGAL');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

sendMessage();
```

Jalankan: `node test-wa-blast.js`

---

## Checklist Integrasi

- [ ] Setup WA Blast server
- [ ] Buat session dan simpan token
- [ ] Scan QR code
- [ ] Konfigurasi environment variables
- [ ] Buat service file
- [ ] Buat controller dan routes
- [ ] Register routes di app
- [ ] Buat frontend API client
- [ ] Buat UI component
- [ ] Test kirim pesan
- [ ] Implementasi notifikasi sesuai kebutuhan

---

*Dokumentasi ini dibuat untuk memudahkan integrasi WA Blast ke project lain.*

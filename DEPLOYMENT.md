# 🚀 Frontend Deployment Guide - CapRover

Yangın Güvenlik E-Ticaret Frontend uygulamasını CapRover'a deploy etme rehberi.

---

## 📋 Ön Gereksinimler

- ✅ CapRover sunucusu kurulu ve çalışıyor
- ✅ Backend API deploy edildi ve çalışıyor
- ✅ Domain adı CapRover'a bağlı
- ✅ GitHub reposu oluşturuldu

---

## 🔧 1. Frontend App Oluşturma

### CapRover Dashboard'dan:

1. **Apps** → **Create New App**
2. App Name: `frontend-yangin-guvenlik` (veya `yangin-guvenlik`)
3. **Create New App** butonuna tıklayın

---

## 📝 2. Environment Variables Ayarlama

**App Settings** → **Environment Variables** sekmesine gidin.

### Gerekli değişken:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=https://backend-yangin-guvenlik.yourdomain.com
```

**Not:** `NEXT_PUBLIC_` prefix'i önemlidir! Next.js build sırasında bu değişkeni bundle'a dahil eder.

**Bulk Edit** ile yapıştırabilirsiniz.

---

## 🌐 3. Domain (HTTPS) Ayarlama

1. **HTTP Settings** sekmesine gidin
2. **Enable HTTPS** aktif edin
3. **Force HTTPS** aktif edin
4. **Connect New Domain** butonuna tıklayın
5. Domain seçenekleri:
   - **Subdomain:** `yangin-guvenlik` (→ yangin-guvenlik.yourdomain.com)
   - **veya Root Domain:** `yanginguvenlik.com` (DNS ayarları gerekir)
6. **Connect** butonuna tıklayın

CapRover otomatik olarak Let's Encrypt SSL sertifikası oluşturacak.

---

## 🚀 4. GitHub'dan Deploy

### Method 1: GitHub Integration (Önerilen)

1. **Deployment** sekmesine gidin
2. **Method 3: Deploy from Github/Bitbucket/Gitlab** seçin
3. Repository URL: `https://github.com/yourusername/yangin-guvenlik-frontend`
4. Branch: `main` veya `master`
5. **Save & Update** butonuna tıklayın

İlk build 3-5 dakika sürebilir (Next.js build).

### Method 2: CLI ile Deploy

```bash
# CapRover CLI yükle (henüz yüklemediyseniz)
npm install -g caprover

# Login
caprover login

# Deploy
cd frontend
caprover deploy
```

---

## ⚙️ 5. Build Ayarları (Opsiyonel)

Eğer build sırasında hata alırsanız, `captain-definition` dosyasını güncelleyin:

### Daha Fazla Memory:

```json
{
  "schemaVersion": 2,
  "dockerfileLines": [
    "FROM node:18-alpine AS builder",
    "WORKDIR /app",
    "ENV NODE_OPTIONS=--max_old_space_size=4096",
    "COPY package*.json ./",
    "RUN npm ci",
    "COPY . .",
    "RUN npm run build",
    "",
    "FROM node:18-alpine",
    "WORKDIR /app",
    "COPY --from=builder /app/package*.json ./",
    "COPY --from=builder /app/.next ./.next",
    "COPY --from=builder /app/public ./public",
    "COPY --from=builder /app/next.config.mjs ./",
    "RUN npm ci --only=production",
    "EXPOSE 3000",
    "CMD [\"npm\", \"start\"]"
  ]
}
```

---

## ✅ 6. Test

### Ana Sayfa:
```
https://yangin-guvenlik.yourdomain.com
```

### Test Senaryoları:

1. **Ana sayfa yükleniyor mu?** ✅
2. **Ürünler listeleniyor mu?** ✅
3. **Kayıt/Giriş çalışıyor mu?** ✅
4. **Admin paneline erişilebiliyor mu?** ✅
   - URL: `/admin/login`
   - Email: `admin@yanginguvenlik.com`
   - Şifre: `admin123`

---

## 🔄 7. Otomatik Deployment (Webhook)

GitHub'dan otomatik deploy için:

1. **Deployment** sekmesinde **Webhook URL**'yi kopyalayın
2. GitHub repo → **Settings** → **Webhooks** → **Add webhook**
3. Payload URL: [kopyalanan webhook URL]
4. Content type: `application/json`
5. Trigger: `Just the push event`
6. **Add webhook** butonuna tıklayın

Artık her `git push` yaptığınızda otomatik deploy olacak! 🎉

---

## 🎨 8. Özel Ayarlar (Opsiyonel)

### Google Analytics Ekleme:

`frontend/.env` veya CapRover Environment Variables:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

`app/layout.tsx` içinde:

```typescript
{process.env.NEXT_PUBLIC_GA_ID && (
  <Script
    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
    strategy="afterInteractive"
  />
)}
```

### Vercel Analytics (Opsiyonel):

Zaten `@vercel/analytics` yüklü, `layout.tsx`'de aktif hale getirin:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🐛 Sorun Giderme

### Build Hatası: Memory Limit
```
JavaScript heap out of memory
```
**Çözüm:**
- `captain-definition` içinde `NODE_OPTIONS=--max_old_space_size=4096` ekleyin
- veya CapRover'da **App Settings** → **Service Override** → Memory limit artırın

### API Bağlantı Hatası
```
Error: Failed to fetch
```
**Çözüm:**
- `NEXT_PUBLIC_API_URL` environment variable'ını kontrol edin
- Backend'in `/health` endpoint'inin erişilebilir olduğunu doğrulayın
- CORS ayarlarını backend'de kontrol edin

### 404 Hatası
```
Page not found
```
**Çözüm:**
- Build log'larını kontrol edin
- `npm run build` local'de test edin
- `.next` klasörü build sırasında oluşuyor mu kontrol edin

### Static Files Yüklenmiyor
```
Failed to load resource: 404
```
**Çözüm:**
- `public/` klasörünün kopyalandığından emin olun
- `captain-definition` dosyasında `COPY --from=builder /app/public ./public` satırını kontrol edin

---

## 📊 Performance Optimizasyonu

### Image Optimization:

Next.js otomatik image optimization kullanır. `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['yourdomain.com'],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
```

### Build Cache:

CapRover her build'de cache'i sıfırlar. Hızlandırmak için:

1. Daha az dependency kullanın
2. `npm ci` yerine `npm install --prefer-offline` (dikkatli kullanın)

---

## 🔐 9. Güvenlik Ayarları

### Content Security Policy (CSP):

`next.config.mjs`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

---

## 📚 Faydalı Komutlar

```bash
# Logs izleme
caprover logs -a yangin-guvenlik

# App'i yeniden başlatma
caprover restart -a yangin-guvenlik

# Build loglarını görüntüleme
# CapRover dashboard'dan "App Logs" sekmesine gidin
```

---

## 🎯 Checklist

- [ ] Backend API çalışıyor ve erişilebilir
- [ ] Frontend app oluşturuldu
- [ ] Environment variables ayarlandı (`NEXT_PUBLIC_API_URL`)
- [ ] Domain ve HTTPS yapılandırıldı
- [ ] GitHub'a push edildi
- [ ] CapRover'a deploy edildi
- [ ] Ana sayfa açılıyor
- [ ] Ürünler listeleniyor (Backend'den veri çekiliyor)
- [ ] Kayıt/Giriş çalışıyor
- [ ] Admin paneli erişilebilir
- [ ] Webhook ayarlandı (otomatik deploy için)

---

## 🔗 İlgili Linkler

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [CapRover Documentation](https://caprover.com/docs/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## 📞 Destek

Herhangi bir sorunla karşılaşırsanız:
1. CapRover build logs'ları kontrol edin
2. Browser console'da hata var mı bakın
3. Backend API'nin `/health` endpoint'ini test edin
4. CORS ayarlarını kontrol edin

---

**🎉 Başarıyla deploy edildikten sonra e-ticaret siteniz canlı!**

Backend: `https://backend-yangin-guvenlik.yourdomain.com`
Frontend: `https://yangin-guvenlik.yourdomain.com`





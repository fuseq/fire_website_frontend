# Admin Panel Kullanım Kılavuzu

## Giriş

Admin paneline erişmek için `/admin/login` sayfasına gidin.

**Demo Şifresi:** `admin123`

## Ana Özellikler

### 1. Dashboard (İstatistikler)

Admin paneline giriş yaptıktan sonra dashboard'a yönlendirilirsiniz. Burada şunları görebilirsiniz:

- **Toplam Ürün Sayısı**: Sistemde kayıtlı tüm ürünlerin sayısı
- **Toplam Sipariş Sayısı**: Yapılmış tüm siparişlerin sayısı
- **Toplam Gelir**: Tüm siparişlerden elde edilen toplam gelir (₺)
- **Ortalama Sipariş Değeri**: Siparişlerin ortalama tutarı (₺)
- **Son Siparişler**: En son 3 yapılan siparişin detayları

### 2. Ürün Yönetimi (CRUD)

#### Yeni Ürün Ekleme
1. "Ürün Yönetimi" sayfasına gidin
2. "Yeni Ürün" butonuna tıklayın
3. Açılan formu doldurun:
   - **Ürün Adı**: Ürünün tam adı
   - **Kategori**: Ürünün kategorisi
   - **Fiyat**: Ürün fiyatı (₺)
   - **Görsel URL**: Ürün resminin yolu (opsiyonel)
   - **Açıklama**: Ürün açıklaması
   - **Özellikler**: Virgülle ayrılmış özellikler (ör: "1kg kapasite, ABC tipi, Kolay kullanım")
   - **Stok Durumu**: Ürün stokta mevcut mu?
4. "Ekle" butonuna tıklayın

#### Ürün Düzenleme
1. "Ürün Yönetimi" sayfasındaki ürün tablosunda "Düzenle" butonuna tıklayın
2. Açılan formda gerekli değişiklikleri yapın
3. "Güncelle" butonuna tıklayın

#### Ürün Silme
1. "Ürün Yönetimi" sayfasındaki ürün tablosunda "Sil" butonuna tıklayın
2. Ürün anında sistemden kaldırılır

### 3. Sipariş İzleme

#### Tüm Siparişleri Görüntüleme
1. "Siparişler" sayfasına gidin
2. Tüm müşteri siparişlerinin detaylı listesini göreceksiniz:
   - Sipariş Numarası
   - Müşteri Adı
   - Müşteri E-Postası
   - Ürün Sayısı
   - Toplam Tutar
   - Sipariş Durumu (Tamamlandı, Beklemede, İptal)
   - Sipariş Tarihi

#### İstatistikler
Siparişler sayfasında ayrıca şunları görebilirsiniz:
- **Tamamlanan Siparişler**: Başarıyla tamamlanan siparişlerin sayısı
- **Beklemede olan Siparişler**: Henüz işlenmeyen siparişlerin sayısı
- **Toplam Sipariş Değeri**: Tüm siparişlerin toplam tutarı

## Sistemin Mimarisi

### Veri Yönetimi
- Tüm veriler `AdminProvider` context içinde saklanır
- Verileri tarayıcıda tutulan mock data olarak kullanır (bağlantı kesilirse veriler kaybolur)
- Üretim ortamında bir veritabanı entegrasyonu gereklidir

### Bileşen Yapısı
- `AdminSidebar`: Admin panelinin sol tarafındaki navigasyon
- `AdminProvider`: Tüm admin state'ini yönetir
- Dashboard, Ürün Yönetimi ve Siparişler: Ayrı sayfalar

### Güvenlik Notu
- Bu demo şifresi kullanıyor (admin123)
- Üretim ortamında güçlü bir kimlik doğrulama sistemi kullanılmalıdır
- Tüm API çağrıları sunucu tarafında doğrulanmalıdır

## Özelleştirme

### Şifreyi Değiştirme
`lib/admin-context.tsx` dosyasında `loginAdmin` fonksiyonunu bulun:

\`\`\`typescript
const loginAdmin = (password: string) => {
  if (password === "admin123") {  // Bu satırı değiştirin
    setIsAdminLoggedIn(true)
    return true
  }
  return false
}
\`\`\`

### Yeni Özellik Ekleme
1. `AdminContext` türüne yeni fonksiyon/state ekleyin
2. `AdminProvider` değerini güncelleyin
3. Gerekli sayfada `useAdmin` hook'u kullanarak erişin

## Sorun Giderme

### Admin paneline erişemiyorum
- Şifreyi kontrol edin (demo şifresi: `admin123`)
- Tarayıcının çerezlerini temizleyin
- Sayfayı yenileyin

### Verilerim kayboldu
- Mock data tarayıcıda saklanır
- Tarayıcının verilerini temizlerseniz tüm admin verileriniz silinir
- Önemli veriler için veritabanı entegrasyonu yapın

### Ürün ekleyemiyorum
- Tüm alan doldurulduğundan emin olun
- Fiyat değerinin sayı olduğundan emin olun
- Formu kontrol ettikten sonra tekrar deneyin

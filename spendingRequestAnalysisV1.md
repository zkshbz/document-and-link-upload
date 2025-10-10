# Satın Alma Talebi Onay Sayfaları - Teknik Analiz Dokümantasyonu

## 1. Genel Bakış

Bu dokümantasyon, BAPSIS (Bilimsel Araştırma Projeleri Sistemi) platformundaki satın alma talebi onay sayfalarının teknik analizini içermektedir.

### 1.1 Sayfa Tanımları

| Sayfa | Dosya Adı | Tip | Açıklama |
|-------|-----------|-----|----------|
| Create Page | SatinAlmaTalepOnay.aspx | Oluşturma | Yeni satın alma harcama onayı oluşturma sayfası |
| Edit Page | SatinAlmaTalepOnay2.aspx | Düzenleme | Mevcut satın alma harcama onayını düzenleme sayfası |

### 1.2 Teknoloji Stack
- **Framework**: ASP.NET Web Forms
- **UI Komponenti**: Telerik Web UI
- **Database**: Oracle Database
- **Reporting**: Crystal Reports
- **Client-Side**: jQuery, jQuery UI, AJAX

---

## 2. Domain ve İş Mantığı

### 2.1 Satın Alma Onay Süreci

Bu sayfalar, bilimsel araştırma projelerinde satın alma işlemleri için harcama onayı alma sürecini yönetir.

**Temel İş Akışı:**
1. Proje yürütücüsü satın alma talebi oluşturur
2. Talep için harcama onayı alınır (bu sayfalar)
3. Onay belgesi yazdırılır
4. Piyasa araştırması, sipariş, fatura aşamaları izlenir

### 2.2 Kullanıcı Rolleri

- **Proje Yürütücüsü**: Satın alma talebinde bulunan akademisyen
- **Satın Alma Personeli**: Onay işlemlerini gerçekleştiren idari personel
- **Piyasa Araştırma Görevlisi**: Fiyat araştırması yapan personel
- **Düzenleyen Memur**: Evrakları düzenleyen idari personel
- **Gerçekleştirme Görevlisi**: Satın alma işlemini gerçekleştiren personel
- **Harcama Yetkilisi**: Son onayı veren yetkili

---

## 3. Sayfa Yapısı ve Bileşenler

### 3.1 Ortak Bileşenler

#### 3.1.1 Proje Bilgileri Bölümü
Her iki sayfada da aşağıdaki proje bilgileri görüntülenir:

- Projenin Yürütücüsü
- Projenin Başlığı
- Projenin Türü
- Projenin Grubu
- Proje ID
- Proje Kodu

**Veri Kaynağı**: `VW_AP_PROJE` view'ı

#### 3.1.2 Harcama Onayı Bilgileri

**Zorunlu Alanlar (*):**
- Onay Tarihi: `RadDatePicker` - Projenin muhtemel bitiş tarihini geçemez
- İhale Usulü: Dropdown listesi
- İhale Şekli: Seçilen ihale usulüne göre dinamik yüklenir
- Piyasa Araştırma Görevlisi

**Opsiyonel Alanlar:**
- MYS Numarası: `txtMysNumber` (Dinamik: 36_trMysNumber / 13_trMysNumber)
- İhale Açıklama
- Yaklaşık Maliyet
- Avans/Ön Ödeme Bilgileri
- İlanın Şekli ve Adedi
- Ön Yeterlilik/İhale Döküman Satışı
- Fiyat Farkı Ödenecekse Dayanağı
- Onay Havuzu Tutarı
- Muayene Kabul Komisyonu (Dinamik: 36_trMuayeneKomisyon / 13_trMuayeneKomisyon)

### 3.2 Create Page (SatinAlmaTalepOnay.aspx) Özellikleri

**Amaç**: Yeni harcama onayı oluşturma

**Önemli Özellikler:**
- Session'dan `SatTalepId` alınır
- Onay sayısı otomatik generate edilir: `MAX(ONAY_SAYISI) + 1`
- Bütçe kalemleri seçimi yapılır
- "Tümünü Seç" özelliği mevcuttur
- Kaydet butonu INSERT işlemi yapar

**Butonlar:**
- Tümünü Seç: Tüm bütçe kalemlerini seçer
- Kaydet: Yeni onay kaydı oluşturur
- Onay Belgesi Yazdır: Kayıt sonrası aktif olur
- Yeni Onay: Kayıt sonrası aktif olur, yeni onay için formu temizler
- MYS Gonder: Özel kullanıcılar için (BAPUUSERID = 925)
- Kapat: Sayfayı kapatır

**Veri Akışı:**
```
Session[SatTalepId] → AP_SATINALMA_TALEP → Bütçe Kalemleri →
Onay Oluşturma → AP_SATINALMA_HARCAMAONAY + AP_SATINALMA_HARCAMAONAYDETAY
```

### 3.3 Edit Page (SatinAlmaTalepOnay2.aspx) Özellikleri

**Amaç**: Mevcut harcama onayını düzenleme

**Önemli Özellikler:**
- Session'dan `SatOnaySayisi` alınır
- Mevcut onay bilgileri yüklenir
- İhale usulü ve şekli mevcut kayda göre set edilir
- Bütçe kalemleri üzerinde işlem yapıldıysa silme engellenir
- Onay Tarihi Değiştir butonu mevcuttur

**Butonlar:**
- Onay Tarihi Değiştir: Sadece onay tarihini günceller
- Kaydet: Mevcut onay kaydını günceller
- Onay Belgesi Yazdır: Crystal Report üretir
- Kapat: Sayfayı kapatır

**Silme Kısıtları:**
Aşağıdaki durumlardan biri varsa bütçe kalemi silinemez:
- Piyasa Araştırması kaydı var (`AP_SATINALMA_PIYASAARAST`)
- Sipariş kaydı var (`AP_SATINALMA_SIPARIS`)
- Fatura kaydı var (`AP_SATINALMA_FATURA`)
- MİF kaydı var (`AP_SATINALMA_MIF`)
- TİF kaydı var (`AP_SATINALMA_TIF`)

**Veri Akışı:**
```
Session[SatOnaySayisi] → AP_SATINALMA_HARCAMAONAY →
Mevcut Veriler Yüklenir → Güncelleme → Veritabanı Update
```

---

## 4. Dinamik Form Elementleri

### 4.1 Dinamik Key Sistemi

Sayfalar kurum bazlı dinamik yapılandırma destekler. JavaScript ile `GenerateUIScript()` fonksiyonu kullanılarak DB'den alınan ayarlara göre form elemanları gösterilir/gizlenir.

**Key Formatı:**
- **Create Page (36_)**: Oluşturma sayfası için prefix
- **Edit Page (13_)**: Düzenleme sayfası için prefix

### 4.2 Dinamik Elementler ve Kullanımları

| Element ID | Create Key | Edit Key | Açıklama | Varsayılan Durum |
|------------|-----------|----------|----------|------------------|
| `trMysNumber` | 36_trMysNumber | 13_trMysNumber | MYS (Mali Yönetim Sistemi) numarası alanı | display: none |
| `trMuayeneKomisyon` | 36_trMuayeneKomisyon | 13_trMuayeneKomisyon | Muayene Kabul Komisyonu bilgisi | display: none, pointer-events: none |
| `trPiyasaArastirma2` | 36_trPiyasaArastirma2 | 13_trPiyasaArastirma2 | İkinci piyasa araştırma görevlisi | display: none, pointer-events: none |
| `trPiyasaArastirma3` | - | 13_trPiyasaArastirma3 | Üçüncü piyasa araştırma görevlisi (düzenleyen memur yerine) | display: none, pointer-events: none |
| `trPiyasaArastirma4` | - | 13_trPiyasaArastirma4 | Gerçekleştirme süresi alanı (Edit sayfasında) | display: none, pointer-events: none |

**Kod Örneği:**
```javascript
ScriptManager.RegisterStartupScript(this, this.GetType(), Guid.NewGuid().ToString("N"),
    GeneralMethods.GenerateUIScript("", "table-row"), true);
```

Bu script DB'den UI ayarlarını çeker ve elementlerin `display` özelliğini değiştirir.

### 4.3 Dinamik Kurulum Mantığı

1. Sayfa yüklendiğinde `UI_Initialize.Initialize()` çağrılır
2. Sayfa adı (`SatinAlmaTalepOnay` veya `SatinAlmaTalepOnay2`) belirlenir
3. DB'den ilgili sayfa için UI ayarları çekilir
4. Key'lere göre elementler gösterilir/gizlenir

**Veritabanı Tablosu**: Muhtemelen `AP_UI_SETTINGS` gibi bir tablo kullanılıyor (kod içinde direkt tablo adı görünmüyor)

---

## 5. İhale Usulleri ve Şekilleri

### 5.1 İhale Usulleri (drpIhaleUsul)

**Vakıf Üniversiteleri için** (`isVakifUni = true`):
- Seçim Yapınız (SY)
- Doğrudan Temin (DT)
- Pazarlık Usulü (PU)
- Belli İstekler Arası İhale (BI)
- Açık İhale (AI)

**Devlet Üniversiteleri için**:
- Seçim Yapınız (SY)
- Doğrudan Temin (DT)
- Doğrudan Temin (avans) (DA) - Sadece Gazi Üniversitesi
- Pazarlık Usulü (PU)
- Belli İstekler Arası İhale (BI)
- 5018 Sayılı (EL)
- Dosap (DO)
- Bursiyer (BU)
- Açık İhale (AI)

**Kurum Bazlı Kontroller:**
```csharp
// Vakıf üniversitesi kontrolü
isAcibadem = InstitutionControl.isInstitutionAcibademUniversitesi();
isLokmanHekim = InstitutionControl.isInstitutionLokmanHekimUniversitesi();
isTicaret = InstitutionControl.isInstitutionIstanbulTicaretUniversitesi(); // Edit sayfasında
```

### 5.2 İhale Şekilleri (drpIhaleSekli)

İhale şekilleri **dinamik olarak** seçilen ihale usulüne göre yüklenir:

**Veri Kaynağı:**
```sql
SELECT MADDE||'/'||ALTMADDE AS KARAR
FROM APSATINALMA_IHALESEKLI
WHERE TUR = '[SeçilenİhaleUsulü]' AND ISACTIVE = 'Y'
ORDER BY ALTMADDE
```

**Özel Durumlar:**
- `DO` (Dosap) veya `BU` (Bursiyer) seçilirse: İhale şekli boş bırakılır (Erciyes Üni)
- `DA` (Doğrudan Temin-avans) seçilirse: Dropdown devre dışı bırakılır (Gazi Üni)
- `PU` (Pazarlık Usulü) seçilirse: İhale şekli boş bırakılır (Gazi Üni)

**Özel Kodlar:**
- `998`: Bursiyer işlemleri için
- `999`: Dosap işlemleri için
- `687`: Doğrudan Temin (avans) için

---

## 6. Avans ve Ön Ödeme Modülleri

### 6.1 Avans Modülü (Eski Sistem)

**Form Elemanları:**
- `txtAvansŞartlar`: Avans tutarı
- `drpArastirmaci`: Avans verilecek kişi seçimi
- `txtAvansKime`: Avans verilecek kişinin adı

**Görünürlük:**
```csharp
trAvansModul.Visible = !InstitutionInfo.OnOdemeModuluAktifMi;
```

### 6.2 Ön Ödeme Modülü (Yeni Sistem)

**Ön Ödeme Türleri** (`APONODEME_TURLERI`):
- Avans (1)
- Kredi (2)
- Akreditif (3)

**Form Elemanları:**
- `drpOnOdeme`: Ön ödeme türü seçimi
- `txtAvansŞartlar_OnOdeme`: Ön ödeme tutarı
- `drpArastirmaci_OnOdeme`: Ön ödeme verilecek kişi
- `txtAvansKime_OnOdeme`: Kişinin adı
- `lblUstLimit`: Üst limit gösterimi
- `lblKapatmaSuresi`: Kapatma süresi gösterimi

**Görünürlük:**
```csharp
trOnOdemeModul1.Visible = InstitutionInfo.OnOdemeModuluAktifMi;
trOnOdemeModul2.Visible = InstitutionInfo.OnOdemeModuluAktifMi;
```

**Limit Hesaplama:**
```csharp
// Normal: DB'den gelen limit
// AÜDAP Projeleri için: Limit x 10
// https://www.resmigazete.gov.tr/eskiler/2022/05/20220531-4.htm
if (projeTurId == ProjeTurleri.Arastirma_Universitleri_Destek_Programi)
    return OnOdemeButceLimit * 10;
```

### 6.3 Validasyonlar

1. **Avans Üst Limit Kontrolü:**
```csharp
if (avanstutar > avansustlimit)
{
    lblMesaj.Text = "Talep edilen avans, {avansustlimit} TL avans limitinden büyük olamaz.";
}
```

2. **Kullanılabilir Bütçe Kontrolü:**
```csharp
if (avanstutar > Kontrol.KalanBakiye(Kontrol.PRJID, butceIdleri))
{
    lblMesaj.Text = "Verilecek Avans tutarı projenin kullanılabilir bütçesinden fazla olamaz.";
}
```

3. **Zorunlu Alan Kontrolü (Ön Ödeme):**
```csharp
if (drpOnOdeme.SelectedIndex != 0 && (txtAvansŞartlar_OnOdeme.Text == "" || txtAvansKime_OnOdeme.Text == ""))
{
    lblMesaj.Text = "Ön Ödeme verilecek ise Tutar ve Ön Ödemenin verileceği kişi girilmelidir.";
}
```

---

## 7. Bütçe Kalemleri Yönetimi

### 7.1 Bütçe Kalemleri Grid'i (grdOnayButceKalemleri)

**Kolonlar:**
- Bütçe Türü (BUTCE_DESTEK_ADI)
- Tanımı/Adı (MALZEME)
- Miktar (MIKTAR)
- Birimi (BIRIMADI)
- Açıklama (ACIKLAMA)
- Ekonomik Kod (EKONOMIKKOD)
- Bütçe Tertibi (TERTIPKOD)
- Seç (Checkbox)
- Sil (ImageButton - sadece edit sayfasında aktif)

**Veri Kaynağı:**
```sql
SELECT R.BUTCE_DESTEK_ADI, T.MALZEME, T.MIKTAR, T.BIRIMADI,
       T.TALEP_SIRANO, T.SIRANO, T.EKONOMIKKOD, T.TERTIPKOD,
       T.ACIKLAMA, NVL(T.ONAYALINDI,0) ONAYALINDI, T.DESTEKTURID
FROM AP_SATINALMATALEP_DETAY T, APBUTCE_DESTEK_TUR R
WHERE T.DESTEKTURID = R.BUTCE_DESTEK_TUR_ID
  AND T.TALEP_SIRANO = :JTalepSirano
  AND T.PROJE_ID = :PRJID
ORDER BY T.SIRANO, T.DESTEKTURID
```

### 7.2 Onay Havuzu Mekanizması

**Amaç**: Onay alındığında bütçeden düşürülecek tutarı hesaplar.

**Hesaplama:**
```sql
SELECT NVL(ROUND(SUM(KDVLITUTAR),2),0) AS TUTAR
FROM AP_SATINALMA_ONAYHAVUZU
WHERE PROJE_ID = :PRJID
```

**Checkbox İşlevi** (`chkOnayBakiye`):
- Seçili ise: Onay havuzu tutarı kullanılabilir bütçeden düşer
- Seçili değilse: Onay havuzu 0 olarak kaydedilir

**Dinamik Hesaplama:**
Bütçe kalemi seçildiğinde/seçimi kaldırıldığında `OnayTutarKontrol()` fonksiyonu çağrılır ve havuz tutarı güncellenir.

### 7.3 Renk Kodlaması

**Edit Sayfasında:**
- **Mavi (#DDFFFF)**: Onay alınmış kalemler (`ONAYALINDI = 1`)
- **Beyaz**: Henüz onay alınmamış kalemler

---

## 8. Kurum Bazlı Özelleştirmeler

### 8.1 Kurum Kontrol Fonksiyonları

```csharp
InstitutionControl.isInstitutionGaziUniversitesi()
InstitutionControl.isInstitutionErciyesUniversitesi()
InstitutionControl.isInstitutionAcibademUniversitesi()
InstitutionControl.isInstitutionLokmanHekimUniversitesi()
InstitutionControl.isInstitutionIstanbulTicaretUniversitesi()
InstitutionControl.isInstitutionOndokuzMayisUniversitesi()
InstitutionControl.isInstitutionSuleymanDemirelUniversitesi()
InstitutionControl.isInstitutionAnkaraUniversitesi()
InstitutionControl.isInstitutionAnkaraHaciBayramVeliUniversitesi()
InstitutionControl.isInstitutionBursaUludagUniversitesi()
InstitutionControl.isInstitutionCanakkaleOnsekizMartUniversitesi()
// ... ve diğerleri
```

### 8.2 Kurum Bazlı Farklılıklar

#### 8.2.1 Erciyes Üniversitesi
- Piyasa araştırma görevlisi ve düzenleyen memur **dropdown** olarak gösterilir
- Diğer kurumlarda **textbox** olarak gösterilir
- `ONAYMEMUR` alanı özel olarak güncellenir

#### 8.2.2 Ondokuz Mayıs Üniversitesi
- Düzenleyen memur dropdown'u aktif
- Memur listesi sadece personel tablosundan çekilir (ekip değil)
- Özel onay belgesi: `OnayBelgesiOmu.rpt`

#### 8.2.3 Gazi Üniversitesi
- Doğrudan Temin (avans) seçeneği mevcut
- Pazarlık usulünde ihale şekli boş bırakılır
- DA seçilince ihale şekli devre dışı kalır

#### 8.2.4 Ankara Hacı Bayram Veli Üniversitesi
- Gerçekleştirme görevlisi dropdown'u devre dışı
- Sabit personel atanır: `drpGerceklestirme.SelectedValue = "100919"`

#### 8.2.5 Süleyman Demirel Üniversitesi
- Gerçekleştirme görevlisi sadece proje yürütücüsü olabilir
- Ekip üyeleri seçilemez

#### 8.2.6 Bursa Uludağ Üniversitesi
- Gerçekleştirme süresi alanı (`txtGerceklestirmeSuresi4`) mevcut
- Özel Crystal Report şablonu: `OnayBelgesi3.rpt`

#### 8.2.7 Çanakkale Onsekiz Mart Üniversitesi
- Muayene Komisyonu bilgisi özel olarak yazdırılır

#### 8.2.8 Akdeniz Üniversitesi
- Yatırım proje no ve piyasa araştırma görevlisi birleştirilir
- Özel onay yetkilisi sorgusu
- Özel kullanılabilir bütçe hesaplama

#### 8.2.9 İstanbul Üniversitesi / İstanbul Üniversitesi Cerrahpaşa
- İhale açıklama alanı zorunlu değil
- Özel Crystal Report formatı

#### 8.2.10 Eskişehir Osmangazi Üniversitesi
- Piyasa araştırma görevlisi 2 otomatik: "Şube Müdürü ALİ KANBER"

### 8.3 Rapor Şablonları

| Kurum/Durum | Rapor Dosyası | Açıklama |
|-------------|---------------|----------|
| Standart | OnayBelgesi.rpt | Varsayılan rapor şablonu |
| İhale açıklama yok | OnayBelgesi2.rpt | İstanbul Üni, Cerrahpaşa, ihale usulü 21 |
| Ankara Üniversitesi | OnayBelgesi2.rpt | Özel 5018/35 düzenlemesi |
| Ondokuz Mayıs Üni | OnayBelgesiOmu.rpt | Özel kurum formatı |
| Bursa Uludağ Üni | OnayBelgesi3.rpt | Gerçekleştirme süresi dahil |

---

## 9. Veritabanı İşlemleri

### 9.1 Ana Tablolar

#### AP_SATINALMA_TALEP
- Satın alma taleplerinin ana tablosu
- `TALEP_ID`, `PROJE_ID`, `SIRANO`
- `DURUM`: TDB (Taslak), TSL (Taslak Silindi), ALM (Alındı)
- `TALEPONAY`: Onay alındı mı? (0/1)

#### AP_SATINALMATALEP_DETAY
- Satın alma talebi detay kalemleri
- `TALEP_SIRANO`, `SIRANO`, `PROJE_ID`
- `MALZEME`, `MIKTAR`, `BIRIMADI`, `KDVLITUTAR`
- `EKONOMIK`, `TERTIP`, `EKONOMIKKOD`, `TERTIPKOD`
- `DESTEKTURID`: Bütçe destek türü ID
- `ONAYALINDI`: Bu kalem için onay alındı mı? (0/1)

#### AP_SATINALMA_HARCAMAONAY
- Harcama onayı ana kayıtları
- `ONAY_SAYISI`: Benzersiz onay numarası
- `PROJE_ID`, `TALEP_SIRA`
- `TARIH`: Onay tarihi
- `IHALE_USULU`, `YAKLASIK_MALIYET`
- `PIYASAARSGOR`, `PIYASAARSGOR2`, `PIYASAARSGOR2UNVAN`, `PIYASAARSGOR3`
- `ONAYMEMUR`: Düzenleyen memur
- `ONAYYETKILISI`: Gerçekleştirme görevlisi
- `HARCAMAYET`: Harcama yetkilisi
- `AVANS_SARTLAR`, `AVANS_KIME`, `AVANS_KIME_ID`
- `ONAYHAVUZU`, `OANKI_BAKIYE`
- `MYS_NUMBER`: Mali yönetim sistemi numarası
- `ON_ODEME_TURU`: Ön ödeme türü (1: Avans, 2: Kredi, 3: Akreditif)
- `SON_ISLEM_YAPAN`: Son işlemi yapan kullanıcı ID
- `MUAYENE`: Muayene komisyonu bilgisi
- `GERCEKLESTIRMESURESI`: Gerçekleştirme süresi

#### AP_SATINALMA_HARCAMAONAYDETAY
- Onaya dahil edilen bütçe kalemleri
- `ONAY_SAYISI`, `PROJE_ID`
- `TALEP_SIRA`, `TALEP_DETAYSIRA`

#### AP_SATINALMA_ONAYHAVUZU
- Onay havuzuna alınan tutarlar
- `PROJE_ID`, `TALEP_SIRANO`, `SIRANO`
- `KDVLITUTAR`: KDV dahil tutar

#### APONODEME_TURLERI
- Ön ödeme türleri tanımları
- `ON_ODEME_TURU`: Tür ID (1, 2, 3)
- `ON_ODEME_ADI`: Tür adı (Avans, Kredi, Akreditif)
- `BUTCE_LIMIT`: Bütçe limiti
- `SURE_LIMIT`: Süre limiti (gün)

#### APSATINALMA_IHALESEKLI
- İhale şekilleri tanımları
- `TUR`: İhale usulü kodu (DT, PU, BI, AI, vb.)
- `MADDE`, `ALTMADDE`: Yasal madde/altmadde bilgisi
- `ISACTIVE`: Aktif mi? (Y/N)

### 9.2 View'lar

#### VW_AP_PROJE
Proje genel bilgileri:
- `PROJE_ID`, `PROJE_KODU`, `PROJE_ADI`
- `ADISOYADI`: Yürütücü adı
- `PROJE_YON_ID`: Yürütücü kullanıcı ID
- `KISA_ADI`: Proje türü kısa adı
- `PROJE_GRUP_ADI`: Proje grubu
- `SATINALMA_TAKIP_ID`: Satın alma takipçisi ID
- `SATINALMA_TAKIPCISI`: Satın alma takipçisi adı
- `KULLANILABILIRBUTCE`: Kullanılabilir bütçe
- `ACILIS_FISI`: Açılış fişi var mı? (0/1)

#### AP_SATINALMAONAYBELGE
Crystal Report için kullanılan view:
- Onay belgesi için tüm gerekli alanları birleştirir
- `PROJE_YONETICISI`, `PROJE_ADI`, `BUTCE_TERTIBI`
- `PIYASAARSGOR`, `ONAYMEMUR`, `HARCAMAYET`
- `IHALE_USULU`, `YAKLASIK_MALIYET`, `AVANS_SARTLAR`

### 9.3 Stored Procedures

#### DBClass.AP_SatinAlmaHarcamaOnay()
Harcama onayı INSERT/UPDATE işlemi

**Parametreler:**
- `PROJE_ID`, `ONAY_SAYISI`, `TALEP_SIRA`
- `TARIH`, `MALI_YIL`
- `IHALE_USULU`, `YAKLASIK_MALIYET`
- `AVANS_SARTLAR`, `AVANS_KIME`, `AVANS_KIME_ID`
- `PIYASAARSGOR`, `ONAYMEMUR`, `HARCAMAYET`, `ONAYYETKILISI`
- `IHALE_ACIKLAMA`, `MUAYENE`
- `ON_ODEME_TURU`
- `ISLEM`: "IS" (Insert) veya "UP" (Update)

#### DBClass.AP_SatinAlmaHarcamaOnayDetay()
Onay detay kaydı INSERT/UPDATE

**Parametreler:**
- `PROJE_ID`, `ONAY_SAYISI`
- `TALEP_SIRA`, `TALEP_DETAYSIRA`
- `ISLEM`: "IS" (Insert) veya "UPD" (Update)

#### DBClass.AP_HARCAMAONAYDETAY_KALEM_SIL()
Onay detayından bütçe kalemi silme

**Parametreler:**
- `PROJE_ID`, `ONAY_SAYISI`
- `TALEP_SIRA`, `TALEP_DETAYSIRA`

### 9.4 Fonksiyonlar

#### AP_SATINALMA_TALEP_DAGILIM()
Bütçe kaleminin kullanım durumunu kontrol eder

**Parametreler:**
- `PROJE_ID`, `TALEP_ID`, `TALEP_DETAY_ID`
- `TIP`: 2 (PAT), 3 (Sipariş), 4 (Fatura)

**Dönüş:** 0 (yok) veya 1 (var)

#### BAPUSER_BILGILER() / BAPUSER_BILGILER2()
Kullanıcı bilgilerini string olarak döner

#### AP_PERSONEL_BILGI3()
Personel bilgilerini özel formatta döner

#### AP_SATINALMA_HESAPKOD()
Hesap kodunu formatlar

#### AP_SATINALMA_TERTIPDONDER()
Bütçe tertip bilgisini döner

---

## 10. Validasyonlar ve İş Kuralları

### 10.1 Temel Validasyonlar

#### 10.1.1 Zorunlu Alan Kontrolleri
```csharp
if (drpIhaleUsul.SelectedIndex == 0 ||
    rdpMinDate.DateInput.Text == "" ||
    txtPiyasaArs.Text == "" ||
    drpIhaleSekli.SelectedIndex == 0)
{
    lblMesaj.Text = "(*) İşareti bulunan alanların doldurulması zorunludur.";
}
```

#### 10.1.2 Bütçe Kalemi Seçimi
```csharp
if (!chkKontrol)
{
    lblMesaj.Text = "En az bir harcama kaleminin seçilmesi zorunludur.";
}
```

#### 10.1.3 Yaklaşık Maliyet Kontrolü
```csharp
if (txtYaklasikMaliyet.Text != "" &&
    Convert.ToDouble(txtYaklasikMaliyet.Text) > Convert.ToDouble(JKulButce.Value))
{
    lblMesaj.Text = "Yaklaşık maliyet Kullanılabilir Bütçe tutarından yüksek olamaz.";
}
```

### 10.2 Özel İş Kuralları

#### 10.2.1 Açılış Fişi Kontrolü
```csharp
if (JAcilisFisi.Value == "0")
{
    lblMesaj.Text = "Proje harcama kalemleri için 'Bütçe Fişi' düzenlenmeden harcama işlemleri gerçekleştirilemez.";
}
```

#### 10.2.2 Talep Onay Durumu
```csharp
if (JTalepOnaylandi.Value == "0")
{
    lblMesaj.Text = "Harcama talebi onaylanmadan harcama işlemleri gerçekleştirilemez.";
}
```

#### 10.2.3 Sorumlu Personel Kontrolü
```csharp
if (JDuzenleme.Value == "")
{
    lblMesaj.Text = "Proje üzerinde işlem yapabilmesi için sorumlu personel ataması gerçekleştirilmelidir.";
}
```

#### 10.2.4 Ekonomik Kod Kontrolü
```sql
SELECT * FROM AP_SATINALMATALEP_DETAY
WHERE (EKONOMIK IS NULL OR TERTIP IS NULL)
  AND TUR='G'
  AND TALEP_SIRANO=:TALEP_SIRANO
  AND PROJE_ID=:PRJID
```
```csharp
if (dtTertip.Rows.Count > 0)
{
    lblMesaj.Text = "Ekonomik veya Tertip Kodu Eksik Olan Harcama Kalem(ler)i Bulunmaktadır. Bu Sebeple Bütçe Fişi Düzenlemeden Harcama Onayı Alınamaz.";
}
```

#### 10.2.5 Tez Projesi Tarih Kontrolü
```csharp
if (tezbitisTarihi.Date < DateTime.Now.Date && projeTuru < 6)
{
    lblTezUyari.Text = "Lisans üstü tez projeleri için yapılacak harcamalar tezin normal süresi içerisinde gerçekleştirilebilmektedir. Tez Normal Bitiş Tarihi {tezbitisTarihi}";
}
```

#### 10.2.6 Onay Tarihi Kontrolü
```csharp
// Projenin muhtemel bitiş tarihi veya sözleşme süresi kontrol edilir
if (dt.Rows[0]["PROJE_DURUM"].ToString() == "SOZ")
{
    rdpMinDate.MaxDate = DateTime.Now.AddMonths(Int32.Parse(dt.Rows[0]["SURESI"].ToString()));
}
else
{
    rdpMinDate.MaxDate = muhbit; // Muhtemel bitiş tarihi
}
```

### 10.3 Yetki Kontrolleri

#### 10.3.1 Satın Alma Personeli Kısıtlaması
```csharp
if (Kurum.SadeceSatinalmaPersoneliDegisiklikYapabilir &&
    Kontrol.SorumluPersonelMi(Kontrol.PRJID, Kontrol.BAPUUSERID))
{
    btnKaydet.Enabled = false;
    btnKaydet.CssClass = "button-disabled";
}
```

#### 10.3.2 MYS Gönder Butonu
```csharp
if (Kontrol.BAPUUSERID == "925")
{
    btnMysGonder.Visible = true;
}
```

---

## 11. Client-Side İşlemler

### 11.1 JavaScript Fonksiyonları

#### 11.1.1 Onay İletişim Kutuları
```javascript
function confirmSubmit() {
    var agree = confirm("Kaydı İptal etmek istediğinizden emin misiniz?");
    return agree;
}

function confirmDelete() {
    var agree = confirm("Kaydı silmek istediğinize emin misiniz? Talep bölümünden de silinecektir.");
    return agree;
}

function confirmSubmitSec() {
    var agree = confirm("Bütçe kalemini talep etmek istediğinizden emin misiniz?");
    return agree;
}
```

#### 11.1.2 AutoComplete Fonksiyonları

**Piyasa Araştırma Görevlisi 2:**
```javascript
$("#txtPiyasaArs2").autocomplete({
    source: function (request, response) {
        $.getJSON("<%#Kurum.ApsisWebAdres%>/services/dataService.svc/SearchUsersAcademicAndOther?searchParam=" + encodeURI(request.term))
        .success(function (result) {
            response($.map(result.d, function (item) {
                return {
                    label: item.Unvan + " " + item.Ad + " " + item.Soyad,
                    unvan: item.Unvan,
                    bapgrupid: item.BapGrupID,
                    value: item.Unvan + " " + item.Ad + " " + item.Soyad
                }
            }));
        });
    },
    minLength: 3,
    delay: 100,
    select: function (event, ui) {
        $("#hfTxtPysArs2Unvan").val(ui.item.unvan);
        $("#hfTxtPysArs2BapGrupId").val(ui.item.bapgrupid);
    }
});
```

**Piyasa Araştırma Görevlisi 3 (Düzenleyen Memur Yerine):**
```javascript
$("#txtPiyasaArsDuzMemur3").autocomplete({
    source: "<%#Kurum.ApsisWebAdres%>/services/dataService.svc/SearchUsersAcademicAndOther",
    minLength: 3,
    delay: 100
});
```

**PageLoad Handler:**
```javascript
$().ready(function () {
    Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(pageLoadedHandler);
    setupAutoComplete();
});

function pageLoadedHandler() {
    setupAutoComplete();
}
```

#### 11.1.3 Sayı Kontrol
```javascript
// SayiKontrol.js dosyasından
// Ondalıklı sayı girişi için
txtYaklasikMaliyet.Attributes.Add("onKeyPress", "javascript:SayiKontrol2(event)");
txtAvansŞartlar.Attributes.Add("onKeyPress", "javascript:SayiKontrol2(event)");
```

### 11.2 AJAX UpdatePanel Kullanımı

Sayfada `<asp:ScriptManager>` kullanılıyor ve AJAX destekli postback işlemleri yapılıyor:

```xml
<asp:ScriptManager ID="ScriptManager1" runat="server">
</asp:ScriptManager>
```

**AutoPostBack Özelliği Kullanan Elementler:**
- `rdpMinDate`: Tarih seçimi
- `drpIhaleUsul` / `drpIhaleUsulLH`: İhale usulü değişimi
- `drpPiyasaArs`: Piyasa araştırma görevlisi değişimi
- `drpOnayMemur`: Düzenleyen memur değişimi
- `drpGerceklestirme`: Gerçekleştirme görevlisi değişimi
- `drpArastirmaci` / `drpArastirmaci_OnOdeme`: Avans verilecek kişi değişimi
- `drpOnOdeme`: Ön ödeme türü değişimi

---

## 12. Crystal Reports Entegrasyonu

### 12.1 Rapor Üretimi

**btnYazdir_Click() İşlevi:**

1. **Veri Setlerini Hazırlama:**
```csharp
DataSet ds0 = OracleDB.GetDataSet(sql0);  // Ana onay bilgileri
DataSet ds1 = OracleDB.GetDataSet(sql1);  // Detay kalemleri
DataSet ds2 = OracleDB.GetDataSet(sql2);  // Ekonomik kodlar
DataSet ds11 = OracleDB.GetDataSet(sql11); // Bütçe tertibi
```

2. **Rapor Seçimi:**
```csharp
ReportDocument rpt = new ReportDocument();
string ihaleUsulu = ds0.Tables[0].Rows[0]["IHALE_USULU"].ToString();
string aciklama = ds0.Tables[0].Rows[0]["IHALE_ACIKLAMA"].ToString();

if (InstitutionControl.isInstitutionOndokuzMayisUniversitesi())
{
    rpt.Load(Server.MapPath("OnayBelgesiOmu.rpt"));
}
else if (InstitutionControl.isInstitutionBursaUludagUniversitesi())
{
    rpt.Load(Server.MapPath("OnayBelgesi3.rpt"));
}
else if (string.IsNullOrEmpty(aciklama))
{
    rpt.Load(Server.MapPath("OnayBelgesi2.rpt"));
}
else
{
    rpt.Load(Server.MapPath("OnayBelgesi.rpt"));
}
```

3. **Dinamik Text Değiştirme:**
```csharp
// MYS Numarası
TextObject mysTextObject = rpt.ReportDefinition.ReportObjects["Text30"] as TextObject;
if (!string.IsNullOrEmpty(mysNumarasi))
{
    mysTextObject.Text = "-  " + mysNumarasi;
}

// Bursiyer/Dosap metni
if (ihaleUsulu == "99")
{
    TextObject text26 = rpt.ReportDefinition.ReportObjects["Text26"] as TextObject;
    text26.Text = "Kamu İhale Kanuna Tabi Olmayan Harcamalar";
}
```

4. **Veri Kaynağı Bağlama:**
```csharp
rpt.Database.Tables[0].SetDataSource(ds0.Tables[0]);
rpt.Subreports[0].Database.Tables[0].SetDataSource(ds1.Tables[0]);
rpt.Subreports[0].Database.Tables[1].SetDataSource(ds0.Tables[0]);
rpt.Subreports[1].Database.Tables[0].SetDataSource(ds2.Tables[0]);
rpt.Subreports[2].Database.Tables[0].SetDataSource(ds11.Tables[0]);
```

5. **Export İşlemi:**
```csharp
rpt.PrintOptions.PaperSize = PaperSize.A4;
rpt.ExportToHttpResponse(ExportFormatType.PortableDocFormat, Response, true, "onaybelgesi");
```

### 12.2 CRP_UI_Initialize Kullanımı

Kurum bazlı Crystal Report UI ayarları:

```csharp
CRP_UI_Initialize.Initialize("OnayBelgesi");
CrystalReportHidingObjectByName.HideObjectByName(rpt);
```

Bu fonksiyon DB'den rapor obje görünürlük ayarlarını çekerek belirli alanları gizler/gösterir.

### 12.3 Rapor Şablonu Yapısı

**Ana Rapor:**
- Başlık bilgileri (Kurum adı, tarih)
- Proje bilgileri
- Onay bilgileri (İhale usulü, yaklaşık maliyet, vb.)
- İmza alanları (Piyasa araştırma görevlisi, düzenleyen memur, harcama yetkilisi, vb.)

**Subreport 0: Detay Kalemleri**
- Sıra No, Tanım, Miktar, Birim, Bütçe Tertibi

**Subreport 1: Ekonomik Kodlar**
- Ekonomik kod / Hesap ismi listesi

**Subreport 2: Bütçe Tertibi**
- Distinct bütçe tertibi listesi

---

## 13. Session ve Hidden Field Kullanımı

### 13.1 Session Değişkenleri

| Session Key | Veri Tipi | Kullanım | Sayfa |
|-------------|-----------|----------|-------|
| `SatTalepId` | string | Satın alma talep ID | Create |
| `SatOnaySayisi` | string | Onay sayısı (düzenleme için) | Edit |

### 13.2 Hidden Fields

#### 13.2.1 Create Page Hidden Fields
```html
<input type="hidden" id="JTalepOnaylandi" runat="server" />
<input type="hidden" id="JTalepSirano" runat="server" />
<input type="hidden" id="JYaklasikMaliyet" runat="server" />
<input type="hidden" id="JPiyasa" runat="server" />
<input type="hidden" id="JTarih" runat="server" />
<input type="hidden" id="JDuzenleme" runat="server" />
<input type="hidden" id="JGerceklestirme" runat="server" />
<input type="hidden" id="JHarcama" runat="server" />
<input type="hidden" id="JOnaySıra" runat="server" />
<input type="hidden" id="JAcilisFisi" runat="server" />
<input type="hidden" id="JKulButce" runat="server" />
```

#### 13.2.2 Edit Page Hidden Fields
```html
<input type="hidden" id="JTalepSirano" runat="server" />
<input type="hidden" id="JPiyasa" runat="server" />
<input type="hidden" id="JTarih" runat="server" />
<input type="hidden" id="JDuzenleme" runat="server" />
<input type="hidden" id="JGerceklestirme" runat="server" />
<input type="hidden" id="JHarcama" runat="server" />
<input type="hidden" id="JOnaySıra" runat="server" />
<input type="hidden" id="JIslem" runat="server" />
<input type="hidden" id="JKulButce" runat="server" />
```

#### 13.2.3 Autocomplete Hidden Fields
```html
<asp:HiddenField runat="server" ID="hfTxtPysArs2BapGrupId" />
<asp:HiddenField runat="server" ID="hfTxtPysArs2Unvan" />
```

### 13.3 Hidden Field Kullanım Amaçları

- **JTalepOnaylandi**: Talebin onay durumu (0: Bekliyor, 1: Onaylandı)
- **JTalepSirano**: Satın alma talep sıra numarası
- **JPiyasa**: Piyasa araştırma görevlisi kullanıcı ID
- **JDuzenleme**: Düzenleyen memur/personel ID
- **JGerceklestirme**: Gerçekleştirme görevlisi ID
- **JHarcama**: Harcama yetkilisi ID
- **JOnaySıra**: Harcama onay sayısı
- **JAcilisFisi**: Bütçe fişi var mı? (0/1)
- **JKulButce**: Kullanılabilir bütçe tutarı
- **hfTxtPysArs2BapGrupId**: Piyasa araştırma görevlisi 2 BAP grup ID
- **hfTxtPysArs2Unvan**: Piyasa araştırma görevlisi 2 ünvan

---

## 14. Güvenlik ve Hata Yönetimi

### 14.1 SQL Injection Koruması

Kod içinde **OracleParameter** kullanılarak parametrik sorgular yapılıyor:

```csharp
OracleDB.ExecuteNonQuery(sql,
    new OracleParameter("MYSNUMBER", txtMysNumber.Text),
    new OracleParameter("PROJEID", Kontrol.PRJID),
    new OracleParameter("ONAYSAYISI", JOnaySıra.Value));
```

**Ancak dikkat:** Bazı yerlerde string concatenation kullanılıyor (SQL Injection riski!):

```csharp
// RİSKLİ KOD ÖRNEĞİ
string sql = "SELECT * FROM AP_SATINALMA_TALEP WHERE PROJE_ID=" + Kontrol.PRJID;
```

**Öneri:** Tüm sorgular parametrik hale getirilmeli.

### 14.2 Hata Mesajları

Kullanıcı dostu hata mesajları `lblMesaj` label'ı ile gösteriliyor:

```csharp
lblMesaj.Text = "İşlem başarıyla gerçekleştirildi.";
lblMesaj.Text = "Hata: " + exceptionMessage;
```

**Öneri:**
- Teknik hatalar loglama sistemine yazılmalı
- Kullanıcıya genel hata mesajı gösterilmeli
- Stack trace kesinlikle gösterilmemeli

### 14.3 Try-Catch Bloklarının Eksikliği

Kodda genelde try-catch blokları yok. Hata yönetimi eksik.

**Öneri:**
```csharp
try
{
    // Kritik işlemler
    OracleDB.ExecuteNonQuery(...);
}
catch (OracleException ex)
{
    // Veritabanı hatasını logla
    Logger.LogError(ex);
    lblMesaj.Text = "İşlem sırasında bir hata oluştu. Lütfen sistem yöneticisine başvurunuz.";
}
catch (Exception ex)
{
    // Genel hata
    Logger.LogError(ex);
    lblMesaj.Text = "Beklenmeyen bir hata oluştu.";
}
```

---

## 15. Performans Optimizasyonu Önerileri

### 15.1 Veritabanı Sorguları

**Mevcut Durum:**
Bazı yerlerde döngü içinde sorgu çalıştırılıyor:

```csharp
foreach (GridViewRow item in grdOnayButceKalemleri.Rows)
{
    // Her satır için ayrı sorgu!
    DataTable dt = OracleDB.GetDataTable("SELECT * ...");
}
```

**Öneri:**
- Batch işlemler kullanılmalı
- Tek sorguda tüm veriler çekilmeli
- `IN` clause kullanılmalı

### 15.2 ViewState Optimizasyonu

GridView'lar için ViewState devre dışı bırakılabilir:

```xml
<asp:GridView EnableViewState="false" ...>
```

### 15.3 AJAX Kullanımı

UpdatePanel yerine lightweight AJAX çözümleri (WebMethod, PageMethod) kullanılabilir.

---

## 16. Test Senaryoları

### 16.1 Fonksiyonel Test Senaryoları

#### Senaryo 1: Yeni Onay Oluşturma
1. Create sayfasına git
2. Onay tarihi seç
3. İhale usulü seç (örn: Doğrudan Temin)
4. İhale şekli seç
5. Piyasa araştırma görevlisi seç
6. Bütçe kalemlerinden en az birini seç
7. Kaydet butonuna tıkla
8. Başarı mesajı kontrol et
9. Onay belgesi yazdırma butonunun aktif olduğunu doğrula

#### Senaryo 2: Mevcut Onay Düzenleme
1. Edit sayfasına git (onay sayısı ile)
2. Yaklaşık maliyet alanını güncelle
3. Yeni bütçe kalemi ekle
4. Kaydet butonuna tıkla
5. Başarı mesajı kontrol et

#### Senaryo 3: Avans Modülü
1. İhale usulü: Doğrudan Temin (avans) seç
2. Avans modülünün görünür olduğunu doğrula
3. Avans tutarı gir (üst limitin altında)
4. Avans verilecek kişi seç
5. Kaydet
6. Avans bilgilerinin DB'ye kaydedildiğini kontrol et

#### Senaryo 4: Ön Ödeme Modülü
1. Ön ödeme türü seç (Avans)
2. Üst limit ve kapatma süresinin gösterildiğini doğrula
3. Tutar ve kişi gir
4. Kaydet
5. Ön ödeme bilgilerinin kaydedildiğini kontrol et

### 16.2 Validasyon Test Senaryoları

#### Senaryo 5: Zorunlu Alan Validasyonu
1. Form aç
2. Zorunlu alanları boş bırak
3. Kaydet butonuna tıkla
4. Hata mesajının gösterildiğini doğrula
5. Kaydın oluşturulmadığını kontrol et

#### Senaryo 6: Yaklaşık Maliyet Limiti
1. Yaklaşık maliyet alanına kullanılabilir bütçeden büyük değer gir
2. Kaydet
3. "Yaklaşık maliyet Kullanılabilir Bütçe tutarından yüksek olamaz" mesajı gösterilmeli

#### Senaryo 7: Avans Üst Limit Kontrolü
1. Avans tutarı alanına üst limitten büyük değer gir
2. Kaydet
3. Hata mesajı kontrol et

### 16.3 Kurum Bazlı Test Senaryoları

#### Senaryo 8: Erciyes Üniversitesi
1. Kurumu Erciyes olarak ayarla
2. Piyasa araştırma görevlisi dropdown olarak gösterilmeli
3. Düzenleyen memur dropdown olarak gösterilmeli

#### Senaryo 9: Gazi Üniversitesi
1. Kurumu Gazi olarak ayarla
2. İhale usulünde "Doğrudan Temin (avans)" seçeneği gösterilmeli
3. DA seçildiğinde ihale şekli dropdown'u devre dışı kalmalı

### 16.4 Entegrasyon Test Senaryoları

#### Senaryo 10: Bütçe Kalemi Silme Engeli
1. Onay oluştur ve kaydet
2. Bu onay için piyasa araştırması oluştur
3. Edit sayfasında ilgili bütçe kalemini silmeye çalış
4. Silme butonunun görünmez olduğunu doğrula

#### Senaryo 11: Crystal Report Üretimi
1. Onay oluştur ve kaydet
2. "Onay Belgesi Yazdır" butonuna tıkla
3. PDF'in başarıyla generate edildiğini kontrol et
4. PDF içeriğinin doğru olduğunu doğrula

---

## 17. Bilinen Sorunlar ve Kısıtlamalar

### 17.1 SQL Injection Riski
Bazı sorgularda string concatenation kullanılıyor. Parametrik sorguya çevrilmeli.

### 17.2 Hata Yönetimi Eksikliği
Try-catch blokları yetersiz. Global hata yakalama mekanizması olmalı.

### 17.3 Kod Tekrarı
İki sayfa arasında %70 kod tekrarı var. Ortak base class veya user control kullanılmalı.

### 17.4 ViewState Şişkinliği
GridView ve diğer kontroller ViewState kullanıyor. Performans sorunlarına yol açabilir.

### 17.5 Session Dependency
Session kullanımı yoğun. Session timeout durumunda hata yönetimi eksik.

### 17.6 Hard-Coded Değerler
- Kullanıcı ID: `925` (MYS gönder butonu)
- Personel ID: `100919` (Ankara Hacı Bayram Veli Üni)
- Bütçe Destek Tür ID: `18`, `8` (Onay bakiyesi hesaplama)

Bu değerler config'e alınmalı.

### 17.7 Kurum Bazlı If-Else Zinciri
Çok fazla kurum kontrolü var. Strategy pattern veya factory pattern kullanılabilir.

---

## 18. Geliştirme Önerileri

### 18.1 Mimari İyileştirmeler

#### 18.1.1 Kod Tekrarını Azaltma
```csharp
// Ortak base class
public abstract class SatinAlmaTalepOnayBasePage : BAPSISAuthenticatedBasePage
{
    protected abstract void LoadPageData();
    protected abstract void SaveData();

    protected void CommonValidations()
    {
        // Ortak validasyonlar
    }
}
```

#### 18.1.2 Repository Pattern
```csharp
public interface ISatinAlmaRepository
{
    HarcamaOnay GetHarcamaOnay(int projeId, int onaySayisi);
    void SaveHarcamaOnay(HarcamaOnay onay);
    List<ButceKalemi> GetButceKalemleri(int talepSirano, int projeId);
}
```

#### 18.1.3 Service Layer
```csharp
public class SatinAlmaService
{
    private ISatinAlmaRepository _repository;

    public ValidationResult ValidateOnay(HarcamaOnay onay)
    {
        // Validasyonlar
    }

    public void CreateOnay(HarcamaOnay onay)
    {
        // İş mantığı
    }
}
```

### 18.2 Güvenlik İyileştirmeleri

1. **Parametrik Sorgular**: Tüm SQL sorguları parametrik hale getirilmeli
2. **Input Validation**: Tüm kullanıcı girdileri sanitize edilmeli
3. **Output Encoding**: XSS önlemi için HTML encode yapılmalı
4. **CSRF Token**: Form'lara CSRF token ekle nmeli
5. **Authorization**: Sayfa bazlı yetki kontrolleri olmalı

### 18.3 UI/UX İyileştirmeleri

1. **Loading Indicator**: AJAX işlemleri için loading göstergesi
2. **Client-Side Validation**: Sunucu yükünü azaltmak için
3. **Tooltip**: Alanlara açıklayıcı tooltip'ler
4. **Responsive Design**: Mobil uyumluluk
5. **Accessibility**: WCAG standartlarına uyum

### 18.4 Performans İyileştirmeleri

1. **Lazy Loading**: GridView'lar için pagination
2. **Caching**: Dropdown listeleri cache'lenmeli
3. **Asenkron İşlemler**: Uzun süren işlemler asenkron yapılmalı
4. **Database Indexing**: Sık kullanılan kolonlara index
5. **Query Optimization**: N+1 query problemlerinin çözümü

---

## 19. API Dokümantasyonu

### 19.1 Web Servisleri

#### dataService.svc/SearchUsersAcademicAndOther

**Endpoint:** `{ApsisWebAdres}/services/dataService.svc/SearchUsersAcademicAndOther`

**Method:** GET

**Parameters:**
- `searchParam` (string): Arama terimi (min 3 karakter)

**Response:**
```json
{
  "d": [
    {
      "Unvan": "Prof. Dr.",
      "Ad": "Ahmet",
      "Soyad": "Yılmaz",
      "BapGrupID": "1"
    },
    ...
  ]
}
```

**Kullanım:** Autocomplete için kullanıcı arama

---

## 20. Veritabanı Şeması (Özet)

```sql
-- Ana Tablolar

CREATE TABLE AP_SATINALMA_TALEP (
    TALEP_ID NUMBER PRIMARY KEY,
    PROJE_ID NUMBER,
    SIRANO NUMBER,
    DURUM VARCHAR2(10),  -- TDB, TSL, ALM
    TALEPONAY NUMBER(1), -- 0/1
    TUR VARCHAR2(2),     -- G: Genel
    PIYASAARSGOR2 VARCHAR2(200)
);

CREATE TABLE AP_SATINALMATALEP_DETAY (
    PROJE_ID NUMBER,
    TALEP_SIRANO NUMBER,
    SIRANO NUMBER,
    MALZEME VARCHAR2(500),
    MIKTAR NUMBER,
    BIRIMADI VARCHAR2(50),
    KDVLITUTAR NUMBER(18,2),
    EKONOMIK NUMBER,
    TERTIP NUMBER,
    EKONOMIKKOD VARCHAR2(50),
    TERTIPKOD VARCHAR2(50),
    DESTEKTURID NUMBER,
    BUTCE_ID NUMBER,
    ONAYALINDI NUMBER(1),
    ACIKLAMA VARCHAR2(4000),
    PRIMARY KEY (PROJE_ID, TALEP_SIRANO, SIRANO)
);

CREATE TABLE AP_SATINALMA_HARCAMAONAY (
    ONAY_SAYISI NUMBER PRIMARY KEY,
    PROJE_ID NUMBER,
    TALEP_SIRA NUMBER,
    TARIH DATE,
    MALI_YIL VARCHAR2(4),
    IHALE_USULU VARCHAR2(50),
    YAKLASIK_MALIYET NUMBER(18,2),
    AVANS_SARTLAR VARCHAR2(200),
    AVANS_KIME VARCHAR2(200),
    AVANS_KIME_ID NUMBER,
    PIYASAARSGOR VARCHAR2(200),
    PIYASAARSGOR2 VARCHAR2(200),
    PIYASAARSGOR2UNVAN VARCHAR2(50),
    PIYASAARSGOR3 VARCHAR2(200),
    ONAYMEMUR NUMBER,
    ONAYYETKILISI NUMBER,
    HARCAMAYET NUMBER,
    MYS_NUMBER VARCHAR2(50),
    ON_ODEME_TURU NUMBER,
    ONAYHAVUZU NUMBER(18,2),
    OANKI_BAKIYE NUMBER(18,2),
    SON_ISLEM_YAPAN NUMBER,
    MUAYENE VARCHAR2(500),
    GERCEKLESTIRMESURESI VARCHAR2(100),
    ILANSEKLI VARCHAR2(200),
    ON_YETERLIK VARCHAR2(200),
    FIYATFARKI VARCHAR2(200),
    IHALE_ACIKLAMA VARCHAR2(500),
    TURU VARCHAR2(1) -- G: Genel
);

CREATE TABLE AP_SATINALMA_HARCAMAONAYDETAY (
    PROJE_ID NUMBER,
    ONAY_SAYISI NUMBER,
    TALEP_SIRA NUMBER,
    TALEP_DETAYSIRA NUMBER,
    PRIMARY KEY (PROJE_ID, ONAY_SAYISI, TALEP_SIRA, TALEP_DETAYSIRA)
);

CREATE TABLE AP_SATINALMA_ONAYHAVUZU (
    PROJE_ID NUMBER,
    TALEP_SIRANO NUMBER,
    SIRANO NUMBER,
    KDVLITUTAR NUMBER(18,2),
    PRIMARY KEY (PROJE_ID, TALEP_SIRANO, SIRANO)
);

CREATE TABLE APONODEME_TURLERI (
    ON_ODEME_TURU NUMBER PRIMARY KEY,
    ON_ODEME_ADI VARCHAR2(50),
    BUTCE_LIMIT NUMBER(18,2),
    SURE_LIMIT NUMBER -- Gün cinsinden
);

CREATE TABLE APSATINALMA_IHALESEKLI (
    TUR VARCHAR2(2),  -- DT, PU, BI, AI, vb.
    MADDE VARCHAR2(10),
    ALTMADDE VARCHAR2(10),
    ISACTIVE VARCHAR2(1) -- Y/N
);

-- Diğer tablolar
AP_SATINALMA_PIYASAARAST   -- Piyasa araştırması kayıtları
AP_SATINALMA_SIPARIS       -- Sipariş kayıtları
AP_SATINALMA_FATURA        -- Fatura kayıtları
AP_SATINALMA_MIF           -- Mal İşlem Fişi
AP_SATINALMA_TIF           -- Tahakkuk İşlem Fişi
```

---

## Sonuç

Bu dokümantasyon, BAPSIS satın alma talebi onay sayfalarının kapsamlı teknik analizini sunmaktadır. Sayfalar karmaşık bir yapıya sahip olup, çok sayıda kurum bazlı özelleştirme içermektedir.

**Önemli Noktalar:**
- Dinamik UI konfigürasyonu ile esneklik sağlanıyor
- Kurum bazlı iş kuralları merkezi kod yerine if-else yapıları ile yönetiliyor
- Avans ve Ön Ödeme iki ayrı modül olarak yönetiliyor
- Crystal Reports entegrasyonu ile çeşitli kurum formatlarında belgeler üretiliyor
- Veritabanı işlemleri Oracle PL/SQL stored procedure'ler ile gerçekleştiriliyor

**Geliştirme Gereksinimleri:**
Yeni bir developer'ın bu sisteme adapte olabilmesi için:
1. ASP.NET Web Forms bilgisi
2. Oracle veritabanı ve PL/SQL bilgisi
3. Crystal Reports bilgisi
4. jQuery ve AJAX bilgisi
5. Türk kamu ihale mevzuatı hakkında temel bilgi

---

**Doküman Versiyonu:** V1.0
**Tarih:** 2025-10-10
**Hazırlayan:** Claude Code Analysis

import React, { useState } from 'react';

// Mock data for institutions
const institutions = [
  { id: 1, name: 'Gazi Üniversitesi', code: 'GAZI' },
  { id: 2, name: 'Erciyes Üniversitesi', code: 'ERCIYES' },
  { id: 3, name: 'Ondokuz Mayıs Üniversitesi', code: 'OMU' },
  { id: 4, name: 'Ankara Hacı Bayram Veli Üniversitesi', code: 'AHBV' },
  { id: 5, name: 'Süleyman Demirel Üniversitesi', code: 'SDU' },
  { id: 6, name: 'Ankara Üniversitesi', code: 'ANKARA' },
  { id: 7, name: 'Bursa Uludağ Üniversitesi', code: 'ULUDAG' },
  { id: 8, name: 'Acıbadem Üniversitesi (Vakıf)', code: 'ACIBADEM' },
  { id: 9, name: 'Lokman Hekim Üniversitesi (Vakıf)', code: 'LOKMAN' },
  { id: 10, name: 'İstanbul Ticaret Üniversitesi (Vakıf)', code: 'TICARET' },
  { id: 11, name: 'Akdeniz Üniversitesi', code: 'AKDENIZ' },
  { id: 12, name: 'Çanakkale Onsekiz Mart Üniversitesi', code: 'COMU' },
];

// Dynamic elements configuration
const dynamicElements = {
  create: [
    { key: '36_trMysNumber', name: 'MYS Numarası', defaultVisible: false },
    { key: '36_trMuayeneKomisyon', name: 'Muayene Kabul Komisyonu', defaultVisible: false },
    { key: '36_trPiyasaArastirma2', name: 'Piyasa Araştırma Görevlisi 2', defaultVisible: false },
  ],
  edit: [
    { key: '13_trMysNumber', name: 'MYS Numarası', defaultVisible: false },
    { key: '13_trMuayeneKomisyon', name: 'Muayene Kabul Komisyonu', defaultVisible: false },
    { key: '13_trPiyasaArastirma2', name: 'Piyasa Araştırma Görevlisi 2', defaultVisible: false },
    { key: '13_trPiyasaArastirma3', name: 'Piyasa Araştırma Görevlisi 3 (Düz. Memur Yerine)', defaultVisible: false },
    { key: '13_trPiyasaArastirma4', name: 'Gerçekleştirme Süresi', defaultVisible: false },
  ]
};

// Institution specific features
const institutionFeatures = {
  GAZI: {
    name: 'Gazi Üniversitesi',
    features: [
      'Doğrudan Temin (avans) seçeneği mevcut',
      'Pazarlık usulünde ihale şekli boş bırakılır',
      'DA seçilince ihale şekli devre dışı kalır',
    ],
    ihaleUsulleri: ['DT', 'DA', 'PU', 'BI', 'EL', 'DO', 'BU', 'AI'],
  },
  ERCIYES: {
    name: 'Erciyes Üniversitesi',
    features: [
      'Piyasa araştırma görevlisi DROPDOWN olarak gösterilir',
      'Düzenleyen memur DROPDOWN olarak gösterilir',
      'ONAYMEMUR alanı özel olarak güncellenir',
      'DO veya BU seçilirse ihale şekli boş bırakılır',
    ],
    ihaleUsulleri: ['DT', 'PU', 'BI', 'EL', 'DO', 'BU', 'AI'],
    useDropdownForPiyasa: true,
  },
  OMU: {
    name: 'Ondokuz Mayıs Üniversitesi',
    features: [
      'Düzenleyen memur dropdown aktif',
      'Memur listesi sadece PERSONEL tablosundan çekilir',
      'Özel onay belgesi: OnayBelgesiOmu.rpt',
    ],
    ihaleUsulleri: ['DT', 'PU', 'BI', 'EL', 'DO', 'BU', 'AI'],
    reportTemplate: 'OnayBelgesiOmu.rpt',
  },
  AHBV: {
    name: 'Ankara Hacı Bayram Veli Üniversitesi',
    features: [
      'Gerçekleştirme görevlisi dropdown DEVRE DIŞI',
      'Sabit personel atanır: PersonelID = 100919',
    ],
    ihaleUsulleri: ['DT', 'PU', 'BI', 'EL', 'DO', 'BU', 'AI'],
    fixedGerceklestirme: '100919',
  },
  SDU: {
    name: 'Süleyman Demirel Üniversitesi',
    features: [
      'Gerçekleştirme görevlisi SADECE proje yürütücüsü olabilir',
      'Ekip üyeleri seçilemez',
    ],
    ihaleUsulleri: ['DT', 'PU', 'BI', 'EL', 'DO', 'BU', 'AI'],
    onlyProjectLeader: true,
  },
  ANKARA: {
    name: 'Ankara Üniversitesi',
    features: [
      'Gerçekleştirme görevlisi sadece proje yürütücüsü',
      'İhale usulü 35 için özel metin: "4734 Say. K.İ.K.\'nun 3(f) bendi uyarınca çıkarılan 2003/5018 sayılı K.\'nin 35.maddesi"',
      'Özel Crystal Report formatı: OnayBelgesi2.rpt',
    ],
    ihaleUsulleri: ['DT', 'PU', 'BI', 'EL', 'DO', 'BU', 'AI'],
    reportTemplate: 'OnayBelgesi2.rpt',
  },
  ULUDAG: {
    name: 'Bursa Uludağ Üniversitesi',
    features: [
      'Gerçekleştirme süresi alanı (txtGerceklestirmeSuresi4) mevcut',
      'Özel Crystal Report şablonu: OnayBelgesi3.rpt',
    ],
    ihaleUsulleri: ['DT', 'PU', 'BI', 'EL', 'DO', 'BU', 'AI'],
    reportTemplate: 'OnayBelgesi3.rpt',
    hasGerceklestirmeSuresi: true,
  },
  ACIBADEM: {
    name: 'Acıbadem Üniversitesi',
    features: [
      'VAKIF ÜNİVERSİTESİ',
      'İhale usulleri kısıtlı: Sadece DT, PU, BI, AI',
      'EL, DO, BU seçenekleri YOK',
    ],
    ihaleUsulleri: ['DT', 'PU', 'BI', 'AI'],
    isVakif: true,
  },
  LOKMAN: {
    name: 'Lokman Hekim Üniversitesi',
    features: [
      'VAKIF ÜNİVERSİTESİ',
      'İhale usulleri kısıtlı: Sadece DT, PU, BI, AI',
      'EL, DO, BU seçenekleri YOK',
    ],
    ihaleUsulleri: ['DT', 'PU', 'BI', 'AI'],
    isVakif: true,
  },
  TICARET: {
    name: 'İstanbul Ticaret Üniversitesi',
    features: [
      'VAKIF ÜNİVERSİTESİ',
      'İhale usulleri kısıtlı: Sadece DT, PU, BI, AI',
    ],
    ihaleUsulleri: ['DT', 'PU', 'BI', 'AI'],
    isVakif: true,
  },
  AKDENIZ: {
    name: 'Akdeniz Üniversitesi',
    features: [
      'Yatırım proje no ve piyasa araştırma görevlisi birleştirilir',
      'Özel onay yetkilisi sorgusu',
      'Özel kullanılabilir bütçe hesaplama: AP_ONAY_TOPLAMTUTAR()',
    ],
    ihaleUsulleri: ['DT', 'PU', 'BI', 'EL', 'DO', 'BU', 'AI'],
  },
  COMU: {
    name: 'Çanakkale Onsekiz Mart Üniversitesi',
    features: [
      'Muayene Komisyonu bilgisi ÖZEL olarak yazdırılır',
    ],
    ihaleUsulleri: ['DT', 'PU', 'BI', 'EL', 'DO', 'BU', 'AI'],
    hasMuayeneKomisyon: true,
  },
};

// İhale usulleri
const ihaleUsulleri = {
  vakif: [
    { value: 'SY', label: 'Seçim Yapınız' },
    { value: 'DT', label: 'Doğrudan Temin' },
    { value: 'PU', label: 'Pazarlık Usulü' },
    { value: 'BI', label: 'Belli İstekler Arası İhale' },
    { value: 'AI', label: 'Açık İhale' },
  ],
  devlet: [
    { value: 'SY', label: 'Seçim Yapınız' },
    { value: 'DT', label: 'Doğrudan Temin' },
    { value: 'DA', label: 'Doğrudan Temin (avans)' },
    { value: 'PU', label: 'Pazarlık Usulü' },
    { value: 'BI', label: 'Belli İstekler Arası İhale' },
    { value: 'EL', label: '5018 Sayılı' },
    { value: 'DO', label: 'Dosap' },
    { value: 'BU', label: 'Bursiyer' },
    { value: 'AI', label: 'Açık İhale' },
  ]
};

const SpendingApproveOffice = () => {
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [pageMode, setPageMode] = useState('create'); // 'create' or 'edit'
  const [dynamicElementsVisibility, setDynamicElementsVisibility] = useState({});
  const [showAllElements, setShowAllElements] = useState(false);

  const currentInstitution = institutionFeatures[selectedInstitution] || null;
  const isVakif = currentInstitution?.isVakif || false;
  const currentDynamicElements = dynamicElements[pageMode] || [];

  const handleInstitutionChange = (e) => {
    setSelectedInstitution(e.target.value);
    // Reset dynamic elements visibility
    const defaultVisibility = {};
    currentDynamicElements.forEach(elem => {
      defaultVisibility[elem.key] = elem.defaultVisible;
    });
    setDynamicElementsVisibility(defaultVisibility);
  };

  const toggleDynamicElement = (key) => {
    setDynamicElementsVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleAllElements = () => {
    const newVisibility = {};
    currentDynamicElements.forEach(elem => {
      newVisibility[elem.key] = !showAllElements;
    });
    setDynamicElementsVisibility(newVisibility);
    setShowAllElements(!showAllElements);
  };

  const getAvailableIhaleUsulleri = () => {
    if (!selectedInstitution) return [];

    if (isVakif) {
      return ihaleUsulleri.vakif;
    }

    // Institution specific filtering
    const allowedCodes = currentInstitution?.ihaleUsulleri || [];
    return ihaleUsulleri.devlet.filter(usul =>
      usul.value === 'SY' || allowedCodes.includes(usul.value)
    );
  };

  return (
    <div style={{ padding: '10px 0', maxWidth: '100%' }}>

      {/* Control Panel */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Institution Selector */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'white' }}>
              Kurum Seçimi
            </label>
            <select
              value={selectedInstitution}
              onChange={handleInstitutionChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '2px solid white',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Kurum Seçiniz...</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.code}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          {/* Page Mode Selector */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'white' }}>
              Sayfa Modu
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setPageMode('create')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: pageMode === 'create' ? '#4caf50' : 'white',
                  color: pageMode === 'create' ? 'white' : '#333',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Create (Onay)
              </button>
              <button
                onClick={() => setPageMode('edit')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: pageMode === 'edit' ? '#2196f3' : 'white',
                  color: pageMode === 'edit' ? 'white' : '#333',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Edit (Onay2)
              </button>
            </div>
          </div>

          {/* Dynamic Elements Toggle */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'white' }}>
              Dinamik Elementler
            </label>
            <button
              onClick={toggleAllElements}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: showAllElements ? '#ff9800' : 'white',
                color: showAllElements ? 'white' : '#333',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {showAllElements ? 'Tümünü Gizle' : 'Tümünü Göster'}
            </button>
          </div>
        </div>

        {/* Page Mode Info */}
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '15px',
          borderRadius: '8px',
          color: 'white'
        }}>
          <strong>Aktif Mod:</strong> {pageMode === 'create' ? 'CREATE PAGE (SatinAlmaTalepOnay.aspx)' : 'EDIT PAGE (SatinAlmaTalepOnay2.aspx)'}
          <br />
          <strong>Dosya:</strong> {pageMode === 'create' ? 'SatinAlmaTalepOnay.aspx.cs' : 'SatinAlmaTalepOnay2.aspx.cs'}
        </div>
      </div>

      {/* Institution Features */}
      {currentInstitution && (
        <div style={{
          background: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginTop: 0, color: '#856404' }}>
            🏛️ {currentInstitution.name} - Özel Özellikler
          </h3>
          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
            {currentInstitution.features.map((feature, idx) => (
              <li key={idx} style={{ marginBottom: '8px', color: '#856404' }}>
                {feature}
              </li>
            ))}
          </ul>
          {currentInstitution.reportTemplate && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>
              📄 Crystal Report: {currentInstitution.reportTemplate}
            </div>
          )}
        </div>
      )}

      {/* Main Form Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
        {/* Sidebar - Dynamic Elements */}
        <div>
          <div style={{
            background: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            position: 'sticky',
            top: '20px'
          }}>
            <h3 style={{ marginTop: 0, color: '#1976d2' }}>
              Dinamik Elementler
            </h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
              DB'den script ile değiştirilebilen elementler
            </p>

            {currentDynamicElements.map(elem => (
              <div
                key={elem.key}
                style={{
                  marginBottom: '12px',
                  padding: '12px',
                  background: dynamicElementsVisibility[elem.key] ? '#e8f5e9' : '#ffebee',
                  border: `2px solid ${dynamicElementsVisibility[elem.key] ? '#4caf50' : '#f44336'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => toggleDynamicElement(elem.key)}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '5px'
                }}>
                  <strong style={{ fontSize: '11px', color: '#666' }}>
                    {elem.key}
                  </strong>
                  <span style={{
                    padding: '2px 8px',
                    background: dynamicElementsVisibility[elem.key] ? '#4caf50' : '#f44336',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '10px'
                  }}>
                    {dynamicElementsVisibility[elem.key] ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  {elem.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div>
          {/* Project Information Section */}
          <div style={{
            background: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              marginTop: 0,
              paddingBottom: '10px',
              borderBottom: '2px solid #1976d2',
              color: '#1976d2'
            }}>
              Proje Tanımları
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  Projenin Yürütücüsü:
                </label>
                <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                  Prof. Dr. Ahmet Yılmaz
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  Proje Kodu:
                </label>
                <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                  2024-001
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  Projenin Başlığı:
                </label>
                <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                  Yapay Zeka Tabanlı Görüntü İşleme Sistemleri
                </div>
              </div>
            </div>
          </div>

          {/* Spending Approval Form */}
          <div style={{
            background: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              marginTop: 0,
              paddingBottom: '10px',
              borderBottom: '2px solid #1976d2',
              color: '#1976d2'
            }}>
              Harcama Onayı Oluşturma/Düzenleme
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              {/* Onay Sayısı */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  Onay Sayısı:
                </label>
                <input
                  type="text"
                  value={pageMode === 'create' ? 'Otomatik (MAX+1)' : '8819'}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '2px solid #e0e0e0',
                    background: '#f5f5f5',
                    color: '#2196f3',
                    fontWeight: 'bold'
                  }}
                />
              </div>

              {/* Onay Tarihi */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  Onay Tarihi <span style={{ color: 'red' }}>*</span>:
                </label>
                <input
                  type="date"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '2px solid #e0e0e0'
                  }}
                />
              </div>

              {/* MYS Numarası - Dynamic Element */}
              {dynamicElementsVisibility[pageMode === 'create' ? '36_trMysNumber' : '13_trMysNumber'] && (
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '15px',
                  background: '#e3f2fd',
                  border: '2px dashed #2196f3',
                  borderRadius: '8px',
                  animation: 'fadeIn 0.3s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      background: '#2196f3',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      marginRight: '10px'
                    }}>
                      DYNAMIC
                    </span>
                    <strong>MYS Numarası</strong>
                  </div>
                  <input
                    type="text"
                    placeholder="Mali Yönetim Sistemi Numarası"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '2px solid #2196f3'
                    }}
                  />
                </div>
              )}

              {/* İhale Usulü */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  İhale Usulü <span style={{ color: 'red' }}>*</span>:
                </label>
                {selectedInstitution && (
                  <div style={{
                    fontSize: '12px',
                    color: isVakif ? '#d32f2f' : '#1976d2',
                    marginBottom: '5px',
                    fontWeight: 'bold'
                  }}>
                    {isVakif ? '⚠️ VAKIF ÜNİVERSİTESİ - Kısıtlı seçenekler' : 'ℹ️ Devlet Üniversitesi'}
                  </div>
                )}
                <select
                  disabled={!selectedInstitution}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '2px solid #e0e0e0',
                    background: selectedInstitution ? 'white' : '#f5f5f5'
                  }}
                >
                  {getAvailableIhaleUsulleri().map(usul => (
                    <option key={usul.value} value={usul.value}>
                      {usul.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* İhale Şekli */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  İhale Şekli <span style={{ color: 'red' }}>*</span>:
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '2px solid #e0e0e0'
                  }}
                >
                  <option>Seçim Yapınız</option>
                  <option>4734/22-a</option>
                  <option>4734/22-b</option>
                  <option>4734/22-c</option>
                </select>
              </div>

              {/* Yaklaşık Maliyet */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  Yaklaşık Maliyet (TL):
                </label>
                <input
                  type="text"
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '2px solid #e0e0e0'
                  }}
                />
              </div>

              {/* Onay Havuzu Tutarı */}
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  Onay Havuzu Tutarı:
                </label>
                <input
                  type="text"
                  value="0.00"
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '2px solid #e0e0e0',
                    background: '#f5f5f5'
                  }}
                />
              </div>

              {/* Piyasa Araştırma Görevlisi */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  Piyasa Araştırma Görevlisi <span style={{ color: 'red' }}>*</span>:
                </label>
                {currentInstitution?.useDropdownForPiyasa ? (
                  <>
                    <div style={{
                      fontSize: '12px',
                      color: '#4caf50',
                      marginBottom: '5px',
                      fontWeight: 'bold'
                    }}>
                      ✓ DROPDOWN (Erciyes Özel)
                    </div>
                    <select
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '2px solid #4caf50'
                      }}
                    >
                      <option>Seçiniz...</option>
                      <option>Prof. Dr. Ahmet Yılmaz</option>
                      <option>Doç. Dr. Mehmet Demir</option>
                      <option>Diğer</option>
                    </select>
                  </>
                ) : (
                  <>
                    <div style={{
                      fontSize: '12px',
                      color: '#666',
                      marginBottom: '5px'
                    }}>
                      Textbox (Standart)
                    </div>
                    <input
                      type="text"
                      placeholder="Piyasa araştırma görevlisi adı"
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '2px solid #e0e0e0'
                      }}
                    />
                  </>
                )}
              </div>

              {/* Piyasa Araştırma 2 - Dynamic */}
              {dynamicElementsVisibility[pageMode === 'create' ? '36_trPiyasaArastirma2' : '13_trPiyasaArastirma2'] && (
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '15px',
                  background: '#fff3e0',
                  border: '2px dashed #ff9800',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      background: '#ff9800',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      marginRight: '10px'
                    }}>
                      DYNAMIC
                    </span>
                    <strong>Piyasa Araştırma Görevlisi 2</strong>
                  </div>
                  <input
                    type="text"
                    placeholder="Autocomplete - Min 3 karakter"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '2px solid #ff9800'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                    💡 jQuery Autocomplete: SearchUsersAcademicAndOther service
                  </div>
                </div>
              )}

              {/* Piyasa Araştırma 3 - Dynamic (Edit only) */}
              {pageMode === 'edit' && dynamicElementsVisibility['13_trPiyasaArastirma3'] && (
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '15px',
                  background: '#f3e5f5',
                  border: '2px dashed #9c27b0',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      background: '#9c27b0',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      marginRight: '10px'
                    }}>
                      DYNAMIC - EDIT ONLY
                    </span>
                    <strong>Piyasa Araştırma Görevlisi 3 (Düzenleyen Memur Yerine)</strong>
                  </div>
                  <input
                    type="text"
                    placeholder="Autocomplete - Düzenleyen memur yerine"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '2px solid #9c27b0'
                    }}
                  />
                </div>
              )}

              {/* Muayene Kabul Komisyonu - Dynamic */}
              {dynamicElementsVisibility[pageMode === 'create' ? '36_trMuayeneKomisyon' : '13_trMuayeneKomisyon'] && (
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '15px',
                  background: '#e8f5e9',
                  border: '2px dashed #4caf50',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      background: '#4caf50',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      marginRight: '10px'
                    }}>
                      DYNAMIC
                    </span>
                    <strong>Muayene Kabul Komisyonu</strong>
                  </div>
                  <input
                    type="text"
                    placeholder="Komisyon bilgisi"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '2px solid #4caf50'
                    }}
                  />
                  {currentInstitution?.hasMuayeneKomisyon && (
                    <div style={{
                      fontSize: '11px',
                      color: '#2e7d32',
                      marginTop: '5px',
                      fontWeight: 'bold'
                    }}>
                      ⚠️ {currentInstitution.name} için bu alan ÖZEL yazdırılır
                    </div>
                  )}
                </div>
              )}

              {/* Gerçekleştirme Süresi - Dynamic (Edit only, Bursa Uludağ) */}
              {pageMode === 'edit' && dynamicElementsVisibility['13_trPiyasaArastirma4'] && (
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '15px',
                  background: '#e1f5fe',
                  border: '2px dashed #03a9f4',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      background: '#03a9f4',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      marginRight: '10px'
                    }}>
                      DYNAMIC - EDIT ONLY
                    </span>
                    <strong>Gerçekleştirme Süresi</strong>
                  </div>
                  <input
                    type="text"
                    placeholder="Süre (gün)"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '2px solid #03a9f4'
                    }}
                  />
                  {currentInstitution?.hasGerceklestirmeSuresi && (
                    <div style={{
                      fontSize: '11px',
                      color: '#0277bd',
                      marginTop: '5px',
                      fontWeight: 'bold'
                    }}>
                      ⚠️ Bursa Uludağ Üniversitesi özel alanı
                    </div>
                  )}
                </div>
              )}

              {/* Gerçekleştirme Görevlisi */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  Gerçekleştirme Görevlisi:
                </label>
                {currentInstitution?.fixedGerceklestirme && (
                  <div style={{
                    fontSize: '12px',
                    color: '#d32f2f',
                    marginBottom: '5px',
                    fontWeight: 'bold'
                  }}>
                    ⚠️ SABİT DEĞER: PersonelID = {currentInstitution.fixedGerceklestirme}
                  </div>
                )}
                <select
                  disabled={currentInstitution?.fixedGerceklestirme}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '2px solid #e0e0e0',
                    background: currentInstitution?.fixedGerceklestirme ? '#ffebee' : 'white'
                  }}
                >
                  <option>Prof. Dr. Ahmet Yılmaz (Yürütücü)</option>
                  {!currentInstitution?.onlyProjectLeader && (
                    <>
                      <option>Satın Alma Müdürü</option>
                      <option>Mali İşler Müdürü</option>
                    </>
                  )}
                </select>
                {currentInstitution?.onlyProjectLeader && (
                  <div style={{
                    fontSize: '11px',
                    color: '#d32f2f',
                    marginTop: '5px',
                    fontWeight: 'bold'
                  }}>
                    ⚠️ {currentInstitution.name} - Sadece proje yürütücüsü seçilebilir
                  </div>
                )}
              </div>

              {/* Harcama Yetkilisi */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>
                  Harcama Yetkilisi:
                </label>
                <div style={{
                  padding: '10px',
                  background: '#f5f5f5',
                  borderRadius: '6px',
                  color: '#2196f3',
                  fontWeight: 'bold'
                }}>
                  Sistemde Tanımlı Harcama Yetkilisi
                </div>
              </div>
            </div>
          </div>

          {/* Budget Items Grid */}
          <div style={{
            background: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              marginTop: 0,
              paddingBottom: '10px',
              borderBottom: '2px solid #1976d2',
              color: '#1976d2'
            }}>
              Onay Alınacak Bütçe Kalemleri
            </h3>

            <div style={{ overflowX: 'auto', marginTop: '15px' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px'
              }}>
                <thead>
                  <tr style={{ background: '#1976d2', color: 'white' }}>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>B.Türü</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Tanımı/Adı</th>
                    <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Miktar</th>
                    <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Birimi</th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Açıklama</th>
                    <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>E.Kod</th>
                    <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>B.Tertibi</th>
                    <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Seç</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#f5f5f5' }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>Malzeme</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>Laboratuvar Kimyasalları</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>100</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Adet</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>Test için</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>03.5.1</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>06.4.1</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <input type="checkbox" />
                    </td>
                  </tr>
                  <tr style={{ background: 'white' }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>Hizmet</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>Yazılım Geliştirme</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>1</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Adet</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>AI modül</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>03.3.7</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>06.3.7</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <input type="checkbox" />
                    </td>
                  </tr>
                  <tr style={{ background: '#ddffdd' }}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>Donanım</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>Sunucu</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>2</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>Adet</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>Yedekli sistem</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>03.2.5</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>06.2.5</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <input type="checkbox" checked disabled />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: '#e3f2fd',
              borderRadius: '6px',
              fontSize: '12px'
            }}>
              <strong>Not:</strong> Yeşil renkli satır = Onay alınmış (ONAYALINDI=1), Edit modunda silinemez
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            background: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {pageMode === 'create' && (
                <button style={{
                  padding: '12px 24px',
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Tümünü Seç
                </button>
              )}
              <button style={{
                padding: '12px 24px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                {pageMode === 'create' ? 'Kaydet (INSERT)' : 'Kaydet (UPDATE)'}
              </button>
              {pageMode === 'edit' && (
                <button style={{
                  padding: '12px 24px',
                  background: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Onay Tarihi Değiştir
                </button>
              )}
              <button style={{
                padding: '12px 24px',
                background: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Onay Belgesi Yazdır (PDF)
              </button>
              {pageMode === 'create' && (
                <button style={{
                  padding: '12px 24px',
                  background: '#00bcd4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Yeni Onay
                </button>
              )}
              <button style={{
                padding: '12px 24px',
                background: '#757575',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Info Footer */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#263238',
        color: 'white',
        borderRadius: '8px',
        fontSize: '12px'
      }}>
        <h4 style={{ marginTop: 0 }}>🔧 Teknik Bilgiler</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div>
            <strong>Database Tables:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
              <li>AP_SATINALMA_TALEP</li>
              <li>AP_SATINALMA_HARCAMAONAY</li>
              <li>AP_SATINALMATALEP_DETAY</li>
              <li>APONODEME_TURLERI</li>
            </ul>
          </div>
          <div>
            <strong>Client-Side:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
              <li>jQuery 3.6.0</li>
              <li>jQuery UI Autocomplete</li>
              <li>Telerik RadDatePicker</li>
              <li>AJAX UpdatePanel</li>
            </ul>
          </div>
          <div>
            <strong>Server-Side:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
              <li>ASP.NET Web Forms</li>
              <li>Oracle Database</li>
              <li>Crystal Reports</li>
              <li>C# Code-behind</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingApproveOffice;

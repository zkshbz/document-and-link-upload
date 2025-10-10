import React from 'react';

function CompactHistory() {
  // Mock history data
  const historyData = [
    { id: 1, date: '2025-10-10 14:30', user: 'Ahmet Yılmaz', action: 'Dosya Yüklendi', file: 'proje_rapor.pdf', status: 'Başarılı' },
    { id: 2, date: '2025-10-10 13:15', user: 'Mehmet Demir', action: 'Link Eklendi', file: 'https://example.com/doc', status: 'Başarılı' },
    { id: 3, date: '2025-10-10 11:45', user: 'Ayşe Kaya', action: 'Dosya Silindi', file: 'eski_versiyon.docx', status: 'Başarılı' },
    { id: 4, date: '2025-10-09 16:20', user: 'Fatma Şahin', action: 'Dosya Yüklendi', file: 'analiz.xlsx', status: 'Başarılı' },
    { id: 5, date: '2025-10-09 14:55', user: 'Ali Özkan', action: 'Link Eklendi', file: 'https://github.com/project', status: 'Başarılı' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px 30px',
          color: 'white'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>
            📋 Compact History
          </h2>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
            Dosya ve bağlantı işlem geçmişi
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          padding: '20px 30px',
          background: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>
              {historyData.length}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Toplam İşlem
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4caf50' }}>
              {historyData.filter(h => h.action.includes('Yüklendi')).length}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Dosya Yükleme
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2196f3' }}>
              {historyData.filter(h => h.action.includes('Link')).length}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Link Ekleme
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f44336' }}>
              {historyData.filter(h => h.action.includes('Silindi')).length}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Silme İşlemi
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          padding: '20px 30px',
          background: 'white',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            style={{
              padding: '10px 15px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              flex: '1',
              minWidth: '200px'
            }}
          />
          <select
            style={{
              padding: '10px 15px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option>Tüm İşlemler</option>
            <option>Dosya Yüklendi</option>
            <option>Link Eklendi</option>
            <option>Dosya Silindi</option>
          </select>
          <input
            type="date"
            style={{
              padding: '10px 15px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          />
          <button
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔍 Filtrele
          </button>
        </div>

        {/* History Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '13px' }}>
                  TARİH & SAAT
                </th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '13px' }}>
                  KULLANICI
                </th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '13px' }}>
                  İŞLEM
                </th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '13px' }}>
                  DOSYA/LINK
                </th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#666', fontSize: '13px' }}>
                  DURUM
                </th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    background: index % 2 === 0 ? 'white' : '#fafafa',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafafa'}
                >
                  <td style={{ padding: '15px', fontSize: '14px', color: '#555' }}>
                    {item.date}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', fontWeight: '500' }}>
                    {item.user}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: item.action.includes('Yüklendi') ? '#e8f5e9' :
                                 item.action.includes('Link') ? '#e3f2fd' :
                                 '#ffebee',
                      color: item.action.includes('Yüklendi') ? '#2e7d32' :
                             item.action.includes('Link') ? '#1565c0' :
                             '#c62828'
                    }}>
                      {item.action}
                    </span>
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#555', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.file}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: '#e8f5e9',
                      color: '#2e7d32'
                    }}>
                      ✓ {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 30px',
          background: '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Toplam {historyData.length} kayıt gösteriliyor
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button style={{
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
              background: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              ‹
            </button>
            <button style={{
              padding: '8px 12px',
              border: '1px solid #667eea',
              background: '#667eea',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              1
            </button>
            <button style={{
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
              background: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              2
            </button>
            <button style={{
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
              background: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              3
            </button>
            <button style={{
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
              background: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompactHistory;

import React, { useState } from 'react';

function DomainEventHistory() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock domain events data
  const domainEvents = [
    {
      id: 1,
      eventType: 'SpendingApprovalCreated',
      aggregateId: 'SA-2024-001',
      timestamp: '2025-10-10 14:30:25',
      user: 'ahmet.yilmaz@uni.edu.tr',
      version: 1,
      data: {
        approvalNumber: 8819,
        projectId: 6470,
        institution: 'Gazi Üniversitesi',
        approvalDate: '2025-10-10',
        procurementMethod: 'Doğrudan Temin',
        estimatedCost: 25000.00,
        status: 'Created'
      }
    },
    {
      id: 2,
      eventType: 'SpendingApprovalUpdated',
      aggregateId: 'SA-2024-001',
      timestamp: '2025-10-10 15:15:42',
      user: 'mehmet.demir@uni.edu.tr',
      version: 2,
      data: {
        approvalNumber: 8819,
        changes: {
          estimatedCost: { old: 25000.00, new: 27500.00 },
          procurementMethod: { old: 'Doğrudan Temin', new: 'Pazarlık Usulü' }
        },
        status: 'Updated'
      }
    },
    {
      id: 3,
      eventType: 'BudgetItemAdded',
      aggregateId: 'SA-2024-001',
      timestamp: '2025-10-10 15:20:18',
      user: 'ayse.kaya@uni.edu.tr',
      version: 3,
      data: {
        budgetItemId: 'BI-001',
        description: 'Laboratuvar Ekipmanları',
        amount: 15000.00,
        economicCode: '03.5.1',
        budgetCode: '06.4.1'
      }
    },
    {
      id: 4,
      eventType: 'DocumentUploaded',
      aggregateId: 'DOC-2024-042',
      timestamp: '2025-10-09 16:45:33',
      user: 'fatma.sahin@uni.edu.tr',
      version: 1,
      data: {
        documentId: 'DOC-2024-042',
        fileName: 'teknik_sartname.pdf',
        fileSize: 2048576,
        fileType: 'PDF',
        uploadType: 'Dosya'
      }
    },
    {
      id: 5,
      eventType: 'ApprovalReportGenerated',
      aggregateId: 'SA-2024-001',
      timestamp: '2025-10-10 16:00:15',
      user: 'system',
      version: 4,
      data: {
        reportId: 'RPT-2024-156',
        reportType: 'OnayBelgesi.rpt',
        format: 'PDF',
        status: 'Generated'
      }
    },
  ];

  const eventTypeColors = {
    'SpendingApprovalCreated': { bg: '#e8f5e9', color: '#2e7d32', icon: '✓' },
    'SpendingApprovalUpdated': { bg: '#fff3e0', color: '#e65100', icon: '✎' },
    'BudgetItemAdded': { bg: '#e3f2fd', color: '#1565c0', icon: '+' },
    'DocumentUploaded': { bg: '#f3e5f5', color: '#6a1b9a', icon: '📄' },
    'ApprovalReportGenerated': { bg: '#fce4ec', color: '#c2185b', icon: '📋' },
  };

  const getEventColor = (eventType) => {
    return eventTypeColors[eventType] || { bg: '#f5f5f5', color: '#666', icon: '•' };
  };

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
            🔄 Domain Event History
          </h2>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
            Event Sourcing ile yönetilen domain olayları
          </p>
        </div>

        {/* Info Panel */}
        <div style={{
          padding: '20px 30px',
          background: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
            {Object.entries(eventTypeColors).map(([type, color]) => (
              <div
                key={type}
                style={{
                  padding: '12px',
                  background: 'white',
                  borderRadius: '8px',
                  border: `2px solid ${color.bg}`,
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: '24px',
                  color: color.color,
                  marginBottom: '5px'
                }}>
                  {color.icon}
                </div>
                <div style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>
                  {type.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', minHeight: '600px' }}>
          {/* Events Timeline */}
          <div style={{ borderRight: '1px solid #e0e0e0', padding: '20px 30px' }}>
            <h3 style={{ marginTop: 0, fontSize: '18px', marginBottom: '20px' }}>
              Event Stream
            </h3>

            <div style={{ position: 'relative', paddingLeft: '30px' }}>
              {/* Timeline Line */}
              <div style={{
                position: 'absolute',
                left: '7px',
                top: '0',
                bottom: '0',
                width: '2px',
                background: 'linear-gradient(to bottom, #667eea, #764ba2)'
              }} />

              {domainEvents.map((event, index) => {
                const color = getEventColor(event.eventType);
                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    style={{
                      position: 'relative',
                      marginBottom: '25px',
                      cursor: 'pointer',
                      padding: '15px',
                      background: selectedEvent?.id === event.id ? '#f5f5f5' : 'white',
                      borderRadius: '8px',
                      border: selectedEvent?.id === event.id ? '2px solid #667eea' : '2px solid transparent',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedEvent?.id !== event.id) {
                        e.currentTarget.style.background = '#fafafa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedEvent?.id !== event.id) {
                        e.currentTarget.style.background = 'white';
                      }
                    }}
                  >
                    {/* Timeline Dot */}
                    <div style={{
                      position: 'absolute',
                      left: '-30px',
                      top: '20px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: color.color,
                      border: '3px solid white',
                      boxShadow: '0 0 0 2px ' + color.color
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: color.bg,
                        color: color.color
                      }}>
                        {color.icon} {event.eventType}
                      </span>
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        v{event.version}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                      <strong>Aggregate:</strong> {event.aggregateId}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {event.timestamp} • {event.user}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event Details Panel */}
          <div style={{ background: '#fafafa', padding: '20px 30px' }}>
            <h3 style={{ marginTop: 0, fontSize: '18px', marginBottom: '20px' }}>
              Event Details
            </h3>

            {selectedEvent ? (
              <div>
                {/* Event Header */}
                <div style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    color: getEventColor(selectedEvent.eventType).color
                  }}>
                    {getEventColor(selectedEvent.eventType).icon} {selectedEvent.eventType}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>
                    <strong>Event ID:</strong> {selectedEvent.id}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>
                    <strong>Aggregate ID:</strong> {selectedEvent.aggregateId}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>
                    <strong>Version:</strong> {selectedEvent.version}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>
                    <strong>Timestamp:</strong> {selectedEvent.timestamp}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    <strong>User:</strong> {selectedEvent.user}
                  </div>
                </div>

                {/* Event Data */}
                <div style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    color: '#333'
                  }}>
                    Event Data
                  </div>
                  <pre style={{
                    background: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    lineHeight: '1.6',
                    overflow: 'auto',
                    maxHeight: '400px',
                    margin: 0,
                    fontFamily: 'Monaco, Consolas, monospace'
                  }}>
                    {JSON.stringify(selectedEvent.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#999'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>👈</div>
                <div>Select an event to view details</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DomainEventHistory;

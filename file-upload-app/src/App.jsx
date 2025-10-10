import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import UploadDocument from './pages/UploadDocument'
import SpendingApproveOffice from './pages/SpendingApproveOffice'
import CompactHistory from './pages/CompactHistory'
import DomainEventHistory from './pages/DomainEventHistory'
import './App.css'

function Navigation() {
  const location = useLocation()

  const menuItems = [
    { path: '/upload-document', label: '📤 Upload Document', icon: '📤' },
    { path: '/spending-approve-office', label: '💰 Spending Approve', icon: '💰' },
    { path: '/compact-history', label: '📋 Compact History', icon: '📋' },
    { path: '/domain-event-history', label: '🔄 Domain Events', icon: '🔄' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '15px 30px',
        display: 'flex',
        alignItems: 'center',
        gap: '30px'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          marginRight: 'auto'
        }}>
          📄 BAPSIS Doküman Sistemi
        </div>

        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s',
              background: isActive(item.path)
                ? 'rgba(255,255,255,0.25)'
                : 'transparent',
              color: 'white',
              border: '2px solid',
              borderColor: isActive(item.path) ? 'white' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'transparent'
              }
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label.replace(/.*\s/, '')}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router basename="/document-and-link-upload">
      <div className="app-container">
        <Navigation />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<UploadDocument />} />
            <Route path="/upload-document" element={<UploadDocument />} />
            <Route path="/spending-approve-office" element={<SpendingApproveOffice />} />
            <Route path="/compact-history" element={<CompactHistory />} />
            <Route path="/domain-event-history" element={<DomainEventHistory />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

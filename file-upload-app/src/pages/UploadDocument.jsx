import { useState, useRef } from 'react'

function UploadDocument() {
  const [files, setFiles] = useState([])
  const [activeTab, setActiveTab] = useState('dosya')
  const [fileType, setFileType] = useState('')
  const [shortName, setShortName] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [showError, setShowError] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const fileInputRef = useRef(null)

  const fileTypes = [
    { value: 'pdf', label: 'PDF', maxSize: 25, formats: '.pdf' },
    { value: 'word', label: 'Word', maxSize: 10, formats: '.doc, .docx' },
    { value: 'excel', label: 'Excel', maxSize: 10, formats: '.xls, .xlsx' },
    { value: 'image', label: 'Resim', maxSize: 5, formats: '.jpg, .jpeg, .png' },
    { value: 'zip', label: 'Zip', maxSize: 50, formats: '.zip, .rar' }
  ]

  const handleFileInput = (e) => {
    if (activeTab === 'dosya' && !fileType) {
      setShowError('Dosya türü seçiniz')
      return
    }

    const selectedFiles = Array.from(e.target.files)
    addFiles(selectedFiles)
  }

  const addFiles = (newFiles) => {
    const fileObjects = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      uploadType: 'Dosya',
      fileType: fileTypes.find(ft => ft.value === fileType)?.label || fileType,
      shortName: shortName || file.name.split('.')[0],
      name: file.name,
      size: formatFileSize(file.size),
      file: file
    }))
    setFiles([...files, ...fileObjects])
    resetForm()
  }

  const addUrlFile = () => {
    if (!urlInput.trim()) {
      setShowError('URL girin')
      return
    }

    if (!shortName.trim()) {
      setShowError('Kısa adı girin')
      return
    }

    const urlObject = {
      id: Math.random().toString(36).substr(2, 9),
      uploadType: 'Bağlantı',
      fileType: '-',
      shortName: shortName,
      name: urlInput,
      size: '-'
    }
    setFiles([...files, urlObject])
    resetForm()
  }

  const resetForm = () => {
    setShortName('')
    setUrlInput('')
    setFileType('')
    setShowError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id))
  }

  const handleFileAction = (file) => {
    if (file.uploadType === 'Dosya' && file.file) {
      const url = URL.createObjectURL(file.file)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (file.uploadType === 'Bağlantı') {
      window.open(file.name, '_blank')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleAddClick = () => {
    if (activeTab === 'dosya') {
      if (!fileType) {
        setShowError('Dosya türü seçiniz')
        return
      }
      fileInputRef.current?.click()
    } else {
      addUrlFile()
    }
  }

  return (
    <div className="compact-upload">
      <div className="header-row">
        <h3>Dosya/Bağlantı Ekle</h3>

        <div className="tabs">
          <button
            className={activeTab === 'dosya' ? 'active' : ''}
            onClick={() => {
              setActiveTab('dosya')
              resetForm()
            }}
          >
            Dosya
          </button>
          <button
            className={activeTab === 'baglanti' ? 'active' : ''}
            onClick={() => {
              setActiveTab('baglanti')
              resetForm()
            }}
          >
            Bağlantı
          </button>
        </div>

        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Genişlet' : 'Daralt'}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="inline-form">
            {activeTab === 'dosya' ? (
              <>
                <select
                  value={fileType}
                  onChange={(e) => {
                    setFileType(e.target.value)
                    setShowError('')
                  }}
                  className="compact-select"
                >
                  <option value="">Dosya Türü *</option>
                  {fileTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Kısa Adı"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="compact-input"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="URL *"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value)
                    setShowError('')
                  }}
                  className="compact-input flex-2"
                />

                <input
                  type="text"
                  placeholder="Kısa Adı *"
                  value={shortName}
                  onChange={(e) => {
                    setShortName(e.target.value)
                    setShowError('')
                  }}
                  className="compact-input"
                />
              </>
            )}

            <button className="compact-btn" onClick={handleAddClick}>
              + Ekle
            </button>
          </div>

          {showError && <div className="compact-error">{showError}</div>}

          {activeTab === 'dosya' && fileType && (
            <div className="compact-info">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
              {fileTypes.find(ft => ft.value === fileType)?.formats} - Max {fileTypes.find(ft => ft.value === fileType)?.maxSize}MB
            </div>
          )}

          {files.length > 0 && (
            <div className="files-grid">
              {files.map((file) => (
                <div key={file.id} className="file-row">
                  <span className={`badge ${file.uploadType === 'Dosya' ? 'badge-file' : 'badge-link'}`}>
                    {file.uploadType}
                  </span>
                  <span className="file-type">{file.fileType}</span>
                  <span className="file-short">{file.shortName}</span>
                  <span className="file-name" title={file.name}>{file.name}</span>
                  <span className="file-size">{file.size}</span>
                  <button
                    className="action-btn"
                    onClick={() => handleFileAction(file)}
                    title={file.uploadType === 'Dosya' ? 'İndir' : 'Aç'}
                  >
                    {file.uploadType === 'Dosya' ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </button>
                  <button className="delete-btn" onClick={() => removeFile(file.id)}>×</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UploadDocument

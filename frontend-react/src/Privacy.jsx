import React, { useState, useEffect } from 'react'

const Privacy = () => {

  const [policyText, setPolicyText] = useState('')
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }
  
  const normalizeText = (text) => {
    return text.replace(/\r\n?/g, '\n').trim()
  }

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  const topSentences = (content, phrases, n = 2) => {
    const sentences = content.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean)
    const scored = sentences.map(s => {
      const low = s.toLowerCase()
      let score = 0
      for (const p of phrases) {
        if (low.includes(p)) score += 10
        const stem = p.split(/\s+/)[0]
        if (stem && low.match(new RegExp('\\b' + escapeRegExp(stem), 'i'))) score += 1
      }
      return { s, score }
    }).sort((a, b) => b.score - a.score)
    if (!scored.length || scored[0].score === 0) return ''
    return scored.slice(0, n).map(x => x.s).join(' ')
  }

  const findInSections = (sections, phrases) => {
    for (const s of sections) {
      for (const p of phrases) {
        if ((s.title || '').toLowerCase().includes(p)) {
          const summary = topSentences(s.content, phrases, 2)
          if (summary) return summary
        }
      }
    }
    return null
  }

  const scoredSearch = (text, phrases, maxSentences = 3) => {
    const sentences = text.split(/(?<=[.!?])\s+/)
    const scored = sentences.map(s => {
      const low = s.toLowerCase()
      let score = 0
      for (const p of phrases) {
        if (low.includes(p)) score += 10
        const stem = p.split(/\s+/)[0]
        if (stem && low.match(new RegExp('\\b' + escapeRegExp(stem), 'i'))) score += 1
      }
      return { s: s.trim(), score }
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score)
    return scored.slice(0, maxSentences).map(x => x.s).join(' ')
  }

  const splitByHeadings = (raw) => {
    const lines = raw.split(/\r?\n/)
    const sections = []
    let current = { title: 'intro', content: '' }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const isHeading = (
        /^#{1,6}\s+/.test(line) ||
        (/^[A-Z0-9 \\-]{3,}$/.test(line) && line === line.toUpperCase()) ||
        /:$/.test(line) ||
        (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){0,3}$/.test(line) && line.length < 60 && i + 1 < lines.length && /^[-=]{3,}$/.test(lines[i + 1]))
      )
      if (isHeading) {
        sections.push(current)
        current = { title: line.toLowerCase(), content: '' }
      } else {
        current.content += (current.content ? '\n' : '') + line
      }
    }
    sections.push(current)
    return sections.map(s => ({ title: s.title || 'section', content: s.content || '' }))
  }

  const generateSummary = (text) => {
    const normalized = normalizeText(text)
    const sections = splitByHeadings(text)
    
    const targetSections = {
      thirdParties: ['third party', 'share', 'sell', 'disclose', 'transfer'],
      dataCollection: ['collect', 'gather', 'obtain', 'information we collect'],
      dataUsage: ['use', 'purpose', 'process', 'analytics'],
      userRights: ['right', 'access', 'delete', 'opt-out', 'control'],
      security: ['security', 'protect', 'encrypt', 'safeguard']
    }
    
    const out = {}
    for (const key of Object.keys(targetSections)) {
      const phrases = targetSections[key]
      let best = findInSections(sections, phrases)
      if (!best) best = scoredSearch(normalized, phrases, 3)
      out[key] = best || 'No specific information found.'
    }
    return out
  }

  const riskLevelFromText = (text) => {
    const highTerms = ['share', 'sell', 'transfer', 'third party', 'disclose']
    const lowTerms = ['no', 'none', 'not specified', 'do not']
    const t = (text || '').toLowerCase()
    for (const h of highTerms) if (t.includes(h)) return 'high'
    for (const l of lowTerms) if (t.includes(l)) return 'low'
    return t ? 'medium' : 'low'
  }

  const getRiskColor = (level) => {
    switch(level) {
      case 'high': return '#dc2626'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const handleSummarize = () => {
    if (!policyText.trim()) {
      alert('Please paste a privacy policy or terms of service text.')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      const result = generateSummary(policyText)
      setSummary(result)
      setIsLoading(false)
    }, 100)
  }

  const handleClear = () => {
    setPolicyText('')
    setSummary(null)
  }

  return (
    <>
      <header className="header">
        <div className="container header-flex">
          <div className="logo-section">
            <h1 className="logo">Esafe</h1>
            <p className="tagline">One platform. Total digital defense.</p>
          </div>
          <div className="right-actions">
            <nav className="nav">
              <a href="/privacy" className="nav-link">Privacy</a>
              <a href="/" className="nav-link">About</a>
            </nav>
            <button className="theme-btn" onClick={toggleTheme}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <main>
          <section className="hero">
            <div className="card card--hero">
              <h1>Privacy Policy Summariser</h1>
              <p className="tagline">Understand privacy policies and terms of service at a glance</p>
            </div>
          </section>

          <div className="grid">
            <div>
              <div className="card">
                <div className="input-section">
                  <textarea
                    placeholder="Paste privacy policy or terms of service here..."
                    rows="8"
                    value={policyText}
                    onChange={(e) => setPolicyText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                  
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button 
                      onClick={handleSummarize}
                      disabled={isLoading}
                      style={{
                        padding: '10px 24px',
                        background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        opacity: isLoading ? 0.6 : 1
                      }}
                    >
                      {isLoading ? 'Summarizing...' : 'Summarize'}
                    </button>
                    <button 
                      onClick={handleClear}
                      style={{
                        padding: '10px 24px',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {summary && (
                  <div style={{ marginTop: '32px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Summary Report</h2>
                    
                    <div style={{ 
                      background: theme === 'light' ? '#f0f9ff' : '#1e293b',
                      padding: '16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      borderLeft: `4px solid ${getRiskColor(riskLevelFromText(summary.dataCollection))}`
                    }}>
                      <h3 style={{ marginBottom: '8px' }}>📊 Data Collection</h3>
                      <p style={{ lineHeight: '1.6', marginBottom: '12px' }}>{summary.dataCollection}</p>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: getRiskColor(riskLevelFromText(summary.dataCollection)),
                        color: 'white'
                      }}>
                        Risk: {riskLevelFromText(summary.dataCollection).toUpperCase()}
                      </span>
                    </div>

                    <div style={{ 
                      background: theme === 'light' ? '#f0f9ff' : '#1e293b',
                      padding: '16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      borderLeft: `4px solid ${getRiskColor(riskLevelFromText(summary.dataUsage))}`
                    }}>
                      <h3 style={{ marginBottom: '8px' }}>🎯 Data Usage</h3>
                      <p style={{ lineHeight: '1.6', marginBottom: '12px' }}>{summary.dataUsage}</p>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: getRiskColor(riskLevelFromText(summary.dataUsage)),
                        color: 'white'
                      }}>
                        Risk: {riskLevelFromText(summary.dataUsage).toUpperCase()}
                      </span>
                    </div>

                    <div style={{ 
                      background: theme === 'light' ? '#f0f9ff' : '#1e293b',
                      padding: '16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      borderLeft: `4px solid ${getRiskColor(riskLevelFromText(summary.thirdParties))}`
                    }}>
                      <h3 style={{ marginBottom: '8px' }}>🤝 Third Parties</h3>
                      <p style={{ lineHeight: '1.6', marginBottom: '12px' }}>{summary.thirdParties}</p>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: getRiskColor(riskLevelFromText(summary.thirdParties)),
                        color: 'white'
                      }}>
                        Risk: {riskLevelFromText(summary.thirdParties).toUpperCase()}
                      </span>
                    </div>

                    <div style={{ 
                      background: theme === 'light' ? '#f0f9ff' : '#1e293b',
                      padding: '16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      borderLeft: '4px solid #10b981'
                    }}>
                      <h3 style={{ marginBottom: '8px' }}>👤 Your Rights</h3>
                      <p style={{ lineHeight: '1.6', marginBottom: '12px' }}>{summary.userRights}</p>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: '#10b981',
                        color: 'white'
                      }}>
                        User Control Available
                      </span>
                    </div>

                    <div style={{ 
                      background: theme === 'light' ? '#f0f9ff' : '#1e293b',
                      padding: '16px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      borderLeft: `4px solid ${getRiskColor(riskLevelFromText(summary.security))}`
                    }}>
                      <h3 style={{ marginBottom: '8px' }}>🛡️ Security Measures</h3>
                      <p style={{ lineHeight: '1.6', marginBottom: '12px' }}>{summary.security}</p>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: getRiskColor(riskLevelFromText(summary.security)),
                        color: 'white'
                      }}>
                        Risk: {riskLevelFromText(summary.security).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="footer">
        <div className="container">
          <p>2026 Esafe. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default Privacy
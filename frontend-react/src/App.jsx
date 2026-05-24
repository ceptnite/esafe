import React, { useState, useEffect } from 'react'
import About from './About'
import Privacy from './Privacy'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<About theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/privacy" element={<Privacy theme={theme} toggleTheme={toggleTheme} />} />
      </Routes>
    </Router>
  )
}

export default App
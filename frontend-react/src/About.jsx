import React, { useState, useEffect } from 'react'
import ContactForm from './components/Contact/contactform'

const About = ({ theme, toggleTheme }) => {
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
            <button id="theme-toggle" className="theme-btn" onClick={toggleTheme}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <section className="card card--hero">
          <h1>About Esafe</h1>
          <p>Esafe is a digital security platform that aims to encourage password safety and usability.</p>
        </section>

        <div className="grid">
          <div>
            <section className="card">
              <h2>Our Mission</h2>
              <p>To empower users and organizations to protect their digital identities through solutions that promotes internet safety and usability.</p>

              <h3>Core Values</h3>
              <div className="values">
                <div className="value"><strong>Trust & Integrity</strong> — We never store, transmit, or save your personal data.</div>
               
                <div className="value"><strong>User Safety First</strong> — Every design decision prioritises your digital safety.</div>
                
                <div className="value"><strong>Accessible Security</strong> — We break down complex security concepts into simple, actionable steps for everyone.</div>
              </div>
            </section>

            <section className="card">
              <h2>Team</h2>
              <div className="team">
                <div className="member">
                  <div className="meta">
                    <div>Ryan Okoji</div>
                    <small>About Us & Privacy Policy Summariser</small>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="card">
            <h2>Contact Us</h2>
            <div className="contact">
              <ContactForm />
            </div>
          </aside>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <p>2026 Esafe. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default About
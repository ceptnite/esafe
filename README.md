# 🔐 Esafe - Digital Security Platform

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://esafe1487.vercel.app)
[![Java](https://img.shields.io/badge/Java-21-red)](https://java.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.14-brightgreen)](https://spring.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://postgresql.org)

## 📌 Overview

Esafe is a full-stack digital security platform built as a solution to **UN Sustainable Development Goal 16: Peace, Justice and Strong Institutions** - ensuring public access to information and protecting fundamental freedoms.

---

## 🎯 UN SDG 16: Peace, Justice and Strong Institutions

This project addresses **Target 16.10** – *Ensure public access to information and protect fundamental freedoms.*

| SDG Target | How Esafe Addresses It |
|------------|------------------------|
| **16.10** – Public access to information | Privacy Policy Summariser helps users understand complex legal documents |
| **16.6** – Transparent institutions | Esafe never stores passwords; all processing is client-side |

---

## ✨ Features

### 📋 Privacy Policy Summariser
- Paste any privacy policy or terms of service
- Extracts key information about data collection, third-party sharing, user rights, and security measures
- Risk level indicators (High/Medium/Low)

### 📧 Contact Form
- Full CRUD operations (GET, POST, PUT, DELETE)
- PostgreSQL cloud database storage
- Async email confirmation via Gmail SMTP (works locally but Render's free tier blocks outbound SMTP requests)
- Input validation with error handling

### 🌓 Dark/Light Mode
- Theme toggle with localStorage persistence
- Accessible color contrast

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router** | Page navigation |
| **CSS3** | Styling with dark mode support |

### Backend
| Technology | Purpose |
|------------|---------|
| **Java 21** | Programming language |
| **Spring Boot 3.5.14** | Application framework |
| **PostgreSQL** | Production database |
| **JPA/Hibernate** | Object-relational mapping |
| **JavaMailSender** | Email confirmation service |

### Deployment
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting + PostgreSQL |

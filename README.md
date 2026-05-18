## Esafe

This is a website built with my university startup group named Esafe as a solution to the UN Sustainable Development Goal 16: Peace, Justice, and Strong Institutions ensuring public access to information and protecting fundamental freedoms.

Contains a full stack contact form system built with Spring Boot, utilises a H2 database, and JavaScript.

## UN SDG 16: Peace, Justice and Strong Institutions

This project addresses **Target 16.10** – *Ensure public access to information and protect fundamental freedoms.*

| SDG Target | How Esafe Addresses It |
|------------|------------------------|
| **16.10** – Public access to information | Privacy Policy Summariser helps users understand complex legal documents |
| **16.6** – Transparent institutions | Esafe never stores passwords; all privacy policy processing is client-side |

## My Individual Contributions

| Component | Description | Technologies |
|-----------|-------------|--------------|
| **REST API** | Full CRUD operations (GET, POST, PUT, DELETE) | Java 21, Spring Boot |
| **H2 Database** | Persistent storage with auto-generated IDs/timestamps | JPA, Hibernate, SQL |
| **Async Email** | Non-blocking confirmation emails | Spring Mail, @Async |
| **About Us Page** | Team information, mission, values, contact form | HTML, CSS, JavaScript |
| **Privacy Summariser** | Client-side text analysis for risk detection | JavaScript, Regex (Regular Expressions) |
| **Dark Mode** | Theme toggle with localStorage persistence | JavaScript, CSS variables |

## Technologies Used

| Layer | Technologies |
|-------|--------------|
| Backend | Java 21, Spring Boot 3.5.14, Spring Boot, Lacks a configured email server but would utilise Mailhog |
| Database | H2 (file-based, web console at `/h2-console`) |
| Frontend | HTML5, CSS, JavaScript (no frameworks) |
| Testing | Thunder Client, H2 Console, cURL |
| Build | Maven |

<div align="center">

# 🌐 Omkar Mote — Personal Developer Portfolio

**A modern, responsive personal developer landing page built with Flask and deployed on Vercel.**

[![Live Demo](https://img.shields.io/badge/Live_Site-Vercel-0A66C2?style=for-the-badge&logo=vercel&logoColor=white)](https://omkar-portfolio-live.vercel.app)
[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<p align="center">
  <a href="https://omkar-portfolio-live.vercel.app">⚡ View Live Website</a> •
  <a href="#-features">✨ Features</a> •
  <a href="#-quickstart">🚀 Quickstart</a> •
  <a href="#-architecture">🏗️ Architecture</a> •
  <a href="#-contact">🤝 Contact</a>
</p>

</div>

---

## ✨ Features

- 🎨 **Modern Dark Aesthetics**: Smooth theme transitions, glassmorphic navigation, and responsive typography.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile viewing experiences.
- 🚀 **Serverless Vercel Deployment**: Configured via `vercel.json` and WSGI routing for low-latency global delivery.
- 📊 **Project Showcase**: Highlights flagship projects in Machine Learning, Computer Vision, and Software Engineering.
- 📬 **Interactive Contact Routing**: Backend contact endpoint for direct messaging and inquiries.

---

## 🛠️ Tech Stack

- **Backend**: Python, Flask, WSGI
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), FontAwesome / Feather Icons
- **Deployment**: Vercel Serverless Functions (`vercel.json`)
- **Version Control**: Git, GitHub

---

## 🚀 Quickstart & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/omkar333333/omkar-portfolio-live.git
cd omkar-portfolio-live
```

### 2. Create and Activate Virtual Environment
```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Locally
```bash
python App.py
```
Open your browser and navigate to `http://localhost:5000`.

---

## 🏗️ Architecture

```text
omkar-portfolio-live/
├── App.py               # Flask application & routing
├── Procfile             # Heroku / PaaS web process declaration
├── vercel.json          # Serverless route mapping for Vercel
├── requirements.txt     # Python runtime dependencies
├── static/              # CSS stylesheets, JS scripts & assets
└── templates/           # Jinja2 HTML templates
```

---

## 👨‍💻 Author

**Omkar Mote**  
- 🎓 *B.E. in Artificial Intelligence & Data Science*  
- 🌐 [Live Portfolio](https://omkar-portfolio-live.vercel.app)  
- 💻 [GitHub Profile](https://github.com/omkar333333)

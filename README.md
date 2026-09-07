# 🔗 URL Shortener

A full-stack URL Shortener application that converts long URLs into short, shareable links.

The application provides URL shortening, redirection, click tracking, URL history, and copy-to-clipboard functionality.

## 🚀 Live Demo

- **Frontend:** https://url-shortener-fawn-six.vercel.app
- **Backend API:** https://url-shortener-zi5d.onrender.com

---

## ✨ Features

- 🔗 Convert long URLs into short URLs
- 🚀 Redirect users from short URLs to the original URL
- 📊 Track the number of clicks for each shortened URL
- 📋 Copy shortened URLs to clipboard
- 🕒 View URL creation history
- 🔍 Validate URLs before shortening
- ♻️ Prevent duplicate entries for the same original URL
- 📱 Responsive and modern UI
- ☁️ Deployed frontend and backend
- 🗄️ Persistent data storage using MongoDB Atlas

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Axios
- CSS3

### Backend

- Node.js
- Express.js
- REST API
- Nanoid

### Database

- MongoDB
- Mongoose
- MongoDB Atlas

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## 📁 Project Structure

```text
url-shortener/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   └── urlController.js
│   │
│   ├── models/
│   │   └── Url.js
│   │
│   ├── routes/
│   │   └── urlRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── README.md
```

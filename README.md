# 🕵️‍♂️ Anonymous Chat App (IncogChat)

An **anonymous chat backend application** built with **Node.js, Express, and MongoDB (Mongoose)**.
It enables users to communicate securely while maintaining anonymity.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User signup & login (email/password)
* Google OAuth 2.0 login
* JWT-based authentication
* Role-based authorization

### 🔒 Security

* Two-Factor Authentication (2FA) via OTP
* Password reset via email
* Token blacklisting (Redis)
* Rate limiting
* Helmet for secure HTTP headers
* CORS support

### 💬 Chat System

* Anonymous messaging between users
* Logged-in user messaging
* Private chat between authenticated users

### 🧠 Data & Storage

* MongoDB with Mongoose ODM
* Redis for caching, OTP storage, and sessions
* Cloudinary for file uploads (profile & cover images)

### 📧 Email Services

* OTP verification emails
* Password reset emails
* General notifications using Nodemailer

### ⚙️ Backend Architecture

* RESTful API structure
* Modular routing system
* Middleware-based architecture
* Centralized error handling & logging
* Input validation using Joi

### 🧰 Utilities

* Encryption & decryption helpers
* UUID generation
* OTP generation
* Token utilities

### 👤 User Features

* Profile & cover picture upload

---

## 🏗️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Cache & Sessions:** Redis
* **File Storage:** Cloudinary
* **Authentication:** JWT, OAuth 2.0
* **Email Service:** Nodemailer
* **Validation:** Joi

---

## 📁 Project Structure (Simplified)

```
src/
│
├── modules/        # Feature-based modules (auth, user, chat)
├── middlewares/    # Auth, validation, error handling
├── utils/          # Helper functions (encryption, tokens, OTP)
├── config/         # DB, Redis, Cloudinary configs
├── services/       # Business logic
├── routes/         # API routes
└── index.js          # Entry point
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```
APPLICATION_NAME = "IncogChat"

URI = your_mongodb_uri
REDIS_URL = your_redis_url

SALT_ROUNDS = 
ENCRPT_KEY = 
JWT_SECRET_ACCESS = your_jwt_secret
JWT_SECRET_REFRESH = your_jwt_secret

CLOUDINARY_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret

GOOGLE_CLIENT_ID = your_google_client_id
EMAIL_USER = your_email
EMAIL_PASS = your_email_password

```

---

## ▶️ Installation & Running

### 1. Clone the repo

```
git clone https://github.com/Mahmoudsilem/IncogChat
cd incogchat
```

### 2. Install dependencies

```
npm install
```

### 3. Run the app

```
npm run start:dev
```

---

## 📌 API Overview

### Auth Routes

* `POST /auth/signup`
* `POST /auth/login`
* `POST /auth/google`
* `POST /auth/logout`

### User Routes

* `GET /users/profile`
* `PATCH /users/update`
* `DELETE /users/soft-delete`

### Chat Routes

* `POST /messages/send`
* `GET /messages/:userId`

---

## 🧪 Future Improvements

* Soft delete for users
* Real-time chat using WebSockets (Socket.io)
* End-to-end encryption for messages
* Group anonymous chats
* Message reactions & media support
* Admin dashboard

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---


# 💬 ChatRoom – Full Stack Real-Time Chat Application

A full-stack real-time chat application built using the **MERN stack + Socket.io**, supporting messaging, emojis, image sharing, and live polls.

---

## 🚀 Features

* 🔐 **Authentication**

  * Register & Login (JWT-based authentication)
  * Secure routes with middleware

* 💬 **Real-Time Chat**

  * Instant messaging using Socket.io
  * Multiple users in a room
  * Live updates without refresh

* 😀 **Emoji Support**

  * Emoji picker integration
  * Multiple emoji selection

* 🖼️ **Image Sharing**

  * Upload and send images in chat
  * Stored on server

* 📊 **Live Poll System**

  * Create polls inside chat
  * Real-time voting updates
  * One vote per user

* 👑 **Room Management**

  * Room creator can **close room**
  * Users can **leave room**
  * Active users list (sidebar)

* 📱 **Responsive UI**

  * Works on mobile, tablet, desktop
  * Hamburger sidebar for small screens
  * Bottom-sheet modals for mobile

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* CSS (custom responsive design)
* Axios
* Socket.io-client
* Emoji Picker

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Socket.io
* Multer (image uploads)
* JWT Authentication

---

## 📂 Project Structure

```
chatRoom/
│
├── client/        # Frontend (React)
│
├── server/        # Backend (Node + Express)
│
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/YOUR_USERNAME/chatRoom.git
cd chatRoom
```

---

### 2️⃣ Setup Backend

```
cd server
npm install
```

Create a `.env` file inside `/server`:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Setup Frontend

```
cd client
npm install
npm run dev
```

---

## 🌐 Environment Variables

### Backend (`/server/.env`)

* `PORT`
* `MONGO_URI`
* `JWT_SECRET`

---

## 🧠 Key Concepts Used

* Real-time communication using **WebSockets (Socket.io)**
* REST API design with **Express**
* Authentication using **JWT**
* File uploads using **Multer**
* State management using **React Context API**
* Responsive UI with modern CSS

---

## 📸 Screenshots (Add Later)

* Chat Room UI
* Poll Creation
* Mobile View
* Sidebar

---

## 🚀 Future Improvements

* ✅ Typing indicators
* ✅ Online/offline status
* ✅ Message read receipts
* 🔄 File sharing (PDF, docs)
* 🔄 Notifications system

---

## 👨‍💻 Author

**Abhinav Chaudhary**

* 💼 Full Stack Developer (MERN + AI/ML)
* 📸 Instagram: Masala_bytes

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share feedback!

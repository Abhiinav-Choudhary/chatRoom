# 📱 Student Lead Management App (Mini CRM)

## 📌 Assignment Overview

The **Student Lead Management App** is a React Native based mini CRM application that allows users to manage student leads.  
The app provides basic **CRUD (Create, Read, Update, Delete)** functionality with smooth navigation and local data persistence.

This project is built using **functional components**, **React Hooks**, and **React Navigation**, following modern React Native development practices.

---

## 🚀 Features

- ➕ Add new student leads using a form  
- 📋 View list of all leads  
- 🔍 View detailed information of a lead  
- 🗑️ Delete a lead with confirmation  
- 🧭 Navigation between multiple screens  
- 📦 Local data persistence using AsyncStorage  

---

## 🧱 App Screens

### 1️⃣ Lead List Screen
- Displays all student leads using `FlatList`
- Button to add a new lead
- Clickable leads to view detailed information

### 2️⃣ Add Lead Screen
- Form with input validation
- Fields: Name, Email, Course, Phone
- Prevents invalid submissions

### 3️⃣ Lead Detail Screen
- Shows complete lead details
- Option to delete lead with confirmation

---

## 🛠️ Tech Stack

- React Native  
- Expo (Classic)  
- React Navigation (Stack Navigation)  
- AsyncStorage  
- JavaScript (ES6+)  

---

## 🧠 Concepts Used

- Functional Components  
- React Hooks (`useState`, `useEffect`)  
- FlatList for optimized list rendering  
- Navigation using React Navigation  
- Form validation  
- Local state management  
- Persistent storage using AsyncStorage  

---

## 📂 Project Structure

student-lead-crm/
├── App.js
├── README.md
├── src/
│ ├── screens/
│ │ ├── LeadListScreen.js
│ │ ├── AddLeadScreen.js
│ │ └── LeadDetailScreen.js
│ │
│ ├── navigation/
│ │ └── AppNavigator.js
│ │
│ └── components/
│
├── assets/
└── package.json

---

## ▶️ How to Run the App

### 1️⃣ Install dependencies
```bash
npm install

## 2️⃣ Start Expo development server
npx expo start

## 3️⃣ Run on device

---

Install Expo Go app on your mobile phone

Scan the QR code from terminal or browser

---

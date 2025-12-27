📱 Student Lead Management App (Mini CRM)
📌 Assignment Overview

The Student Lead Management App is a React Native based mini CRM application that allows users to manage student leads.
The app provides basic CRUD functionality with smooth navigation and local data persistence.

This project is built using functional components, React Hooks, and React Navigation, following modern React Native practices.

🚀 Features

➕ Add new student leads using a form

📋 View list of all leads

🔍 View detailed information of a lead

🗑️ Delete a lead with confirmation

🧭 Navigation between multiple screens

📦 Local data persistence using AsyncStorage


🧱 App Screens

Lead List Screen

Displays all student leads using FlatList

Button to add a new lead

Clickable leads to view details

Add Lead Screen

Form with input validation

Fields: Name, Email, Course, Phone

Prevents invalid submissions

Lead Detail Screen

Shows complete lead details

Option to delete lead

🛠️ Tech Stack

React Native

Expo (Classic)

React Navigation (Stack Navigation)

AsyncStorage

JavaScript (ES6+)

🧠 Concepts Used

Functional Components

React Hooks (useState, useEffect)

FlatList for optimized list rendering

Navigation using React Navigation

Form validation

Local state management

Persistent storage with AsyncStorage

📂 Project Structure
student-lead-crm/
│
├── App.js
├── src/
│   ├── screens/
│   │   ├── LeadListScreen.js
│   │   ├── AddLeadScreen.js
│   │   └── LeadDetailScreen.js
│   │
│   ├── navigation/
│   │   └── AppNavigator.js
│   │
│   └── components/
│
├── assets/
└── package.json

▶️ How to Run the App
1️⃣ Install dependencies
npm install

2️⃣ Start Expo server
npx expo start

3️⃣ Run on device

Install Expo Go app on your mobile phone

Scan the QR code from terminal or browser

💾 Data Persistence

The app uses AsyncStorage to store leads locally on the device.
This ensures that:

Leads are not lost when the app restarts

The app works offline without a backend

🎓 Assignment Requirements Fulfilled
Requirement	Status
Add student leads	✅
Display leads list	✅
View lead details	✅
Delete lead	✅
React Navigation	✅
FlatList	✅
Functional components	✅
React Hooks	✅
Form validation	✅
Local state	✅
AsyncStorage (Bonus)	⭐
📌 Notes

UI is intentionally kept simple to focus on functionality and logic

The app is designed for academic demonstration and learning purposes

Web and mobile storage are separate due to platform differences

🏁 Conclusion

This project successfully demonstrates a Mini CRM system using React Native with proper navigation, validation, and persistent storage.
It fulfills all assignment requirements and follows clean coding practices.

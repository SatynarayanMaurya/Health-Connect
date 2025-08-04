# 🩺 HealthConnect – Full-Stack Telemedicine Platform

**HealthConnect** is a full-featured telemedicine platform designed to simulate real-world scenarios where **pharmacy devices** connect patients with **available doctors** in real time. It includes powerful tools for **Admins**, **Doctors**, and **Pharmacy Devices** to streamline remote consultations, manage availability, and ensure smooth communication.

---

## 🔐 Admin Features

Admins have access to a powerful dashboard to oversee platform operations:

- ✅ **Monitor Real-Time Doctor Availability**
  - View doctors currently online with status: `Available`, `Busy`, or `Offline`.
  - Monitor their last activity timestamps.

- 🧠 **Track Active Sessions**
  - Live tracking of chat sessions between pharmacy devices and doctors.
  - View session duration and message flow in real time.

- 📍 **Manage Connected Pharmacy Devices**
  - View all registered pharmacy devices.
  - Monitor real-time device activity and geolocation.

- 🗃️ **User Account Management**
  - Approve, suspend, or remove doctor and pharmacy accounts.
  - View registration details and manage credentials.

- 📊 **Dashboard Analytics**
  - Key metrics like total active users, session frequency, doctor availability trends, and most active devices.

---

## 🩺 Doctor Features

Doctors are essential users who can manage their availability and connect with patients via chat:

- ✍️ **Register & Manage Profile**
  - Secure account creation.
  - Edit name, specialization, contact info, etc.

- 🟢 **Set Availability Status**
  - Toggle between `Available`, `Busy`, or `Offline`.
  - Devices can only contact doctors marked as `Available`.

- 💬 **Real-Time Chat with Pharmacy Devices**
  - Chat with patients through connected pharmacy systems.
  - Multiple conversations can be handled efficiently.

- 🕓 **Session Logs**
  - Access history of all consultations.
  - View chat transcripts, timestamps, and device info.

---

## 🏪 Pharmacy Device Features

Pharmacy devices act as entry points for patients to initiate remote consultations:

- 🖥️ **Device Registration**
  - Register securely using a unique Device ID.
  - Pharmacy info linked to each device.

- 🔍 **View Available Doctors**
  - Instantly fetch a list of doctors who are currently `Available`.

- 📲 **Start Real-Time Chat**
  - Initiate chat with selected doctors.
  - Designed for low-latency, high-reliability communication.

- 📜 **Chat History**
  - Maintain recent session history for continuity.
  - Access previous consultations made through the device.

---

> 💡 This platform enables a seamless healthcare communication bridge between **pharmacies** and **doctors**, while giving **admins** full visibility and control over the ecosystem.

---


---

## 🚀 Tech Stack

### 🔧 Backend
- Node.js + Express.js
- MongoDB with Mongoose ORM
- Socket.IO for real-time communication
- JWT-based Authentication

### 🎨 Frontend
- React.js with Tailwind CSS
- Axios for API requests
- Socket.IO-client for real-time UI updates

---

## 🌐 Features Overview

### ✅ Core Functionalities

#### Backend APIs
- **Pharmacy Device Registration**  
  Register a device with GPS coordinates and a unique ID.

- **Doctor Authentication**  
  Login/Logout APIs with the ability to toggle availability.

- **Session Management**  
  Devices can initiate a session with available doctors based on a matching algorithm.

#### Admin Dashboard (Frontend)
- 🔵 Live status of online doctors
- 📍 Mocked device activity map
- 🧑‍⚕️ Active doctor-patient sessions
- ⚙️ Device registration and doctor onboarding

### ✨ Bonus Features
- Real-time doctor status updates using WebSocket (Socket.IO)
- Persistent chat messaging between doctor and device
- Basic logging of device connections and session events

---

## 🔐 Authentication & Authorization

- Protected routes secured using **JWT**
- Role-based access controls for `doctor`, `device`, and `admin`

---

## 📁 Project Structure
```text
HEALTHCONNECT PRO/
├── backend/
│   ├── Config/              # DB connection and environment setup
│   ├── Controllers/         # Request handlers for each route
│   ├── Middlewares/         # Authentication and other middleware
│   ├── Models/              # Mongoose schema definitions
│   ├── Routes/               # Helper functions (if any)
│   ├── index.js            # Entry point for backend
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── Components/      # Reusable UI components
│   │   ├── Pages/           # Page-level components
│   │   ├── Redux/           # Redux slices and store setup
│   │   ├── Services/        # API service calls (e.g., axios)
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # React entry point
│   └── .env                 # Frontend environment variables
│
├── README.md                # Project documentation
└── package.json             # Project dependencies and scripts
```
---

## 🛠️ Installation and Setup Instructions

### 📦 Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file and add:
   ```bash
    PORT=4000
    MONGODB_URI=your_mongo_uri
    JWT_SECRET=your_secret_key
   NODE_ENV = "development"
   ```
4. Start the server:
   ```bash
    npm run dev
   ```


### 💻 Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
    npm run dev
   ```

## 📡 API Endpoints

All secure routes require a valid JWT token in the cookies as:


---

### 🔐 Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/signup` | Register a new user (doctor/device/admin) |
| POST   | `/api/login` | Authenticate user and return JWT token |
| POST   | `/api/logout` | Logout current user (clears cookie or token) |
| GET    | `/api/get-user-details` | Get authenticated user details |

---

### 🧑‍⚕️ Doctor Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/get-all-doctors` | Get list of all doctors |
| PUT    | `/api/update-doctor-availability` | Update doctor’s availability status |
| GET    | `/api/get-doctor-chats/:deviceId` | Get all chat messages between doctor and specific device |

---

### 💊 Device Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/get-all-devices` | Get list of all registered pharmacy devices |

---

### 💬 Chat Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/:userId/:peerId` | Fetch chat messages between a user and their peer (doctor or device) |

---

> 🛑 **Note:** All endpoints that modify or view sensitive data are protected and require authentication.

## 📊 Database Schema

Below are the core Mongoose models used in the HealthConnect platform:

---

### 👤 Admin

```js
{
  _id: ObjectId,
  name: String,              // Admin full name
  email: String,             // Unique email address
  role: "admin",             // Default: "admin"
  password: String,          // Hashed password
  createdAt: Date            // Auto-generated on registration
}
```


### 🧑‍⚕️ Doctor

```js
{
  _id: ObjectId,
  name: String,              // Doctor's full name
  email: String,             // Unique email address
  password: String,          // Hashed password
  role: "doctor",            // Default: "doctor"
  specialization: String,    // e.g. "Cardiologist", Default: "General"
  isAvailable: Boolean,      // Indicates availability status
  lastLogin: Date,           // Timestamp of last login
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-updated on each save
}

```


### 💊 Pharmacy Device

```js
{
  _id: ObjectId,
  deviceId: String,          // Unique ID of the pharmacy device
  password: String,          // Hashed password
  latitude: Number,          // GPS Latitude
  longitude: Number,         // GPS Longitude
  role: "device",            // Default: "device"
  registeredAt: Date,        // When device was registered
  lastActive: Date           // Last active timestamp
}
```


### 💬 Message

```js
{
  _id: ObjectId,
  sender: String,            // Sender ID (doctorId or deviceId)
  receiver: String,          // Receiver ID (doctorId or deviceId)
  message: String,           // Chat message content
  timestamp: Date            // Time message was sent
}
```

## 🌍 Deployment

### 🔗 Live URL:
- Frontend: [https://healthconnect-frontend.vercel.app](https://...)
- Backend API: [https://healthconnect-api.onrender.com](https://...)

### 📝 Notes:
- CORS should be configured correctly.
- `.env` files are required for deployment (add secrets to your host).


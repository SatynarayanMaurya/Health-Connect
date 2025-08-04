import { Route, Routes } from "react-router-dom"
import LoginPage from "./Pages/Authentication/LoginPage"
import SignupPage from "./Pages/Authentication/SignupPage"
import AdminDashboard from "./Pages/Dashboard/AdminDashboard"
import Dashboard from "./Pages/Dashboard/Dashboard"
import PrivateRoute from "./Components/PrivateRoute"
import ChatPage from "./Pages/ChatPage/ChatPage"
import DoctorChatPage from "./Pages/Dashboard/Doctor Dashboard/DoctorChatPage"

function App() {

  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />

        <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute> } />

        <Route path="/chat/:deviceId/:doctorId" element={<PrivateRoute><ChatPage/></PrivateRoute>} />
        <Route path="/chat-with-pharmacy-device/:deviceId" element={<PrivateRoute><DoctorChatPage/></PrivateRoute>} />

      </Routes>
    </div>
  )
}

export default App

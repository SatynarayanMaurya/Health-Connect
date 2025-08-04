import React, { useState } from "react";
import { motion } from "framer-motion";
import { VscEyeClosed } from "react-icons/vsc";
import { VscEye } from "react-icons/vsc";
import Spinner from "../../Components/Spinner";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setLoading, setUserDetails } from "../../Redux/Slices/userSlice";
import { apiConnector } from "../../Services/apiConnector";
import { authEndpoints } from "../../Services/apis";

const LoginPage = () => {

    const dispatch = useDispatch()
    const [email,setEmail] = useState("")
    const [password, setPassword] = useState("")
    const loading = useSelector((state)=>state.user.loading)
    const [eyeOpen ,setEyeOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState("doctor");
    const navigate = useNavigate()

    const handleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const [formData, setFormData] = useState({
        deviceId: '',
        latitude: '',
        longitude: '',
    });

    useEffect(() => {
        if(selectedRole === "device"){
            if ('geolocation' in navigator) {
            navigator?.geolocation?.getCurrentPosition(
                (position) => {
                setFormData((prev) => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }));
                },
                (error) => {
                console.error('Geolocation error:', error);
                setMessage('Failed to get location. Please allow location access.');
                }
            );
            } else {
            setMessage('Geolocation is not supported by your browser.');
            }
        }
    }, [selectedRole]);


    const loginHandler = async(e)=>{
        try{
            e.preventDefault()
            const data = selectedRole === "device"?{deviceId:formData?.deviceId,latitude:formData?.latitude,longitude:formData?.longitude,password}:{email,password}
            const showError = (message) => toast.error(message);

            if (selectedRole === "admin" || selectedRole === "doctor") {
            if (!data?.email) return showError("Email is required!");
            if (!data?.password) return showError("Password is required!");
            } else if (selectedRole === "device") {
            if (!data?.deviceId) return showError("Device ID is required!");
            if (!data?.latitude || !data?.longitude)
                return showError("Location access is required for device login.");
            }
            data.selectedRole =selectedRole;
            dispatch(setLoading(true))
            const result = await apiConnector("POST",authEndpoints.LOGIN,data)
            toast.success(result?.data?.message || "Login Successful")
            dispatch(setLoading(false))
            localStorage.setItem("token",result?.data?.token)
            dispatch(setUserDetails(result?.data?.userDetails))
            navigate("/")
            
        }
        catch(error){
            dispatch(setLoading(false))
            console.log("Error in login the user : ",error)
            toast.error(error?.response?.data?.message || "Error while Login !")
        }
    }


  return (
    <div className="w-11/12 mx-auto min-h-screen flex flex-col justify-center md:flex-row">
        {loading && <Spinner/>}

      {/* Left - Image */}
      <div className="md:w-1/2 w-full flex items-center justify-center h-64 md:h-auto ">
        <img
          src={"https://testsigma.com/blog/wp-content/uploads/37c08d79-0e87-45ce-b1ed-c9bde83c16e7.png"}
          alt="Login Visual"
          className="w-[90%] h-fit object-cover"
        />
      </div>

      {/* Right - Login Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center  pr-6 py-12 ">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
             Login
          </h2>
          <form onSubmit={loginHandler} className="space-y-4">

                
            <div className="flex gap-4 items-center">

                <label className="block mb-2">
                        <input
                        type="radio"
                        value="admin"
                        checked={selectedRole === "admin"}
                        onChange={handleChange}
                        className="mr-2"
                        name="loginRole"
                        />
                        Admin
                </label>

                <label className="block mb-2">
                        <input
                        type="radio"
                        value="doctor"
                        checked={selectedRole === "doctor"}
                        onChange={handleChange}
                        className="mr-2"
                        name="loginRole"
                        />
                        Doctor
                </label>

                <label className="block mb-2">
                        <input
                        type="radio"
                        value="device"
                        checked={selectedRole === "device"}
                        onChange={handleChange}
                        className="mr-2"
                        name="loginRole"
                        />
                        Device
                </label>

            </div>

            {
                (selectedRole === "admin" || selectedRole === "doctor") && 
                <div className="space-y-4">

                <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1 -mt-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="john@gmail.com"
                />
                </div>

                <div className="relative">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                    Password
                </label>
                <input
                    type={eyeOpen?"text":"password"}
                    id="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="••••••••"
                />
                <p onClick={()=>setEyeOpen(!eyeOpen)} className="absolute right-4 top-10 text-xl cursor-pointer">{!eyeOpen?<VscEye/>:<VscEyeClosed/>}</p>
                </div>

                </div>
            }

            {
                selectedRole === "device" && 
                <div className="space-y-4">

                    <div>
                        <label htmlFor="device" className="block text-gray-700 font-medium mb-1 -mt-2">
                            Device Id
                        </label>
                        <input
                            type="text"
                            id="device"
                            value={formData?.deviceId}
                            onChange={(e)=>setFormData({...formData,deviceId:e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="DEV-IND-00123"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                            Password
                        </label>
                        <input
                            type={eyeOpen?"text":"password"}
                            id="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="••••••••"
                        />
                        <p onClick={()=>setEyeOpen(!eyeOpen)} className="absolute right-4 top-10 text-xl cursor-pointer">{!eyeOpen?<VscEye/>:<VscEyeClosed/>}</p>
                    </div>

                </div>
            }

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-xl shadow hover:bg-indigo-700 transition-all"
              type="submit"
            >
              Login
            </motion.button>
          </form>

          <button onClick={()=>navigate("/signup")} className="mt-4 text-center text-blue-600 cursor-pointer hover:text-blue-700 transition-all duration-200">Create Account</button>

          <p className="text-center text-sm text-gray-500 mt-6">
            &copy; {new Date().getFullYear()} MERN Dashboard. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
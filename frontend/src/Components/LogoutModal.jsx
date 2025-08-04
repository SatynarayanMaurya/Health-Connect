import React from 'react'
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { clearAllDoctors, clearUserDetails, setLoading } from '../Redux/Slices/userSlice';
import { apiConnector } from '../Services/apiConnector';
import { authEndpoints, doctorEndpoints } from '../Services/apis';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';
function LogoutModal({closeModal}) {
    
    const dispatch = useDispatch();
    const loading = useSelector((state)=>state.user.loading)
    const navigate = useNavigate()
    const userDetails = useSelector((state)=>state.user.userDetails)
  const toggleAvailability = async () => {
    try {
      dispatch(setLoading(true));
      await apiConnector(
        "PUT",
        doctorEndpoints.UPDATE_DOCTOR_AVAILABILITY,
        { available: userDetails?.isAvailable }
      );
    } catch (error) {
      console.log("Error in updating the doctor availability : ", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

    const logoutHandler = async()=>{
        try{
            dispatch(setLoading(true))
            if(userDetails?.role === "doctor"){
                toggleAvailability();
            }
            const result = await apiConnector("POST",authEndpoints.LOGOUT)
            toast.success(result?.data?.message || "Logout successfull")
            dispatch(clearUserDetails())
            dispatch(clearAllDoctors())
            localStorage.clear();
            closeModal();
            dispatch(setLoading(false))
            navigate("/login")
        }
        catch(error){
            dispatch(setLoading(false))
            toast.error(error?.response?.data?.message || "Error in logout")
            console.log("Error in logout the user : ",error)

        }
    }
  return (
    <div className='fixed inset-0 flex justify-center items-center backdrop-blur-lg bg-black/30'>
        {loading && <Spinner/>}
        <div className='w-[30vw] h-[28vh] bg-white shadow-lg rounded-xl flex flex-col gap-1 items-center p-6 '>
            <p className='text-center text-2xl text-red-500'><FiLogOut/></p>
            <p className='text-lg font-semibold text-center'>Ready To Logout</p>
            <p className='text-center mt-1'>Are you sure  you want to logout of your account ?</p>
            <div className='flex gap-5 justify-center items-center mt-2'>
                <button onClick={closeModal} className='border cursor-pointer px-4 py-2 rounded-lg font-semibold text-lg'>Cancel</button>
                <button onClick={logoutHandler} className='border cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-lg hover:bg-red-600 transition-all duration-200'>Logout</button>
            </div>
        </div>
    </div>
  )
}

export default LogoutModal

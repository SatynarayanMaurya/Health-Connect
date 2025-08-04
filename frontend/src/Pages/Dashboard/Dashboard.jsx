import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import DoctorDashboard from './DoctorDashboard'
import DoctorDashboard from './Doctor Dashboard/DoctorDashboard'
import AdminDashboard from './AdminDashboard'
import DeviceDashboard from './DeviceDashboard'
import { setLoading, setUserDetails } from '../../Redux/Slices/userSlice'
import { toast } from 'react-toastify'
import { apiConnector } from '../../Services/apiConnector'
import { authEndpoints } from '../../Services/apis'
import Spinner from '../../Components/Spinner'
import { Navigate } from 'react-router-dom'

function Dashboard() {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.user.loading)
  const refreshUser = useSelector((state) => state.user.refreshUser)
  const userDetails = useSelector((state) => state.user.userDetails)

  const getUserDetails = async () => {
    try {
      if(userDetails) return ;
      dispatch(setLoading(true))
      const result = await apiConnector("GET", authEndpoints.GET_USER_DETAILS)
      dispatch(setUserDetails(result?.data?.userDetails))
    } catch (error) {
      console.error("Error in getting user details:", error)
      toast.error(error?.response?.data?.message || "Error in getting user details")
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [refreshUser])

  if (loading) return <Spinner />

  if (!userDetails) {
    return <div className="text-center flex justify-center items-center bg-black/30 h-screen p-4">
            <div className='flex flex-col gap-2'>
              <p className='text-xl'><strong>Connection Issue Detected</strong></p>
              <p>It looks like your internet connection is weak or unstable.</p>
              <p>Please check your connection and try refreshing the page.</p>
            </div>

    </div>
  }

  switch (userDetails?.role) {
    case "doctor":
      return <DoctorDashboard />
    case "admin":
      return <AdminDashboard />
    case "device":
      return <DeviceDashboard />
    default:
      return <Navigate to={"/login"}/>
  }
}

export default Dashboard

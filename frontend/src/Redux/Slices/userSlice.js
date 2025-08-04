import { createSlice } from '@reduxjs/toolkit'

const initialState = {


    loading:false,

    userDetails : null,

    allDoctors:null,

    allOnlineDoctors : null,

    allDevices:null,

    refreshUser: 0


}

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{

        setLoading:(state,action)=>{
            state.loading = action.payload
        },

        setUserDetails:(state,action)=>{
            state.userDetails = action.payload;
        },
        clearUserDetails:(state)=>{
            state.userDetails = null
        },

        setAllDoctors:(state,action)=>{
            state.allDoctors = action.payload;
        },
        clearAllDoctors:(state)=>{
            state.allDoctors = null
        },

        setAllOnlineDoctors:(state,action)=>{
            state.allOnlineDoctors = action.payload;
        },
        clearAllOnlineDoctors:(state)=>{
            state.allOnlineDoctors = null
        },

        setAllDevices:(state,action)=>{
            state.allDevices = action.payload;
        },
        clearAllDevices:(state)=>{
            state.allDevices = null
        },

        triggerUserRefresh: (state) => {
            state.refreshUser += 1;
        }





    }
})

export const {setLoading, setUserDetails, clearUserDetails,setAllDoctors,clearAllDoctors,setAllOnlineDoctors,clearAllOnlineDoctors,triggerUserRefresh,setAllDevices,clearAllDevices} = userSlice.actions
export default userSlice.reducer
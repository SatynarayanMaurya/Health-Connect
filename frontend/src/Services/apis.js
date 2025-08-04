const BASE_URL = "http://localhost:4000"


export const authEndpoints = {
    SIGN_UP : BASE_URL + "/api/signup",
    LOGIN : BASE_URL + "/api/login",
    LOGOUT : BASE_URL + "/api/logout",
    GET_USER_DETAILS : BASE_URL + "/api/get-user-details"
}

export const doctorEndpoints = {
    GET_ALL_DOCTORS: BASE_URL + "/api/get-all-doctors",
    UPDATE_DOCTOR_AVAILABILITY : BASE_URL + "/api/update-doctor-availability",
    GET_DOCTOR_CHATS : (deviceId) => `${BASE_URL}/api/get-doctor-chats/${deviceId}`
}

export const devicesEndpoints = {
    GET_ALL_DEVICES: BASE_URL + "/api/get-all-devices",
}


export const chatEndpoints = {
  GET_CHATS: (userId, peerId) => `${BASE_URL}/${userId}/${peerId}`
}

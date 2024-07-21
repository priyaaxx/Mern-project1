import { axiosInstance } from "./axiosInstance";

// register user
export const RegisteredUser = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/users/register", payload);
        return response.data;
    } catch (error) {
        // Ensure we return the error response in a consistent format
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: error.message };
        }
    }
}

// login user
export const LoginUser = async (payload) => {
    try {
        const response = await axiosInstance.post("/api/users/login", payload);
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else {
            return { success: false, message: error.message };
        }
    }
}

//get current user
export const GetCurrentUser = async() => {
    try{
        const response = await axiosInstance.get("/api/users/get-current-user");
        return response.data;
    } catch(error){
        return error.response.data;
    }
}

//get all users
export const GetAllUsers = async() => {
    try{
        const response = await axiosInstance.get("/api/users/get-users");
        return response.data;
    } catch(error){
        return error.response.data;
    }
}

//update user status
export const UpdateUserStatus = async(id, status) =>{
    try{
        const response = await axiosInstance.put( `/api/users/update-user-status/${id}`, {status});
        return response.data;
    } catch(error){
        return error.message;
    }
}
import axios from "axios";
import { toast } from 'sonner';
import { BASE_URL } from "./apiPaths";

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config;
}, (err) => {
    console.log(err);
    return Promise.reject(err);
})

axiosInstance.interceptors.response.use((res) => {
    return res;
}, (err) => {
    if (err.response) {
        if (err.response.status === 401) {
            toast.error("Unauthorized, redirected to login...");
            window.location.href = "/login"
        } else if (err.response.status === 500) {
            toast.error("Server Error. Try again later");
        }
    } else if (err.code === "ECONNABORTED") {
        toast.error("Request Timeout. Try again later");
    }

    return Promise.reject(err)
})
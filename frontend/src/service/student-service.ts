import { axiosInstance } from "@/utils/axios-instance";
import { API_ENDPOINTS } from "@/utils/api-path";

export const getAllStudents = () => {
    return axiosInstance.get(API_ENDPOINTS.STUDENT.GET_ALL, { withCredentials: true });
}

export const deleteStudentById = (id: string) => {
    return axiosInstance.delete(API_ENDPOINTS.STUDENT.DELETE_BY_ID(id), {
        withCredentials: true,
    });
}

export const deleteAllStudents = () => {
    return axiosInstance.delete(API_ENDPOINTS.STUDENT.DELETE_ALL, { withCredentials: true });
}

export const addStudent = (studentData: any) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.STUDENT.SIGNUP, studentData, {
        withCredentials: true,
    })
}

export const bulkCSVUpload = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log("Uploading file:", file);
    return axiosInstance.post(API_ENDPOINTS.AUTH.STUDENT.BULK_UPLOAD, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
    });
}

export const generateRandomPasswords = () => {
    return axiosInstance.get(API_ENDPOINTS.STUDENT.GENERATE_RANDOM_PASSWORDS, {
        withCredentials: true,
    })
}

export const mailCredentials = () => {
    return axiosInstance.get(API_ENDPOINTS.STUDENT.MAIL_CREDENTIALS, {
        withCredentials: true,
    });
}
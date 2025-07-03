import { axiosInstance } from "@/utils/axios-instance";
import { API_ENDPOINTS } from "@/utils/api-path";


export const raiseQuery = async (queryData: any) => {
    return axiosInstance.post(API_ENDPOINTS.STUDENT.QUERY.RAISE, queryData, {
        withCredentials: true
    });
}
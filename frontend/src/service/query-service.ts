import { axiosInstance } from "@/utils/axios-instance";
import { API_ENDPOINTS } from "@/utils/api-path";


export const raiseQuery = async (queryData: any) => {
    return axiosInstance.post(API_ENDPOINTS.STUDENT.QUERY.RAISE, queryData, {
        withCredentials: true
    });
}

export const getAllQueries = async () => {
    return axiosInstance.get(API_ENDPOINTS.QUERY.GET_ALL, {
        withCredentials: true
    });
}

export const resolveQuerie = async (queryId: string, data: any) => {
    return axiosInstance.put(API_ENDPOINTS.QUERY.RESOLVE(queryId), data, {
        withCredentials: true
    });
}

export const updateMakrs = async (answerSheetId: string, data: any) => {
    return axiosInstance.put(API_ENDPOINTS.ANSWER_SHEET.UPDATE_BY_ID(answerSheetId), data, {
        withCredentials: true
    });
}
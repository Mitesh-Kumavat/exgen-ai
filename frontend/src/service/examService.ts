import { axiosInstance } from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiPaths";

export const uploadChapterPDF = (chapter: string, file: File) => {
    const formData = new FormData();
    formData.append("chapter", chapter);
    formData.append("file", file);
    return axiosInstance.post(API_ENDPOINTS.PDF.UPLOAD, formData, { withCredentials: true });
};

export const createExamDraft = (payload: any) => {
    return axiosInstance.post(API_ENDPOINTS.EXAM.CREATE, payload, { withCredentials: true });
};

export const getAllExamData = (status: string) => {
    console.log(`Fetching exams with status: ${status}`);
    return axiosInstance.get(API_ENDPOINTS.EXAM.GET_ALL(status), { withCredentials: true });
}

export const updateExamStatus = (examId: string, newStatus: string) => {
    return axiosInstance.put(API_ENDPOINTS.EXAM.UPDATE_STATUS(examId), { status: newStatus }, { withCredentials: true });
}
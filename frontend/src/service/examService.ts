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

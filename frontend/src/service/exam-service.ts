import { axiosInstance } from "@/utils/axios-instance";
import { API_ENDPOINTS } from "@/utils/api-path";

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

export const getExamDetail = (examId: string) => {
    return axiosInstance.get(API_ENDPOINTS.EXAM.GET_BY_ID(examId), { withCredentials: true });
}

export const deleteExam = (examId: string) => {
    return axiosInstance.delete(API_ENDPOINTS.EXAM.DELETE_BY_ID(examId), { withCredentials: true });
}

export const getExamResults = (examId: string) => {
    return axiosInstance.get(API_ENDPOINTS.RESULT.GET_ALL_BY_EXAM_ID(examId), { withCredentials: true });
}

export const generateExamPaper = (examId: string) => {
    return axiosInstance.get(API_ENDPOINTS.STUDENT.EXAM.START_EXAM(examId), { withCredentials: true });
}

export const submitExam = (examId: string, answers: any) => {
    return axiosInstance.post(API_ENDPOINTS.STUDENT.EXAM.SUBMIT_EXAM(examId), { answers }, { withCredentials: true });
}

export const getExamPaperByStudentAndExamId = (examId: string, sutdentId: string) => {
    return axiosInstance.get(API_ENDPOINTS.STUDENT.EXAM.GET_EXAM_PAPER_BY_STUDENT_AND_EXAM_ID(examId, sutdentId), { withCredentials: true });
}
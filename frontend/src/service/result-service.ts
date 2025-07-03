import { axiosInstance } from "@/utils/axios-instance";
import { API_ENDPOINTS } from "@/utils/api-path";

export const getResultsForExam = async (examId: string) => {
    return axiosInstance.get(API_ENDPOINTS.RESULT.GET_ALL_BY_EXAM_ID(examId), {
        withCredentials: true
    });
}

export const getResultsForStudent = async (studentId: string, examId: string) => {
    return axiosInstance.get(API_ENDPOINTS.RESULT.GET_BY_STUDENT_AND_EXAM_ID(studentId, examId), {
        withCredentials: true
    });
}

export const getStudentAnswerSheet = async (answerSheetId: string) => {
    return axiosInstance.get(API_ENDPOINTS.ANSWER_SHEET.GET_BY_ID(answerSheetId), {
        withCredentials: true
    });
}

export const exportResultsToCSV = async (examId: string) => {
    return axiosInstance.get(API_ENDPOINTS.RESULT.EXPORT_CSV(examId), {
        withCredentials: true,
        responseType: 'blob',
    });
}

export const getResultById = async (resultId: string) => {
    return axiosInstance.get(API_ENDPOINTS.RESULT.GET_BY_ID(resultId), {
        withCredentials: true
    });
}

export const getStatsByExamId = async (examId: string) => {
    return axiosInstance.get(API_ENDPOINTS.STATS.BY_EXAM_ID(examId), {
        withCredentials: true
    });
}

export const sendResultsByEmail = async (examId: string) => {
    return axiosInstance.get(API_ENDPOINTS.RESULT.MAIL_RESULTS(examId), {
        withCredentials: true
    });
}

export const getAnswerSheetById = async (answerSheetId: string) => {
    return axiosInstance.get(API_ENDPOINTS.ANSWER_SHEET.GET_BY_ID(answerSheetId), {
        withCredentials: true
    });
}

export const getResultByAnswerSheetId = async (answerSheetId: string) => {
    return axiosInstance.get(API_ENDPOINTS.RESULT.GET_BY_ANSWER_SHEET_ID(answerSheetId), {
        withCredentials: true
    });
}
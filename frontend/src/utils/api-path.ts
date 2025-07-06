export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const API_ENDPOINTS = {
    AUTH: {
        ADMIN: {
            SIGNUP: `${BASE_URL}/admin/signup`,
            LOGIN: `${BASE_URL}/admin/login`,
            LOGOUT: `${BASE_URL}/admin/logout`,
            PROFILE: `${BASE_URL}/admin`,
        },
        STUDENT: {
            BULK_UPLOAD: `${BASE_URL}/admin/bulk-upload`,
            SIGNUP: `${BASE_URL}/student/signup`,
            LOGIN: `${BASE_URL}/student/login`,
            LOGOUT: `${BASE_URL}/student/logout`,
            PROFILE: `${BASE_URL}/student/me`,
        }
    },
    STUDENT: {
        GET_ALL: `${BASE_URL}/student`,
        GET_BY_ID: (id: string) => `${BASE_URL}/student/${id}`, // TODO: add this in backend
        DELETE_BY_ID: (id: string) => `${BASE_URL}/admin/student/${id}`,
        DELETE_ALL: `${BASE_URL}/admin/bulk-delete`,
        GENERATE_RANDOM_PASSWORDS: `${BASE_URL}/admin/generate-password`,
        MAIL_CREDENTIALS: `${BASE_URL}/admin/mail-password`,
        EXAM: {
            START_EXAM: (examId: string) => `${BASE_URL}/exam-paper/${examId}`,
            SUBMIT_EXAM: (examId: string) => `${BASE_URL}/answer-sheet/${examId}`,
            GET_EXAM_PAPER_BY_STUDENT_AND_EXAM_ID: (examId: string, studentId: string) => `${BASE_URL}/exam-paper/${examId}/${studentId}`,
        },
        QUERY: {
            RAISE: `${BASE_URL}/query`,
        }
    },
    EXAM: {
        CREATE: `${BASE_URL}/exam`,
        GET_ALL: (status: string) => `${BASE_URL}/exam?status=${status}`,
        GET_BY_ID: (id: string) => `${BASE_URL}/exam/${id}`,
        DELETE_BY_ID: (id: string) => `${BASE_URL}/exam/${id}`,
        UPDATE_STATUS: (id: string) => `${BASE_URL}/exam/${id}`,
    },
    PDF: {
        UPLOAD: `${BASE_URL}/admin/pdf`,
        DELETE: (id: string) => `${BASE_URL}/pdf/${id}`, // need publicId in body
    },
    RESULT: {
        GET_ALL_BY_EXAM_ID: (examId: string) => `${BASE_URL}/result/exam/${examId}`,
        GET_BY_ID: (id: string) => `${BASE_URL}/result/${id}`,
        GET_BY_STUDENT_AND_EXAM_ID: (studentId: string, examId: string) => `${BASE_URL}/result/student/${studentId}/exam/${examId}`,
        EXPORT_CSV: (examId: string) => `${BASE_URL}/result/exam/${examId}/csv`,
        MAIL_RESULTS: (examId: string) => `${BASE_URL}/result/${examId}/mail-result`,
        GET_BY_ANSWER_SHEET_ID: (answerSheetId: string) => `${BASE_URL}/result/answer-sheet/${answerSheetId}`,
    },
    STATS: {
        BASIC: `${BASE_URL}/stats`,
        BY_EXAM_ID: (examId: string) => `${BASE_URL}/stats/${examId}`,
    },
    QUERY: {
        GET_ALL: `${BASE_URL}/query`,
        RESOLVE: (id: string) => `${BASE_URL}/query/${id}`,
    },
    ANSWER_SHEET: {
        GET_BY_ID: (id: string) => `${BASE_URL}/answer-sheet/${id}`,
        UPDATE_BY_ID: (id: string) => `${BASE_URL}/answer-sheet/${id}`,
    }
}
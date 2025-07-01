export interface Admin {
    _id: string;
    email: string;
    name: string;
}

export interface AdminAuthState {
    admin: Admin | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setAdmin: (admin: Admin | null) => void;
}

export interface StudentAuthState {
    student: Student | null;
    isAuthenticated: boolean;
    login: (enrollmentNumber: string, password: string) => Promise<void>;
    logout: () => void;
    setStudent: (student: Student | null) => void;
}

export interface Student {
    _id: string;
    mobile: string;
    name: string;
    email: string;
    enrollmentNumber: string;
    semester: string;
    branch: string;
    createdAt: string;
}

export interface ChapterForm {
    chapter: string;
    marks: number;
    file: File | null;
    uploadData?: {
        url: string;
        publicId: string;
        importantTopics: string;
    };
}

export interface Exam {
    _id: string;
    title: string;
    subject: string;
    description: string;
    semester: string;
    date: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
    status: 'draft' | 'active' | 'completed';
    syllabusData: SyllabusChapter[];
    questionSchema: QuestionSchema;
    createdAt: string;
}

export interface SyllabusChapter {
    _id: string;
    chapter: string;
    url?: string;
    publicId?: string;
    marks: number;
    importantTopics?: string;
}

export interface QuestionSchema {
    mcq: {
        count: number;
        mark: number;
    };
    subjective: {
        count: number;
        mark: number;
        additionalCheckingTip?: string;
    };
    code: {
        count: number;
        mark: number;
        additionalCheckingTip?: string;
    };
    evaluationInstruction: string;
    difficultyInstruction: string;
}

export interface ExamDetail extends Omit<Exam, "semester" | "examDate" | "duration" | "syllabusData"> {
    semester: number;
    examDate: string;
    durationMinutes: number;
    syllabusData: (SyllabusChapter & { importantTopics?: string })[];
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    updatedAt: string;
}

export interface StudentFormData {
    name: string
    enrollmentNumber: string
    branch: string
    email: string
    mobile: string
}
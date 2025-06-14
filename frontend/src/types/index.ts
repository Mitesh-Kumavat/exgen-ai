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
    chapterName: string;
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
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
    password?: string;
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

export interface ExamData {
    _id: string
    title: string
    description: string
    subject: string
    semester: number
    durationMinutes: number
    totalMarks: number
    passingMarks: number
    examDate: string
    createdAt: string
    createdBy: string
    status: string
}

export interface MCQQuestion {
    _id: string
    text: string
    options: string[]
    marks: number
}

export interface SubjectiveQuestion {
    _id: string
    text: string
    marks: number
}

export interface CodeQuestion {
    _id: string
    text: string
    marks: number
}

export interface Questions {
    mcq: MCQQuestion[]
    subjective: SubjectiveQuestion[]
    code: CodeQuestion[]
}

export interface ExamPaper {
    _id: string
    student: string
    exam: ExamData
    questions: Questions
    isSubmitted: boolean
    createdAt: string
    updatedAt: string
}

export interface MCQAnswer {
    questionId: string
    selectedOption: string
}

export interface SubjectiveAnswer {
    questionId: string
    answerText: string
}

export interface CodeAnswer {
    questionId: string
    answerText: string
}

export interface AnswerData {
    mcq_questions: MCQAnswer[]
    subjective_questions: SubjectiveAnswer[]
    coding_questions: CodeAnswer[]
}

export interface ExamProgress {
    answers: AnswerData
    examPaper: ExamPaper
    lastSaved: string
}

export interface TimerState {
    startTime: number
    durationMinutes: number
}

export interface ExamStats {
    examName: string
    semester: number
    enrolledStudents: number
    duration: number
    totalMarks: number
    passStudents: number
    failStudents: number
    averageMarks: string
    submittedExamPapers: number
}

export interface Student {
    _id: string
    name: string
    enrollmentNumber: string
    email: string
}

export interface ExamInfo {
    _id: string
    title: string
    totalMarks: number
    passingMarks: number
}

export interface ExamResult {
    _id: string
    student: Student
    exam: ExamInfo
    achievedMarks: number
    answerSheet: string
    category: string
    feedbackSummary: string
    createdAt: string
    updatedAt: string
}

export interface MCQAnswer {
    questionId: string
    selectedOption: string
    isCorrect: boolean
    marksAwarded: number
    _id: string
}

export interface SubjectiveAnswer {
    questionId: string
    answerText: string
    marksAwarded: number
    aiFeedback?: string
    _id: string
}

export interface CodeAnswer {
    questionId: string
    answerText: string
    marksAwarded: number
    aiFeedback?: string
    _id: string
}

export interface AnswerSheet {
    _id: string
    student: Student
    exam: ExamInfo
    answers: {
        mcq: MCQAnswer[]
        subjective: SubjectiveAnswer[]
        code: CodeAnswer[]
    }
    achievedMarks: number
    isSubmitted: boolean
    submitTime: string
    createdAt: string
    updatedAt: string
}

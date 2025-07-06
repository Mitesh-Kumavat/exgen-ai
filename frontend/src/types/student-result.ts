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

export interface StudentAnswerSheet {
    _id: string
    student: {
        _id: string
        name: string
        email: string
    }
    exam: {
        _id: string
        title: string
    }
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

export interface StudentResult {
    _id: string
    student: {
        _id: string
        name: string
        enrollmentNumber: string
        email: string
    }
    exam: {
        _id: string
        title: string
        totalMarks: number
        passingMarks: number
    }
    achievedMarks: number
    answerSheet: string
    category: string
    feedbackSummary: string
    createdAt: string
    updatedAt: string
}

export interface MCQQuestion {
    _id: string
    text: string
    options: string[]
    correctOption: string
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

export interface ExamPaper {
    _id: string
    student: {
        _id: string
        name: string
        email: string
    }
    exam: {
        _id: string
        title: string
        subject: string
        semester: number
    }
    questions: {
        mcq: MCQQuestion[]
        subjective: SubjectiveQuestion[]
        code: CodeQuestion[]
    }
    questionPaperSchema: {
        mcq: {
            count: number
            mark: number
        }
        subjective: {
            count: number
            mark: number
            additionalCheckingTip: string
        }
        code: {
            count: number
            mark: number
            additionalCheckingTip: string
        }
        evaluationInstruction: string
        difficultyInstruction: string
    }
    answerSheet: string
    isSubmitted: boolean
    createdAt: string
    updatedAt: string
    submitTime?: string
}

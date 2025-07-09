import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { ExamTimer } from "@/components/exam-window/exam-timer"
import { QuestionSection } from "@/components/exam-window/question-section"
import { SubmitModal } from "@/components/exam-window/submit-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Send, AlertCircle } from "lucide-react"
import type { ExamPaper, AnswerData } from "@/types"
import { saveExamProgress, getExamProgress, clearExamProgress } from "@/utils/exam-storage"
import { generateExamPaper, submitExam } from "@/service/exam-service"
import { extractErrorMessage } from "@/utils/error-handler"
import { useSecureExamEnvironment } from "@/hooks/use-secure-enviornment"

const ExamPage = () => {
    const { examId } = useParams()
    const [examPaper, setExamPaper] = useState<ExamPaper | null>(null)
    const [loading, setLoading] = useState(true)
    const [answers, setAnswers] = useState<AnswerData>({
        mcq_questions: [],
        subjective_questions: [],
        coding_questions: [],
    })
    const [submitModalOpen, setSubmitModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [timeUp, setTimeUp] = useState(false)

    useEffect(() => {
        if (!examId) return

        const fetchExamPaper = async () => {
            try {
                setLoading(true)
                const response = await generateExamPaper(examId);

                if (response.data.success) {
                    setExamPaper(response.data.data)

                    const savedProgress = getExamProgress(examId)
                    if (savedProgress) {
                        setAnswers(savedProgress.answers)
                        toast.success("Previous progress restored")
                    }
                } else {
                    const err = response.data.message || "Failed to load exam paper"
                    console.error("Error:", err)
                    toast.error(err)
                }
            } catch (error) {
                const err = extractErrorMessage(error, "Failed to load exam paper")
                toast.error(`${err}`)
            } finally {
                setLoading(false)
            }
        }

        fetchExamPaper()
    }, [examId])

    useEffect(() => {
        if (examPaper && examId) {
            saveExamProgress(examId, {
                answers,
                examPaper,
                lastSaved: new Date().toISOString(),
            })
        }
    }, [answers, examPaper, examId])

    const handleAnswerChange = useCallback((questionType: string, questionId: string, answer: any) => {
        setAnswers((prev) => {
            const newAnswers = { ...prev }

            if (questionType === "mcq") {
                const existingIndex = newAnswers.mcq_questions.findIndex((q) => q.questionId === questionId)
                if (existingIndex >= 0) {
                    newAnswers.mcq_questions[existingIndex].selectedOption = answer
                } else {
                    newAnswers.mcq_questions.push({ questionId, selectedOption: answer })
                }
            } else if (questionType === "subjective") {
                const existingIndex = newAnswers.subjective_questions.findIndex((q) => q.questionId === questionId)
                if (existingIndex >= 0) {
                    newAnswers.subjective_questions[existingIndex].answerText = answer
                } else {
                    newAnswers.subjective_questions.push({ questionId, answerText: answer })
                }
            } else if (questionType === "code") {
                const existingIndex = newAnswers.coding_questions.findIndex((q) => q.questionId === questionId)
                if (existingIndex >= 0) {
                    newAnswers.coding_questions[existingIndex].answerText = answer
                } else {
                    newAnswers.coding_questions.push({ questionId, answerText: answer })
                }
            }

            return newAnswers
        })
    }, [])

    const calculateAttemptedQuestions = () => {
        if (!examPaper) return { attempted: 0, total: 0 }

        const totalQuestions =
            examPaper.questions.mcq.length + examPaper.questions.subjective.length + examPaper.questions.code.length

        const attemptedQuestions =
            answers.mcq_questions.filter((q) => q.selectedOption).length +
            answers.subjective_questions.filter((q) => q.answerText.trim()).length +
            answers.coding_questions.filter((q) => q.answerText.trim()).length

        return { attempted: attemptedQuestions, total: totalQuestions }
    }

    const handleSubmitExam = async () => {
        if (!examId) return

        try {
            setSubmitting(true)
            const response = await submitExam(examId, answers)

            if (response.data.success) {
                toast.success("Exam submitted successfully!")
                clearExamProgress(examId)
                window.location.href = "/exam-window"
            } else {
                const err = response.data.message || "Failed to submit exam"
                console.error("Error:", err)
                toast.error(err)
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to submit exam")
            toast.error(err)
        } finally {
            setSubmitting(false)
            setSubmitModalOpen(false)
        }
    }

    const handleTimeUp = useCallback(() => {
        setTimeUp(true)
        toast.warning("Time's up! Submitting exam automatically...")
        setTimeout(() => {
            handleSubmitExam()
        }, 2000)
    }, [])

    useSecureExamEnvironment();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground text-lg">Loading exam paper...</p>
                </div>
            </div>
        )
    }

    if (!examPaper) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="text-center py-12">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Exam Not Found</h3>
                        <p className="text-muted-foreground">The requested exam could not be loaded.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { attempted, total } = calculateAttemptedQuestions()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Header */}
            <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <h1 className="text-xl font-semibold">Exam in Progress</h1>
                            </div>
                            <Badge variant="outline" className="text-sm">
                                {attempted}/{total} Attempted
                            </Badge>
                        </div>

                        <div className="flex items-center gap-4">
                            <ExamTimer
                                durationMinutes={examPaper.exam.durationMinutes || 60}
                                onTimeUp={handleTimeUp}
                                examId={examId!}
                            />
                            <Button onClick={() => setSubmitModalOpen(true)} disabled={timeUp || submitting} className="gap-2">
                                <Send className="h-4 w-4" />
                                Submit Exam
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <QuestionSection
                    questions={examPaper.questions}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                    disabled={timeUp}
                />
            </div>

            {/* Submit Modal */}
            <SubmitModal
                open={submitModalOpen}
                onOpenChange={setSubmitModalOpen}
                onConfirm={handleSubmitExam}
                attempted={attempted}
                total={total}
                submitting={submitting}
            />
        </div>
    )
}

export default ExamPage

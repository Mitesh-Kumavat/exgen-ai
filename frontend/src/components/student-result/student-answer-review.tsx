import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getExamPaperByStudentAndExamId } from "@/service/exam-service"
import { StudentMCQCard } from "./student-mcq-card"
import { StudentSubjectiveCard } from "./student-subjective-card"
import { StudentCodeCard } from "./student-code-card"
import { toast } from "sonner"
import { HelpCircle, FileText, Code, BookOpen } from "lucide-react"
import { extractErrorMessage } from "@/utils/error-handler"
import type { StudentAnswerSheet, ExamPaper } from "@/types/student-result"

interface StudentAnswerReviewProps {
    answerSheet: StudentAnswerSheet
}

export const StudentAnswerReview = ({ answerSheet }: StudentAnswerReviewProps) => {
    const [examPaper, setExamPaper] = useState<ExamPaper | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchExamPaper()
    }, [answerSheet])

    const fetchExamPaper = async () => {
        try {
            setLoading(true)
            const response = await getExamPaperByStudentAndExamId(answerSheet.exam._id, answerSheet.student._id)

            if (response.data.success) {
                setExamPaper(response.data.data)
            } else {
                toast.error("Failed to load exam questions")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to load exam questions")
            toast.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Card className="border-border">
                <CardContent className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading exam questions...</p>
                </CardContent>
            </Card>
        )
    }

    if (!examPaper) {
        return (
            <Card className="border-border">
                <CardContent className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Questions Not Available</h3>
                    <p className="text-muted-foreground">Unable to load the exam questions for review.</p>
                </CardContent>
            </Card>
        )
    }

    const hasQuestions =
        examPaper.questions.mcq.length > 0 ||
        examPaper.questions.subjective.length > 0 ||
        examPaper.questions.code.length > 0

    if (!hasQuestions) {
        return (
            <Card className="border-border">
                <CardContent className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Questions Found</h3>
                    <p className="text-muted-foreground">There are no questions to review for this exam.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    Question & Answer Review
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="mcq" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="mcq" className="gap-2" disabled={examPaper.questions.mcq.length === 0}>
                            <HelpCircle className="h-4 w-4" />
                            MCQ ({examPaper.questions.mcq.length})
                        </TabsTrigger>
                        <TabsTrigger value="subjective" className="gap-2" disabled={examPaper.questions.subjective.length === 0}>
                            <FileText className="h-4 w-4" />
                            Subjective ({examPaper.questions.subjective.length})
                        </TabsTrigger>
                        <TabsTrigger value="code" className="gap-2" disabled={examPaper.questions.code.length === 0}>
                            <Code className="h-4 w-4" />
                            Code ({examPaper.questions.code.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* MCQ Answers */}
                    <TabsContent value="mcq" className="space-y-4">
                        {examPaper.questions.mcq.length === 0 ? (
                            <div className="text-center py-8">
                                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No MCQ questions in this exam</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {examPaper.questions.mcq.map((question, index) => {
                                    const answer = answerSheet.answers.mcq.find((a) => a.questionId === question._id)
                                    return (
                                        <StudentMCQCard key={question._id} question={question} answer={answer} questionNumber={index + 1} />
                                    )
                                })}
                            </div>
                        )}
                    </TabsContent>

                    {/* Subjective Answers */}
                    <TabsContent value="subjective" className="space-y-4">
                        {examPaper.questions.subjective.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No subjective questions in this exam</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {examPaper.questions.subjective.map((question, index) => {
                                    const answer = answerSheet.answers.subjective.find((a) => a.questionId === question._id)
                                    return (
                                        <StudentSubjectiveCard
                                            key={question._id}
                                            question={question}
                                            answer={answer}
                                            questionNumber={index + 1}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </TabsContent>

                    {/* Code Answers */}
                    <TabsContent value="code" className="space-y-4">
                        {examPaper.questions.code.length === 0 ? (
                            <div className="text-center py-8">
                                <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No coding questions in this exam</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {examPaper.questions.code.map((question, index) => {
                                    const answer = answerSheet.answers.code.find((a) => a.questionId === question._id)
                                    return (
                                        <StudentCodeCard
                                            key={question._id}
                                            question={question}
                                            answer={answer}
                                            questionNumber={index + 1}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

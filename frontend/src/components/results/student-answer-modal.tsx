import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getExamPaperByStudentAndExamId } from "@/service/exam-service"
import { AdminMCQCard } from "./admin-mcq-card"
import { AdminSubjectiveCard } from "./admin-subjective-card"
import { AdminCodeCard } from "./admin-code-card"
import { toast } from "sonner"
import { User, FileText, HelpCircle, Code, Clock, Target } from "lucide-react"
import { extractErrorMessage } from "@/utils/error-handler"
import type { AnswerSheet, ExamPaper } from "@/types/result"

interface StudentAnswerModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    answerSheet: AnswerSheet | null
}

export const StudentAnswerModal = ({ open, onOpenChange, answerSheet }: StudentAnswerModalProps) => {
    const [examPaper, setExamPaper] = useState<ExamPaper | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && answerSheet) {
            fetchExamPaper()
        }
    }, [open, answerSheet])

    const fetchExamPaper = async () => {
        if (!answerSheet) return

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

    if (!answerSheet) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="md:min-w-[700px] min-w-[200px] lg:min-w-[1100px] h-[90vh] max-h-[900px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        Answer Sheet - {answerSheet.student.name}
                    </DialogTitle>
                </DialogHeader>

                <Card className="bg-muted/50 border-border">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Student</p>
                                    <p className="font-semibold">{answerSheet.student.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Score</p>
                                    <p className="font-semibold text-green-600 dark:text-green-400">{answerSheet.achievedMarks} marks</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Submitted</p>
                                    <p className="font-semibold">{new Date(answerSheet.submitTime).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : examPaper ? (
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

                        <TabsContent value="mcq" className="space-y-4">
                            {examPaper.questions.mcq.length === 0 ? (
                                <Card className="border-border">
                                    <CardContent className="text-center py-8">
                                        <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No MCQ questions in this exam</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {examPaper.questions.mcq.map((question: any, index: number) => {
                                        const answer = answerSheet.answers.mcq.find((a) => a.questionId === question._id)
                                        return (
                                            <AdminMCQCard key={question._id} question={question} answer={answer} questionNumber={index + 1} />
                                        )
                                    })}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="subjective" className="space-y-4">
                            {examPaper.questions.subjective.length === 0 ? (
                                <Card className="border-border">
                                    <CardContent className="text-center py-8">
                                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No subjective questions in this exam</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {examPaper.questions.subjective.map((question: any, index: number) => {
                                        const answer = answerSheet.answers.subjective.find((a) => a.questionId === question._id)
                                        return (
                                            <AdminSubjectiveCard
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

                        <TabsContent value="code" className="space-y-4">
                            {examPaper.questions.code.length === 0 ? (
                                <Card className="border-border">
                                    <CardContent className="text-center py-8">
                                        <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No coding questions in this exam</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {examPaper.questions.code.map((question: any, index: number) => {
                                        const answer = answerSheet.answers.code.find((a) => a.questionId === question._id)
                                        return (
                                            <AdminCodeCard
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
                ) : (
                    <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Failed to load exam questions</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

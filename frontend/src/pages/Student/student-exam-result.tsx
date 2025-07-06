import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { getAnswerSheetById, getResultByAnswerSheetId } from "@/service/result-service"
import { StudentResultHeader } from "@/components/student-result/student-result-header"
import { StudentResultStats } from "@/components/student-result/student-result-stats"
import { StudentAnswerReview } from "@/components/student-result/student-answer-review"
import { RaiseQueryModal } from "@/components/student-result/raise-query-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, MessageSquareIcon as MessageSquareQuestion } from "lucide-react"
import { extractErrorMessage } from "@/utils/error-handler"
import type { StudentAnswerSheet, StudentResult } from "@/types/student-result"

const StudentResultPage = () => {
    const { examId, answerSheetId } = useParams()
    const [answerSheet, setAnswerSheet] = useState<StudentAnswerSheet | null>(null)
    const [result, setResult] = useState<StudentResult | null>(null)
    const [loading, setLoading] = useState(true)
    const [queryModalOpen, setQueryModalOpen] = useState(false)

    useEffect(() => {
        if (!examId || !answerSheetId) {
            toast.error("Invalid URL parameters")
            return
        }
        fetchStudentResult()
    }, [examId, answerSheetId])

    const fetchStudentResult = async () => {
        if (!answerSheetId) return

        try {
            setLoading(true)
            const [answerSheetResponse, resultResponse] = await Promise.all([
                getAnswerSheetById(answerSheetId),
                getResultByAnswerSheetId(answerSheetId),
            ])

            if (answerSheetResponse.data.success) {
                setAnswerSheet(answerSheetResponse.data.data)
            } else {
                toast.error("Failed to fetch answer sheet")
            }

            if (resultResponse.data.success) {
                setResult(resultResponse.data.data)
            } else {
                toast.error("Failed to fetch result")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to fetch student result")
            toast.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground text-lg">Loading your result...</p>
                </div>
            </div>
        )
    }

    if (!answerSheet || !result) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="text-center py-12">
                        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Result Not Found</h3>
                        <p className="text-muted-foreground">
                            We couldn't find your exam result. Please check the URL or contact your instructor.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-6xl">
                {/* Header */}
                <StudentResultHeader result={result} answerSheet={answerSheet} />

                {/* Stats Cards */}
                <StudentResultStats result={result} answerSheet={answerSheet} />

                {/* Answer Review */}
                <StudentAnswerReview answerSheet={answerSheet} />

                {/* Raise Query Button */}
                <div className="flex justify-center pt-6">
                    <Button
                        onClick={() => setQueryModalOpen(true)}
                        variant="outline"
                        size="lg"
                        className="gap-2 bg-background hover:bg-muted border-2 border-dashed border-muted-foreground/30 hover:border-primary/50"
                    >
                        <MessageSquareQuestion className="h-5 w-5" />
                        Raise a Query
                    </Button>
                </div>

                {/* Raise Query Modal */}
                <RaiseQueryModal
                    open={queryModalOpen}
                    onOpenChange={setQueryModalOpen}
                    examId={examId!}
                    studentId={result.student._id}
                />
            </div>
        </div>
    )
}

export default StudentResultPage

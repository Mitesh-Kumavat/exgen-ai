import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getAllExamData } from "@/service/exam-service"
import { ExamCard } from "@/components/exam-window/exam-card"
import { Clock, BookOpen } from "lucide-react"
import type { ExamData } from "@/types"
import { extractErrorMessage } from "@/utils/error-handler"
import { Card, CardContent } from "@/components/ui/card"

const ExamWindow = () => {
    const [exams, setExams] = useState<ExamData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchExams = async () => {
            setLoading(true)
            try {
                const response = await getAllExamData("active")
                setExams(response.data.data)
            } catch (error) {
                const err = extractErrorMessage(error, "Failed to fetch exams. Try again later.")
                toast.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchExams()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="text-muted-foreground text-lg">Loading available exams...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-6xl mx-auto space-y-6">


                <div className="text-center space-y-4 py-8">
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <BookOpen className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">Exam Portal</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Select an exam to begin. Make sure you have a stable internet connection and sufficient time to complete the
                        exam.
                    </p>
                </div>

                {exams.length === 0 ? (
                    <Card className="max-w-md mx-auto">
                        <CardContent className="text-center py-12">
                            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Active Exams</h3>
                            <p className="text-muted-foreground">
                                {exams.length === 0
                                    ? "There are no active exams available at the moment."
                                    : "No exams match your search criteria."}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <ExamCard key={exam._id} exam={exam} />
                        ))}
                    </div>
                )}


                <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                        Make sure to read all instructions carefully before starting your exam.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ExamWindow

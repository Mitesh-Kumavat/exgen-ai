import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import {
    getResultsForExam,
    exportResultsToCSV,
    getStatsByExamId,
    getStudentAnswerSheet,
    sendResultsByEmail,
} from "@/service/result-service"
import { ResultsTable } from "@/components/results/result-table"
import { AnalyticsModal } from "@/components/results/analytics-modal"
import { StudentAnswerModal } from "@/components/results/student-answer-modal"
import { ExamStatsCards } from "@/components/results/exam-stats-cards"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, BarChart3, Mail, Users } from "lucide-react"
import { extractErrorMessage } from "@/utils/error-handler"
import type { ExamResult, ExamStats, AnswerSheet } from "@/types/result"

const ExamResultPage = () => {
    const { examId } = useParams()
    const [results, setResults] = useState<ExamResult[]>([])
    const [stats, setStats] = useState<ExamStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false)
    const [answerModalOpen, setAnswerModalOpen] = useState(false)
    const [selectedAnswerSheet, setSelectedAnswerSheet] = useState<AnswerSheet | null>(null)
    const [exporting, setExporting] = useState(false)
    const [sendingResults, setSendingResults] = useState(false)

    useEffect(() => {
        if (!examId) return
        fetchData()
    }, [examId])

    const fetchData = async () => {
        if (!examId) return

        try {
            setLoading(true)
            const [resultsResponse, statsResponse] = await Promise.all([getResultsForExam(examId), getStatsByExamId(examId)])

            if (resultsResponse.data.success) {
                setResults(resultsResponse.data.data)
            } else {
                toast.error("Failed to fetch exam results")
            }

            if (statsResponse.data.success) {
                setStats(statsResponse.data.data)
            } else {
                toast.error("Failed to fetch exam statistics")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to fetch exam data")
            toast.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleExportCSV = async () => {
        if (!examId) return

        try {
            setExporting(true)
            const response = await exportResultsToCSV(examId)

            // Create blob and download
            const blob = new Blob([response.data], { type: "text/csv" })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `exam-results-${examId}-${new Date().toISOString().split("T")[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            toast.success("Results exported successfully")
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to export results")
            toast.error(err)
        } finally {
            setExporting(false)
        }
    }

    const handleSendResults = async () => {
        if (!examId) return

        try {
            setSendingResults(true)
            const response = await sendResultsByEmail(examId)
            if (!response.data.success) {
                toast.error("Failed to send results")
                return
            }
            toast.success("Results sent to all students successfully")
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to send results")
            toast.error(err)
        } finally {
            setSendingResults(false)
        }
    }

    const handleViewAnswerSheet = async (answerSheetId: string) => {
        try {
            const response = await getStudentAnswerSheet(answerSheetId)

            if (response.data.success) {
                setSelectedAnswerSheet(response.data.data)
                setAnswerModalOpen(true)
            } else {
                toast.error("Failed to fetch answer sheet")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to fetch answer sheet")
            toast.error(err)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-4 md:p-6">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground text-lg">Loading exam results...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Exam Details
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{stats?.examName || "Exam"} Results</h1>
                        <p className="text-muted-foreground">Comprehensive analysis and student performance data</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            onClick={() => setAnalyticsModalOpen(true)}
                            variant="outline"
                            className="gap-2 bg-transparent"
                            disabled={results.length === 0}
                        >
                            <BarChart3 className="h-4 w-4" />
                            View Analytics
                        </Button>

                        <Button
                            onClick={handleSendResults}
                            disabled={results.length === 0 || sendingResults}
                            variant="outline"
                            className="gap-2 bg-transparent"
                        >
                            <Mail className="h-4 w-4" />
                            {sendingResults ? "Sending..." : "Send Results"}
                        </Button>

                        <Button onClick={handleExportCSV} disabled={results.length === 0 || exporting} className="gap-2">
                            <Download className="h-4 w-4" />
                            {exporting ? "Exporting..." : "Export CSV"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            {stats && <ExamStatsCards stats={stats} />}

            {/* Results Table */}
            {results.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-20">
                        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                        <p className="text-muted-foreground">No students have completed this exam yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <ResultsTable results={results} onViewAnswerSheet={handleViewAnswerSheet} examInfo={stats} />
            )}

            {/* Modals */}
            <AnalyticsModal open={analyticsModalOpen} onOpenChange={setAnalyticsModalOpen} results={results} stats={stats} />

            <StudentAnswerModal open={answerModalOpen} onOpenChange={setAnswerModalOpen} answerSheet={selectedAnswerSheet} />
        </div>
    )
}

export default ExamResultPage

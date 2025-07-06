import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAnswerSheetById } from "@/service/result-service"
import { getExamPaperByStudentAndExamId } from "@/service/exam-service"
import { resolveQuerie, updateMakrs } from "@/service/query-service"
import { QueryAnswerReview } from "./query-answer-review"
import { ResolveQueryForm } from "./resolve-query-form"
import { toast } from "sonner"
import { User, BookOpen, Calendar, MessageSquareIcon as MessageSquareQuestion, FileText } from "lucide-react"
import { extractErrorMessage } from "@/utils/error-handler"
import type { Query, ExamPaper, StudentAnswerSheet, MarkUpdate } from "@/types/query"

interface QueryDetailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    query: Query | null
    onQueryResolved: () => void
}

export const QueryDetailModal = ({ open, onOpenChange, query, onQueryResolved }: QueryDetailModalProps) => {
    const [examPaper, setExamPaper] = useState<ExamPaper | null>(null)
    const [answerSheet, setAnswerSheet] = useState<StudentAnswerSheet | null>(null)
    const [loading, setLoading] = useState(false)
    const [markUpdates, setMarkUpdates] = useState<MarkUpdate[]>([])
    const [resolving, setResolving] = useState(false)

    useEffect(() => {
        if (open && query) {
            fetchQueryDetails()
        }
    }, [open, query])

    const fetchQueryDetails = async () => {
        if (!query) return

        try {
            setLoading(true)
            const [examPaperResponse, answerSheetResponse] = await Promise.all([
                getExamPaperByStudentAndExamId(query.exam._id, query.student._id),
                getAnswerSheetById(query.answerSheet._id),
            ])

            if (examPaperResponse.data.success) {
                setExamPaper(examPaperResponse.data.data)
            }

            if (answerSheetResponse.data.success) {
                setAnswerSheet(answerSheetResponse.data.data)
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to fetch query details")
            toast.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleMarkUpdate = (questionType: string, questionId: string, newMarks: number) => {
        setMarkUpdates((prev) => {
            const existing = prev.find((update) => update.questionId === questionId)
            if (existing) {
                return prev.map((update) => (update.questionId === questionId ? { ...update, newMarks } : update))
            } else {
                return [...prev, { questionType, questionId, newMarks }]
            }
        })
    }

    const handleResolveQuery = async (hasMarksUpdated: boolean) => {
        if (!query) return

        try {
            setResolving(true)

            if (hasMarksUpdated && markUpdates.length > 0) {
                await updateMakrs(query.answerSheet._id, {
                    updates: markUpdates,
                })
            }

            const resolveMessage = hasMarksUpdated
                ? "We have reviewed your query and updated your marks accordingly. The changes have been reflected in your result."
                : "We have carefully reviewed your query and your answer was fairly evaluated according to the marking scheme. The marks awarded are appropriate for your response."

            await resolveQuerie(query._id, {
                remarks: resolveMessage,
            })

            toast.success("Query resolved successfully")
            onQueryResolved()
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to resolve query")
            toast.error(err)
        } finally {
            setResolving(false)
        }
    }

    if (!query) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="md:min-w-[700px] min-w-[200px] lg:min-w-[1100px] h-[90vh] max-h-[900px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <MessageSquareQuestion className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        Query Details - {query.student.name}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="text-muted-foreground">Loading query details...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Query Info */}
                        <Card className="bg-muted/50 border-border">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Student</p>
                                            <p className="font-semibold">{query.student.name}</p>
                                            <p className="text-xs text-muted-foreground">{query.student.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Exam</p>
                                            <p className="font-semibold">{query.exam.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Query Raised</p>
                                            <p className="font-semibold">{new Date(query.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="review" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="review">Answer Review</TabsTrigger>
                                <TabsTrigger value="resolve">Resolve Query</TabsTrigger>
                            </TabsList>

                            <TabsContent value="review" className="space-y-4">
                                {examPaper && answerSheet ? (
                                    <QueryAnswerReview
                                        examPaper={examPaper}
                                        answerSheet={answerSheet}
                                        onMarkUpdate={handleMarkUpdate}
                                        markUpdates={markUpdates}
                                    />
                                ) : (
                                    <Card>
                                        <CardContent className="text-center py-12">
                                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground">Failed to load exam details</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="resolve" className="space-y-4">
                                <ResolveQueryForm
                                    query={query}
                                    markUpdates={markUpdates}
                                    onResolve={handleResolveQuery}
                                    resolving={resolving}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MCQQueryCard } from "./mcq-query-card"
import { SubjectiveQueryCard } from "./subjective-query-card"
import { CodeQueryCard } from "./code-query-card"
import { HelpCircle, FileText, Code } from "lucide-react"
import type { ExamPaper, StudentAnswerSheet, MarkUpdate } from "@/types/query"

interface QueryAnswerReviewProps {
    examPaper: ExamPaper
    answerSheet: StudentAnswerSheet
    onMarkUpdate: (questionType: string, questionId: string, newMarks: number) => void
    markUpdates: MarkUpdate[]
}

export const QueryAnswerReview = ({ examPaper, answerSheet, onMarkUpdate, markUpdates }: QueryAnswerReviewProps) => {
    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle>Answer Review & Mark Updates</CardTitle>
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

                    {/* MCQ Questions */}
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
                                        <MCQQueryCard
                                            key={question._id}
                                            question={question}
                                            answer={answer}
                                            questionNumber={index + 1}
                                            onMarkUpdate={onMarkUpdate}
                                            markUpdates={markUpdates}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </TabsContent>

                    {/* Subjective Questions */}
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
                                        <SubjectiveQueryCard
                                            key={question._id}
                                            question={question}
                                            answer={answer}
                                            questionNumber={index + 1}
                                            onMarkUpdate={onMarkUpdate}
                                            markUpdates={markUpdates}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </TabsContent>

                    {/* Code Questions */}
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
                                        <CodeQueryCard
                                            key={question._id}
                                            question={question}
                                            answer={answer}
                                            questionNumber={index + 1}
                                            onMarkUpdate={onMarkUpdate}
                                            markUpdates={markUpdates}
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

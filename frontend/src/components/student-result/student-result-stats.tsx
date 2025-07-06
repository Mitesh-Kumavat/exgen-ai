import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp, CheckCircle, XCircle, MessageSquare } from "lucide-react"
import type { StudentResult, StudentAnswerSheet } from "@/types/student-result"

interface StudentResultStatsProps {
    result: StudentResult
    answerSheet: StudentAnswerSheet
}

export const StudentResultStats = ({ result, answerSheet }: StudentResultStatsProps) => {
    const percentage = Math.round((result.achievedMarks / result.exam.totalMarks) * 100)
    const passingPercentage = Math.round((result.exam.passingMarks / result.exam.totalMarks) * 100)

    // Calculate question-wise stats
    const mcqStats = {
        total: answerSheet.answers.mcq.length,
        correct: answerSheet.answers.mcq.filter((q) => q.isCorrect).length,
        marks: answerSheet.answers.mcq.reduce((sum, q) => sum + q.marksAwarded, 0),
    }

    const subjectiveStats = {
        total: answerSheet.answers.subjective.length,
        answered: answerSheet.answers.subjective.filter((q) => q.answerText.trim()).length,
        marks: answerSheet.answers.subjective.reduce((sum, q) => sum + q.marksAwarded, 0),
    }

    const codeStats = {
        total: answerSheet.answers.code.length,
        answered: answerSheet.answers.code.filter((q) => q.answerText.trim()).length,
        marks: answerSheet.answers.code.reduce((sum, q) => sum + q.marksAwarded, 0),
    }

    const getGrade = () => {
        if (percentage >= 90) return { grade: "A+", color: "text-green-600 dark:text-green-400" }
        if (percentage >= 80) return { grade: "A", color: "text-green-500 dark:text-green-400" }
        if (percentage >= 70) return { grade: "B+", color: "text-blue-600 dark:text-blue-400" }
        if (percentage >= 60) return { grade: "B", color: "text-blue-500 dark:text-blue-400" }
        if (percentage >= 50) return { grade: "C", color: "text-yellow-600 dark:text-yellow-400" }
        if (percentage >= 40) return { grade: "D", color: "text-orange-600 dark:text-orange-400" }
        return { grade: "F", color: "text-red-600 dark:text-red-400" }
    }

    const grade = getGrade()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall Score */}
            <Card className="border-l-4 border-l-primary border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Your Score</CardTitle>
                    <Target className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-primary">
                        {result.achievedMarks}
                        <span className="text-lg text-muted-foreground">/{result.exam.totalMarks}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{percentage}% achieved</p>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Passing: {passingPercentage}%</p>
                </CardContent>
            </Card>

            {/* Grade */}
            <Card className="border-l-4 border-l-purple-500 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Grade</CardTitle>
                    <TrendingUp className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                </CardHeader>
                <CardContent>
                    <div className={`text-3xl font-bold ${grade.color}`}>{grade.grade}</div>
                    <p className="text-xs text-muted-foreground">Based on your performance</p>
                </CardContent>
            </Card>

            {/* MCQ Performance */}
            {mcqStats.total > 0 && (
                <Card className="border-l-4 border-l-blue-500 border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">MCQ Score</CardTitle>
                        <CheckCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{mcqStats.marks}</div>
                        <p className="text-xs text-muted-foreground">
                            {mcqStats.correct}/{mcqStats.total} correct
                        </p>
                        <Progress value={(mcqStats.correct / mcqStats.total) * 100} className="h-2 mt-2" />
                    </CardContent>
                </Card>
            )}

            {/* Subjective Performance */}
            {subjectiveStats.total > 0 && (
                <Card className="border-l-4 border-l-green-500 border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subjective Score</CardTitle>
                        <MessageSquare className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{subjectiveStats.marks}</div>
                        <p className="text-xs text-muted-foreground">
                            {subjectiveStats.answered}/{subjectiveStats.total} answered
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Code Performance */}
            {codeStats.total > 0 && (
                <Card className="border-l-4 border-l-purple-500 border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Code Score</CardTitle>
                        <XCircle className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{codeStats.marks}</div>
                        <p className="text-xs text-muted-foreground">
                            {codeStats.answered}/{codeStats.total} attempted
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* AI Feedback Summary */}
            {result.feedbackSummary && (
                <Card className="md:col-span-2 lg:col-span-4 border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            AI Feedback Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted/50 p-4 rounded-lg border border-border">
                            <p className="text-sm leading-relaxed">{result.feedbackSummary}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

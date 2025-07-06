import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, BookOpen, Award } from "lucide-react"
import type { StudentResult, StudentAnswerSheet } from "@/types/student-result"

interface StudentResultHeaderProps {
    result: StudentResult
    answerSheet: StudentAnswerSheet
}

export const StudentResultHeader = ({ result, answerSheet }: StudentResultHeaderProps) => {
    const getStatusColor = (category: string) => {
        if (!category) return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
        switch (category.toLowerCase()) {
            case "excellent":
                return "bg-green-100 text-green-800 hover:bg-green-200 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
            case "good":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
            case "average":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700"
            case "weak":
                return "bg-red-100 text-red-800 hover:bg-red-200 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
        }
    }

    const isPassed = result.achievedMarks >= result.exam.passingMarks

    return (
        <Card className="border-border shadow-lg">
            <CardContent className="p-6">
                <div className="space-y-6">
                    {/* Title and Status */}
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <BookOpen className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{result.exam.title} : {answerSheet.exam.subject}</h1>
                        </div>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <Badge
                                className={
                                    isPassed
                                        ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700 text-lg px-4 py-2"
                                        : "bg-red-100 text-red-800 hover:bg-red-200 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700 text-lg px-4 py-2"
                                }
                            >
                                {isPassed ? "PASSED" : "FAILED"}
                            </Badge>
                            <Badge className={`${getStatusColor(result.category)} text-lg px-4 py-2`}>
                                {result.category.toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Student</p>
                                    <p className="font-semibold">{result.student.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Award className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Enrollment</p>
                                    <p className="font-semibold font-mono">{result.student.enrollmentNumber}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Submitted</p>
                                    <p className="font-semibold">
                                        {new Date(answerSheet.submitTime).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Result Date</p>
                                    <p className="font-semibold">
                                        {new Date(result.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

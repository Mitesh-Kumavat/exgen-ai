import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, HelpCircle } from "lucide-react"
import type { MCQAnswer } from "@/types/student-result"

interface MCQAnswerCardProps {
    answer: MCQAnswer
    questionNumber: number
}

export const MCQAnswerCard = ({ answer, questionNumber }: MCQAnswerCardProps) => {
    return (
        <Card className={`border-l-4 ${answer.isCorrect ? "border-l-green-500" : "border-l-red-500"} border-border`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                        Question {questionNumber}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-semibold">
                            {answer.marksAwarded} marks
                        </Badge>
                        {answer.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                        ) : (
                            <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Your Answer:</span>
                        <Badge
                            className={`font-bold ${answer.isCorrect
                                ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                                : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
                                }`}
                        >
                            Option {answer.selectedOption}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Result:</span>
                        <span
                            className={`font-semibold ${answer.isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                }`}
                        >
                            {answer.isCorrect ? "Correct" : "Incorrect"}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

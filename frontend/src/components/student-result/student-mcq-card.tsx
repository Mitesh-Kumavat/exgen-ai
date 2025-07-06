import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, HelpCircle } from "lucide-react"
import type { MCQQuestion, MCQAnswer } from "@/types/student-result"

interface StudentMCQCardProps {
    question: MCQQuestion
    answer?: MCQAnswer
    questionNumber: number
}

export const StudentMCQCard = ({ question, answer, questionNumber }: StudentMCQCardProps) => {
    const options = ["A", "B", "C", "D"]

    return (
        <Card className={`border-l-4 ${answer?.isCorrect ? "border-l-green-500" : "border-l-red-500"} border-border`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                        Question {questionNumber}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-semibold">
                            {answer?.marksAwarded || 0}/{question.marks} marks
                        </Badge>
                        {answer?.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                        ) : (
                            <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">Question:</h4>
                    <p className="text-sm leading-relaxed">{question.text}</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-2">Options:</h4>
                    <div className="space-y-2">
                        {question.options.map((option, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded border text-sm ${options[index] === question.correctOption
                                    ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
                                    : options[index] === answer?.selectedOption
                                        ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
                                        : "bg-muted/50 border-border"
                                    }`}
                            >
                                <span className="font-medium mr-2">{options[index]}.</span>
                                {option}
                                {options[index] === question.correctOption && (
                                    <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Correct Answer</Badge>
                                )}
                                {options[index] === answer?.selectedOption && options[index] !== question.correctOption && (
                                    <Badge className="ml-2 bg-red-100 text-red-800 text-xs">Your Answer</Badge>
                                )}
                                {options[index] === answer?.selectedOption && options[index] === question.correctOption && (
                                    <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Your Answer (Correct)</Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Your Answer:</span>
                    <Badge
                        className={`font-bold ${answer?.isCorrect
                            ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                            : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
                            }`}
                    >
                        Option {answer?.selectedOption || "Not Answered"}
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Result:</span>
                    <span
                        className={`font-semibold ${answer?.isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            }`}
                    >
                        {answer?.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

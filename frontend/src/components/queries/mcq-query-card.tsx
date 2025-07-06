import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, HelpCircle } from "lucide-react"
import type { MCQQuestion, MCQAnswer, MarkUpdate } from "@/types/query"

interface MCQQueryCardProps {
    question: MCQQuestion
    answer?: MCQAnswer
    questionNumber: number
    onMarkUpdate: (questionType: string, questionId: string, newMarks: number) => void
    markUpdates: MarkUpdate[]
}

export const MCQQueryCard = ({ question, answer, questionNumber, markUpdates }: MCQQueryCardProps) => {
    const options = ["A", "B", "C", "D"]
    const currentUpdate = markUpdates.find((update) => update.questionId === question._id)
    const displayMarks = currentUpdate ? currentUpdate.newMarks : answer?.marksAwarded || 0

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
                            {displayMarks}/{question.marks} marks
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
                                    <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Correct</Badge>
                                )}
                                {options[index] === answer?.selectedOption && options[index] !== question.correctOption && (
                                    <Badge className="ml-2 bg-red-100 text-red-800 text-xs">Selected</Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Student Answer:</span>
                    <Badge
                        className={`font-bold ${answer?.isCorrect
                            ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                            : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
                            }`}
                    >
                        Option {answer?.selectedOption || "Not Answered"}
                    </Badge>
                </div>

                {currentUpdate && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                            <strong>Note:</strong> Marks will be updated to {currentUpdate.newMarks} when query is resolved.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

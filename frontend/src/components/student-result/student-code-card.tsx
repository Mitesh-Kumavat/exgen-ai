import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, MessageSquare } from "lucide-react"
import type { CodeQuestion, CodeAnswer } from "@/types/student-result"

interface StudentCodeCardProps {
    question: CodeQuestion
    answer?: CodeAnswer
    questionNumber: number
}

export const StudentCodeCard = ({ question, answer, questionNumber }: StudentCodeCardProps) => {
    return (
        <Card className="border-l-4 border-l-purple-500 border-border">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                        Coding Question {questionNumber}
                    </CardTitle>
                    <Badge variant="outline" className="font-semibold">
                        {answer?.marksAwarded || 0}/{question.marks} marks
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">Question:</h4>
                    <p className="text-sm leading-relaxed">{question.text}</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-400">Your Code:</h4>
                    <div className="bg-secondary text-secondary-foreground p-4 rounded-lg border font-mono text-sm overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{answer?.answerText || "// No code provided"}</pre>
                    </div>
                </div>

                {answer?.aiFeedback && (
                    <div>
                        <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            AI Code Review:
                        </h4>
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-400">{answer.aiFeedback}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

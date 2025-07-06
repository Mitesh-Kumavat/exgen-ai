import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, MessageSquare } from "lucide-react"
import type { SubjectiveQuestion, SubjectiveAnswer } from "@/types/student-result"

interface StudentSubjectiveCardProps {
    question: SubjectiveQuestion
    answer?: SubjectiveAnswer
    questionNumber: number
}

export const StudentSubjectiveCard = ({ question, answer, questionNumber }: StudentSubjectiveCardProps) => {
    return (
        <Card className="border-l-4 border-l-green-500 border-border">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-500 dark:text-green-400" />
                        Question {questionNumber}
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
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">Your Answer:</h4>
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{answer?.answerText || "No answer provided"}</p>
                    </div>
                </div>

                {answer?.aiFeedback && (
                    <div>
                        <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            AI Feedback:
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

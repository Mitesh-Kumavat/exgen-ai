import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { CodeQuestion as CodeQuestionType } from "@/types"

interface CodeQuestionProps {
    question: CodeQuestionType
    questionNumber: number
    answer: string
    onAnswerChange: (answer: string) => void
    disabled?: boolean
}

export const CodeQuestion = ({
    question,
    questionNumber,
    answer,
    onAnswerChange,
    disabled = false,
}: CodeQuestionProps) => {
    return (
        <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-medium leading-relaxed flex-1">
                            <span className="text-purple-600 font-semibold">Q{questionNumber}.</span> {question.text}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                            {question.marks} {question.marks === 1 ? "mark" : "marks"}
                        </Badge>
                    </div>

                    <Textarea
                        value={answer}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        placeholder="Write your code here..."
                        disabled={disabled}
                        className="min-h-[200px] resize-y font-mono text-sm"
                    />

                    <div className="text-xs text-muted-foreground">{answer.length} characters</div>
                </div>
            </CardContent>
        </Card>
    )
}

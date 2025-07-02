import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { MCQQuestion as MCQQuestionType } from "@/types"

interface MCQQuestionProps {
    question: MCQQuestionType
    questionNumber: number
    selectedOption: string
    onAnswerChange: (option: string) => void
    disabled?: boolean
}

export const MCQQuestion = ({
    question,
    questionNumber,
    selectedOption,
    onAnswerChange,
    disabled = false,
}: MCQQuestionProps) => {
    const options = ["A", "B", "C", "D"]

    return (
        <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-medium leading-relaxed flex-1">
                            <span className="text-blue-600 font-semibold">Q{questionNumber}.</span> {question.text}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                            {question.marks} {question.marks === 1 ? "mark" : "marks"}
                        </Badge>
                    </div>

                    <RadioGroup value={selectedOption} onValueChange={onAnswerChange} disabled={disabled} className="space-y-3">
                        {question.options.map((option, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <RadioGroupItem value={options[index]} id={`${question._id}-${options[index]}`} className="mt-1" />
                                <Label
                                    htmlFor={`${question._id}-${options[index]}`}
                                    className="text-sm leading-relaxed cursor-pointer flex-1"
                                >
                                    <span className="font-medium text-blue-600 mr-2">{options[index]}.</span>
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </CardContent>
        </Card>
    )
}

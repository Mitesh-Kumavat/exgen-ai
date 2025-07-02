import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MCQQuestion } from "./mcq-question"
import { SubjectiveQuestion } from "./subjective-question"
import { CodeQuestion } from "./code-question"
import { HelpCircle, FileText, Code } from "lucide-react"
import type { Questions, AnswerData } from "@/types"

interface QuestionSectionProps {
    questions: Questions
    answers: AnswerData
    onAnswerChange: (questionType: string, questionId: string, answer: any) => void
    disabled?: boolean
}

export const QuestionSection = ({ questions, answers, onAnswerChange, disabled = false }: QuestionSectionProps) => {
    return (
        <div className="space-y-8">
            {/* MCQ Section */}
            {questions.mcq.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-blue-500" />
                            Multiple Choice Questions ({questions.mcq.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {questions.mcq.map((question, index) => (
                            <MCQQuestion
                                key={question._id}
                                question={question}
                                questionNumber={index + 1}
                                selectedOption={answers.mcq_questions.find((q) => q.questionId === question._id)?.selectedOption || ""}
                                onAnswerChange={(answer) => onAnswerChange("mcq", question._id, answer)}
                                disabled={disabled}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Subjective Section */}
            {questions.subjective.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-green-500" />
                            Subjective Questions ({questions.subjective.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {questions.subjective.map((question, index) => (
                            <SubjectiveQuestion
                                key={question._id}
                                question={question}
                                questionNumber={index + 1}
                                answer={answers.subjective_questions.find((q) => q.questionId === question._id)?.answerText || ""}
                                onAnswerChange={(answer) => onAnswerChange("subjective", question._id, answer)}
                                disabled={disabled}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Code Section */}
            {questions.code.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5 text-purple-500" />
                            Coding Questions ({questions.code.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {questions.code.map((question, index) => (
                            <CodeQuestion
                                key={question._id}
                                question={question}
                                questionNumber={index + 1}
                                answer={answers.coding_questions.find((q) => q.questionId === question._id)?.answerText || ""}
                                onAnswerChange={(answer) => onAnswerChange("code", question._id, answer)}
                                disabled={disabled}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
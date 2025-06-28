import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, FileText, Code, AlertCircle } from "lucide-react"
import type { QuestionSchema } from "@/types"

interface QuestionSchemaSectionProps {
    questionSchema: QuestionSchema
}

export const QuestionSchemaSection = ({ questionSchema }: QuestionSchemaSectionProps) => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        Question Schema
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* MCQ Section */}
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <HelpCircle className="h-4 w-4 text-blue-500" />
                            <h4 className="font-semibold">Multiple Choice Questions</h4>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="outline">{questionSchema.mcq.count} questions</Badge>
                            <Badge variant="outline">{questionSchema.mcq.mark} marks each</Badge>
                        </div>
                    </div>

                    {/* Subjective Section */}
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-green-500" />
                            <h4 className="font-semibold">Subjective Questions</h4>
                        </div>
                        <div className="flex gap-2 mb-2">
                            <Badge variant="outline">{questionSchema.subjective.count} questions</Badge>
                            <Badge variant="outline">{questionSchema.subjective.mark} marks each</Badge>
                        </div>
                        {questionSchema.subjective.additionalCheckingTip && (
                            <div className="mt-2">
                                <p className="text-sm text-muted-foreground mb-1">Checking Tip:</p>
                                <p className="text-sm">{questionSchema.subjective.additionalCheckingTip}</p>
                            </div>
                        )}
                    </div>

                    {/* Code Section */}
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Code className="h-4 w-4 text-purple-500" />
                            <h4 className="font-semibold">Coding Questions</h4>
                        </div>
                        <div className="flex gap-2 mb-2">
                            <Badge variant="outline">{questionSchema.code.count} questions</Badge>
                            <Badge variant="outline">{questionSchema.code.mark} marks each</Badge>
                        </div>
                        {questionSchema.code.additionalCheckingTip && (
                            <div className="mt-2">
                                <p className="text-sm text-muted-foreground mb-1">Checking Tip:</p>
                                <p className="text-sm">{questionSchema.code.additionalCheckingTip}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Instructions
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Evaluation Instructions</h4>
                        <p className="text-sm text-muted-foreground">{questionSchema.evaluationInstruction}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Difficulty Instructions</h4>
                        <p className="text-sm text-muted-foreground">{questionSchema.difficultyInstruction}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

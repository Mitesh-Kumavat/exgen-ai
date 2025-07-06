import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code, MessageSquare, Edit } from "lucide-react"
import type { CodeQuestion, CodeAnswer, MarkUpdate } from "@/types/query"

interface CodeQueryCardProps {
    question: CodeQuestion
    answer?: CodeAnswer
    questionNumber: number
    onMarkUpdate: (questionType: string, questionId: string, newMarks: number) => void
    markUpdates: MarkUpdate[]
}

export const CodeQueryCard = ({ question, answer, questionNumber, onMarkUpdate, markUpdates }: CodeQueryCardProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [newMarks, setNewMarks] = useState(answer?.marksAwarded || 0)

    const currentUpdate = markUpdates.find((update) => update.questionId === question._id)
    const displayMarks = currentUpdate ? currentUpdate.newMarks : answer?.marksAwarded || 0

    const handleUpdateMarks = () => {
        if (newMarks >= 0 && newMarks <= question.marks) {
            onMarkUpdate("code", question._id, newMarks)
            setIsEditing(false)
        }
    }

    const handleCancelEdit = () => {
        setNewMarks(displayMarks)
        setIsEditing(false)
    }

    return (
        <Card className="border-l-4 border-l-purple-500 border-border">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Code className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                        Coding Question {questionNumber}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-semibold">
                            {displayMarks}/{question.marks} marks
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="gap-1">
                            <Edit className="h-3 w-3" />
                            Edit Marks
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">Question:</h4>
                    <p className="text-sm leading-relaxed">{question.text}</p>
                </div>

                <div>
                    <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-400">Student Code:</h4>
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

                {isEditing && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="space-y-3">
                            <Label htmlFor={`marks-${question._id}`}>Update Marks (Max: {question.marks})</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id={`marks-${question._id}`}
                                    type="number"
                                    min="0"
                                    max={question.marks}
                                    value={newMarks}
                                    onChange={(e) => setNewMarks(Number(e.target.value))}
                                    className="w-24"
                                />
                                <Button onClick={handleUpdateMarks} size="sm">
                                    Update
                                </Button>
                                <Button onClick={handleCancelEdit} variant="outline" size="sm">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {currentUpdate && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                            <strong>Note:</strong> Marks will be updated from {answer?.marksAwarded || 0} to {currentUpdate.newMarks}{" "}
                            when query is resolved.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

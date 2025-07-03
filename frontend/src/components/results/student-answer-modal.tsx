import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, FileText, CheckCircle, XCircle, HelpCircle, Code, MessageSquare, Clock, Target } from "lucide-react"
import type { AnswerSheet } from "@/types/result"

interface StudentAnswerModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    answerSheet: AnswerSheet | null
}

export const StudentAnswerModal = ({ open, onOpenChange, answerSheet }: StudentAnswerModalProps) => {
    if (!answerSheet) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:min-w-[1100px] sm:min-w-[600px] max-w-[1200px] h-[90vh] max-h-[800px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        Answer Sheet - {answerSheet.student.name}
                    </DialogTitle>
                </DialogHeader>

                {/* Student Info Header */}
                <Card className="bg-muted/50 border-border">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Student</p>
                                    <p className="font-semibold">{answerSheet.student.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Score</p>
                                    <p className="font-semibold text-green-600 dark:text-green-400">{answerSheet.achievedMarks} marks</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Submitted</p>
                                    <p className="font-semibold">{new Date(answerSheet.submitTime).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="mcq" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="mcq" className="gap-2">
                            <HelpCircle className="h-4 w-4" />
                            MCQ ({answerSheet.answers.mcq.length})
                        </TabsTrigger>
                        <TabsTrigger value="subjective" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Subjective ({answerSheet.answers.subjective.length})
                        </TabsTrigger>
                        <TabsTrigger value="code" className="gap-2">
                            <Code className="h-4 w-4" />
                            Code ({answerSheet.answers.code.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* MCQ Answers */}
                    <TabsContent value="mcq" className="space-y-4">
                        {answerSheet.answers.mcq.length === 0 ? (
                            <Card className="border-border">
                                <CardContent className="text-center py-8">
                                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No MCQ questions in this exam</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {answerSheet.answers.mcq.map((answer, index) => (
                                    <Card key={answer._id} className="border-l-4 border-l-blue-500 border-border">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <HelpCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                                    Question {index + 1}
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
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">Selected Answer:</span>
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
                                                        className={`font-semibold ${answer.isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                                                    >
                                                        {answer.isCorrect ? "Correct" : "Incorrect"}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Subjective Answers */}
                    <TabsContent value="subjective" className="space-y-4">
                        {answerSheet.answers.subjective.length === 0 ? (
                            <Card className="border-border">
                                <CardContent className="text-center py-8">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No subjective questions in this exam</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-6">
                                {answerSheet.answers.subjective.map((answer, index) => (
                                    <Card key={answer._id} className="border-l-4 border-l-green-500 border-border">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <FileText className="h-5 w-5 text-green-500 dark:text-green-400" />
                                                    Question {index + 1}
                                                </CardTitle>
                                                <Badge variant="outline" className="font-semibold">
                                                    {answer.marksAwarded} marks
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">Student Answer:</h4>
                                                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                                        {answer.answerText || "No answer provided"}
                                                    </p>
                                                </div>
                                            </div>

                                            {answer.aiFeedback && (
                                                <div>
                                                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                                        <MessageSquare className="h-4 w-4" />
                                                        AI Feedback:
                                                    </h4>
                                                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                                                        <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-400">
                                                            {answer.aiFeedback}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Code Answers */}
                    <TabsContent value="code" className="space-y-4">
                        {answerSheet.answers.code.length === 0 ? (
                            <Card className="border-border">
                                <CardContent className="text-center py-8">
                                    <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No coding questions in this exam</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-6">
                                {answerSheet.answers.code.map((answer, index) => (
                                    <Card key={answer._id} className="border-l-4 border-l-purple-500 border-border">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Code className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                                                    Coding Question {index + 1}
                                                </CardTitle>
                                                <Badge variant="outline" className="font-semibold">
                                                    {answer.marksAwarded} marks
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-400">Code Solution:</h4>
                                                <div className="bg-secondary text-secondary-foreground p-4 rounded-lg border font-mono text-sm overflow-x-auto">
                                                    <pre className="whitespace-pre-wrap">{answer.answerText || "// No code provided"}</pre>
                                                </div>
                                            </div>

                                            {answer.aiFeedback && (
                                                <div>
                                                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                                        <MessageSquare className="h-4 w-4" />
                                                        AI Code Review:
                                                    </h4>
                                                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                                                        <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-400">
                                                            {answer.aiFeedback}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

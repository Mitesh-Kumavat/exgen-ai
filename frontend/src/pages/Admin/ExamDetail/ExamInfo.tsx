import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, GraduationCap, Target, User, BookOpen } from "lucide-react"
import type { ExamDetail } from "@/types"

interface ExamInfoProps {
    exam: ExamDetail
}

export const ExamInfo = ({ exam }: ExamInfoProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Exam Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <BookOpen className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Subject</p>
                                <p className="font-medium">{exam.subject}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <GraduationCap className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Semester</p>
                                <p className="font-medium">{exam.semester}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Exam Date</p>
                                <p className="font-medium">{new Date(exam.examDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Duration</p>
                                <p className="font-medium">{exam.durationMinutes} minutes</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <Target className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Marks</p>
                                <p className="font-medium">{exam.totalMarks}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <Target className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Passing Marks</p>
                                <p className="font-medium">{exam.passingMarks}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Created By</p>
                                <p className="font-medium">{exam.createdBy.name}</p>
                                <p className="text-xs text-muted-foreground">{exam.createdBy.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Created At</p>
                                <p className="font-medium">{new Date(exam.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


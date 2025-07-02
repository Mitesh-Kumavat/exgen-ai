import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Target, BookOpen, Play } from "lucide-react"
import type { ExamData } from "@/types"

interface ExamCardProps {
    exam: ExamData
}

export const ExamCard = ({ exam }: ExamCardProps) => {
    const handleStartExam = () => {
        window.location.href = `/exam-window/${exam._id}`
    }

    return (
        <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">{exam.title}</CardTitle>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 ml-2">{exam.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{exam.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">{exam.subject}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-primary" />
                        <span>Sem {exam.semester}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{exam.durationMinutes} min</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-primary" />
                        <span>{exam.totalMarks} marks</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Exam Date: {new Date(exam.examDate).toLocaleDateString()}</span>
                </div>

                <div className="pt-2">
                    <Button onClick={handleStartExam} className="w-full gap-2" size="lg">
                        <Play className="h-4 w-4" />
                        Start Exam
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

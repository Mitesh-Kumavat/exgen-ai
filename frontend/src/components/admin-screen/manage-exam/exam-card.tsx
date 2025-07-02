import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, GraduationCap, Target, BookOpen } from "lucide-react"
import type { ExamData } from "@/pages/Admin/manage-exam"

interface ExamCardProps {
    exam: ExamData
    onStatusChange: (examId: string, newStatus: string) => void
    onViewDetails: (examId: string) => void
    onViewResult: (examId: string) => void
}

export const ExamCard = ({ exam, onStatusChange, onViewDetails, onViewResult }: ExamCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "draft":
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
            case "active":
                return "bg-green-100 text-green-800 hover:bg-green-200"
            case "completed":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }

    const getActionButton = () => {
        switch (exam.status.toLowerCase()) {
            case "draft":
                return (
                    <Button onClick={() => onStatusChange(exam._id, "active")} className="w-full cursor-pointer" variant="default">
                        Make Active
                    </Button>
                )
            case "active":
                return (
                    <Button onClick={() => onStatusChange(exam._id, "completed")} className="w-full cursor-pointer" variant="destructive">
                        End Exam
                    </Button>
                )
            case "completed":
                return (
                    <Button onClick={() => onViewResult(exam._id)} className="w-full cursor-pointer" variant="outline">
                        View Results
                    </Button>
                )
            default:
                return null
        }
    }

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold line-clamp-2">{exam.title}</CardTitle>
                    <Badge className={getStatusColor(exam.status)}>{exam.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{exam.description}</p>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">{exam.subject}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-primary" />
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
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-4">
                {getActionButton()}
                <Button onClick={() => onViewDetails(exam._id)} variant="secondary" className="w-full cursor-pointer">
                    View Details
                </Button>
            </CardFooter>
        </Card>
    )
}

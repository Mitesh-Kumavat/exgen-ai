import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Trash2, Play, Square, BarChart3 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { ExamDetail } from "@/types"

interface ExamHeaderProps {
    exam: ExamDetail
    onStatusChange: (status: string) => void
    onDelete: () => void
    onViewResults: () => void
}

export const ExamHeader = ({ exam, onStatusChange, onDelete, onViewResults }: ExamHeaderProps) => {
    const navigate = useNavigate()

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
                    <Button onClick={() => onStatusChange("active")} className="gap-2">
                        <Play className="h-4 w-4" />
                        Activate Exam
                    </Button>
                )
            case "active":
                return (
                    <Button onClick={() => onStatusChange("completed")} variant="destructive" className="gap-2">
                        <Square className="h-4 w-4" />
                        End Exam
                    </Button>
                )
            case "completed":
                return (
                    <Button onClick={onViewResults} variant="secondary" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        View Results
                    </Button>
                )
            default:
                return null
        }
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/manage-exams")} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Exams
                        </Button>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{exam.title}</h1>
                                <Badge className={getStatusColor(exam.status)}>{exam.status}</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm md:text-base max-w-2xl">{exam.description}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            {getActionButton()}
                            <Button
                                variant="outline"
                                onClick={onDelete}
                                className="gap-2 text-destructive hover:text-destructive bg-transparent"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Exam
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


import { deleteExam, getExamDetail, updateExamStatus } from "@/service/examService"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { extractErrorMessage } from "@/utils/errorHandler"
import { ExamHeader } from "@/components/exam-detail/exam-header"
import { ExamInfo } from "@/components/exam-detail/exam-info"
import { SyllabusSection } from "@/components/exam-detail/syllabus-section"
import { QuestionSchemaSection } from "@/components/exam-detail/question-schema-section"
import { DeleteConfirmationModal } from "@/components/exam-detail/delete-confirmation"
import { LoadingCard } from "@/components/exam-detail/loading-card"
import type { ExamDetail } from "@/types"

const ExamDetailPage = () => {
    const { examId } = useParams()
    const navigate = useNavigate()
    const [details, setDetails] = useState<ExamDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    useEffect(() => {
        if (!examId) {
            toast.error("Something went wrong. Can't find exam id.")
            return
        }

        const fetchExamDetail = async () => {
            try {
                setLoading(true)
                const examDetails = await getExamDetail(examId)
                setDetails(examDetails.data.data)
            } catch (error) {
                const err = extractErrorMessage(error, "Can't load the exam details. Try again later.")
                toast.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchExamDetail()
    }, [examId])

    const handleStatusChange = async (newStatus: string) => {
        if (!details) return

        try {
            const response = await updateExamStatus(details._id, newStatus);

            if (response.status === 200) {
                setDetails({ ...details, status: newStatus as "draft" | "active" | "completed" })
                toast.success(`Exam status updated to ${newStatus}`)
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to update exam status. Try again later.")
            toast.error(err)
        }
    }

    const handleDelete = async () => {
        if (!details) return

        try {
            const response = await deleteExam(details._id);
            if (response.status === 200) {
                toast.success("Exam deleted successfully")
                navigate("/dashboard")
            }
        } catch (error) {
            toast.error("Failed to delete exam")
        }
    }

    const handleViewResults = () => {
        if (details) {
            navigate(`/dashboard/manage-exams/${details._id}/result`)
        }
    }

    if (loading) {
        return <LoadingCard />
    }

    if (!details) {
        return (
            <div className="container mx-auto p-6 pb-2">
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">Exam not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <ExamHeader
                exam={details}
                onStatusChange={handleStatusChange}
                onDelete={() => setDeleteModalOpen(true)}
                onViewResults={handleViewResults}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ExamInfo exam={details} />
                    <SyllabusSection syllabusData={details.syllabusData} />
                </div>
                <div className="space-y-6">
                    <QuestionSchemaSection questionSchema={details.questionSchema} />
                </div>
            </div>

            <DeleteConfirmationModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleDelete}
                examTitle={details.title}
            />
        </div>
    )
}

export default ExamDetailPage

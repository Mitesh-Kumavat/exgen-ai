"use client"

import { getAllExamData, updateExamStatus } from "@/service/examService"
import { useEffect, useState } from "react"
import { ExamCard } from "./ExamCard"
import { SearchAndFilter } from "./SearchAndFilter"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { extractErrorMessage } from "@/utils/errorHandler"

export interface ExamData {
    _id: string
    title: string
    description: string
    subject: string
    semester: number
    durationMinutes: number
    totalMarks: number
    passingMarks: number
    examDate: string
    createdAt: string
    createdBy: string
    status: string
}

const ManageExams = () => {
    const [exams, setExams] = useState<ExamData[]>([])
    const [filteredExams, setFilteredExams] = useState<ExamData[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExams = async () => {
            setLoading(true)
            try {
                const response = await getAllExamData(statusFilter)
                setExams(response.data.data)
            } catch (error) {
                const err = extractErrorMessage(error, "Failed to fetch exams. Try again later.")
                toast.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchExams()
    }, [statusFilter])

    useEffect(() => {
        let filtered = exams

        if (searchQuery) {
            filtered = filtered.filter(
                (exam) =>
                    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    exam.subject.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        setFilteredExams(filtered)
    }, [exams, searchQuery])

    const handleStatusChange = async (examId: string, newStatus: string) => {
        try {
            const response = await updateExamStatus(examId, newStatus)

            if (response.status === 200) {
                setExams((prevExams) => prevExams.map((exam) => (exam._id === examId ? { ...exam, status: newStatus } : exam)))
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to update exam status.")
            toast.error(err)
            console.error(err)
        }
    }

    const handleViewDetails = (examId: string) => {
        navigate(`/manage-exams/${examId}`);
    }

    const handleViewResult = (examId: string) => {
        navigate(`/manage-exams/${examId}/result`);
    }

    return (
        <div className="container mx-auto p-6 space-y-6 max-sm:p-2">
            <div className="flex flex-col space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Manage Exams</h1>
                <p className="text-muted-foreground">Manage and monitor all your exams in one place</p>
            </div>

            <SearchAndFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground">Loading exams...</p>
                    </div>
                </div>
            ) : filteredExams.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No exams found</p>
                    <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filter criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExams.map((exam) => (
                        <ExamCard
                            key={exam._id}
                            exam={exam}
                            onStatusChange={handleStatusChange}
                            onViewDetails={handleViewDetails}
                            onViewResult={handleViewResult}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ManageExams

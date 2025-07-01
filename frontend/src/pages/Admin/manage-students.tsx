import { useState, useEffect } from "react"
import { toast } from "sonner"
import { StudentsTable } from "@/components/students/students-table"
import { AddStudentModal } from "@/components/students/add-student-modal"
import { ConfirmationModal } from "@/components/students/confirmation-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Key, Mail, Trash2 } from "lucide-react"
import type { Student } from "@/types"
import { addStudent, bulkCSVUpload, deleteAllStudents, deleteStudentById, generateRandomPasswords, getAllStudents, mailCredentials } from "@/service/studentService"
import { extractErrorMessage } from "@/utils/errorHandler"

const ManageStudents = () => {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false)
    const [generatingPasswords, setGeneratingPasswords] = useState(false)
    const [sendingCredentials, setSendingCredentials] = useState(false)

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await getAllStudents();
            if (data.status === 200) {
                setStudents(data.data.data)
            } else {
                toast.error("Failed to fetch students")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to fetch students");
            toast.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAddStudent = async (studentData: Omit<Student, "_id" | "createdAt" | "updatedAt">) => {
        try {
            const data = await addStudent(studentData);
            console.log("Add Student Response:", studentData);

            if (data.status === 201) {
                toast.success("Student added successfully")
                fetchStudents()
                setAddModalOpen(false)
            } else {
                toast.error("Failed to add student")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to add student");
            toast.error(err)
        }
    }

    const handleBulkAddStudents = async (file: File) => {
        try {
            const data = await bulkCSVUpload(file)
            if (data.status === 201) {
                toast.success("Students added successfully")
                fetchStudents()
                setAddModalOpen(false)
            } else {
                toast.error("Failed to add students")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to add students via CSV");
            toast.error(err)
        }
    }

    const handleDeleteStudent = async (studentId: string) => {
        try {
            const data = await deleteStudentById(studentId)

            if (data.status === 200) {
                toast.success("Student deleted successfully")
                setStudents(students.filter(student => student._id !== studentId))
            } else {
                toast.error("Failed to delete student")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to delete student");
            toast.error(err)
        }
    }

    const handleDeleteAllStudents = async () => {
        try {
            const data = await deleteAllStudents();

            if (data.status === 200) {
                toast.success("All students deleted successfully")
                setStudents([])
                setDeleteAllModalOpen(false)
            } else {
                toast.error("Failed to delete students")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to delete students");
            toast.error(err)
        }
    }

    const handleGeneratePasswords = async () => {
        try {
            setGeneratingPasswords(true)
            const data = await generateRandomPasswords()
            if (data.status === 200) {
                toast.success("Passwords generated successfully")
            } else {
                toast.error("Failed to generate passwords")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to generate passwords");
            toast.error(err)
        } finally {
            setGeneratingPasswords(false)
        }
    }

    const handleSendCredentials = async () => {
        try {
            setSendingCredentials(true)
            const data = await mailCredentials()
            if (data.status === 200) {
                toast.success("Credentials sent successfully")
            } else {
                toast.error("Failed to send credentials")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to send credentials");
            toast.error(err)
        } finally {
            setSendingCredentials(false)
        }
    }

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage Students</h1>
                        <p className="text-muted-foreground">Manage student accounts and credentials</p>
                    </div>
                    <Button onClick={() => setAddModalOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Student
                    </Button>
                </div>

                {/* Stats Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="h-5 w-5" />
                            Students Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-2">
                                <div className="text-2xl font-bold">{students.length}</div>
                                <div className="text-sm text-muted-foreground">Total Students</div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    onClick={handleGeneratePasswords}
                                    disabled={students.length === 0 || generatingPasswords}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 bg-transparent"
                                >
                                    <Key className="h-4 w-4" />
                                    {generatingPasswords ? "Generating..." : "Generate Passwords"}
                                </Button>
                                <Button
                                    onClick={handleSendCredentials}
                                    disabled={students.length === 0 || sendingCredentials}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 bg-transparent"
                                >
                                    <Mail className="h-4 w-4" />
                                    {sendingCredentials ? "Sending..." : "Send Credentials"}
                                </Button>
                                <Button
                                    onClick={() => setDeleteAllModalOpen(true)}
                                    disabled={students.length === 0}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete All
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Students Table */}
            <StudentsTable students={students} loading={loading} onDeleteStudent={handleDeleteStudent} />

            {/* Modals */}
            <AddStudentModal
                open={addModalOpen}
                onOpenChange={setAddModalOpen}
                onAddStudent={handleAddStudent}
                onBulkAddStudents={handleBulkAddStudents}
            />

            <ConfirmationModal
                open={deleteAllModalOpen}
                onOpenChange={setDeleteAllModalOpen}
                onConfirm={handleDeleteAllStudents}
                title="Delete All Students"
                description={`Are you sure you want to delete all ${students.length} students? This action cannot be undone.`}
                confirmText="Delete All"
                variant="destructive"
            />
        </div>
    )
}

export default ManageStudents

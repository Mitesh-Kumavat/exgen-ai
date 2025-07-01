"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ConfirmationModal } from "./confirmation-modal"
import { Search, Trash2, Users, Mail, Phone } from "lucide-react"
import type { Student } from "@/types"

interface StudentsTableProps {
    students: Student[]
    loading: boolean
    onDeleteStudent: (studentId: string) => void
}

export const StudentsTable = ({ students, loading, onDeleteStudent }: StudentsTableProps) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.enrollmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.branch.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const handleDeleteClick = (student: Student) => {
        setStudentToDelete(student)
        setDeleteModalOpen(true)
    }

    const handleConfirmDelete = () => {
        if (studentToDelete) {
            onDeleteStudent(studentToDelete._id)
            setDeleteModalOpen(false)
            setStudentToDelete(null)
        }
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Students List
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center space-y-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="text-muted-foreground">Loading students...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Students List ({filteredStudents.length})
                        </CardTitle>
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground text-lg">
                                {students.length === 0 ? "No students found" : "No students match your search"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                {students.length === 0 ? "Add students to get started" : "Try adjusting your search criteria"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Enrollment No.</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                                        <TableHead className="hidden md:table-cell">Mobile</TableHead>
                                        <TableHead className="hidden lg:table-cell">Created At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((student) => (
                                        <TableRow key={student._id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{student.name}</span>
                                                    <span className="sm:hidden text-xs text-muted-foreground">{student.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    {student.enrollmentNumber}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{student.branch}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">{student.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">{student.mobile}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                                {new Date(student.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(student)}
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <ConfirmationModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Student"
                description={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
                confirmText="Delete Student"
                variant="destructive"
            />
        </>
    )
}

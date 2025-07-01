"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Upload, UserPlus, FileText } from "lucide-react"
import type { Student } from "@/types"

interface AddStudentModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddStudent: (student: Omit<Student, "_id" | "createdAt" | "updatedAt">) => void
    onBulkAddStudents: (file: File) => void
}

export const AddStudentModal = ({ open, onOpenChange, onAddStudent, onBulkAddStudents }: AddStudentModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        enrollmentNumber: "",
        branch: "",
        email: "",
        mobile: "",
        semester: "",
    })
    const [csvFile, setCsvFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.enrollmentNumber || !formData.branch || !formData.email || !formData.mobile) {
            toast.error("Please fill in all fields")
            return
        }

        setLoading(true)
        try {
            await onAddStudent(formData)
            setFormData({
                name: "",
                enrollmentNumber: "",
                branch: "",
                email: "",
                mobile: "",
                semester: "",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCsvUpload = async () => {
        if (!csvFile) {
            toast.error("Please select a CSV file")
            return
        }

        setLoading(true)
        try {
            await onBulkAddStudents(csvFile)
            setCsvFile(null)
        } catch (error) {
            const err = error instanceof Error ? error.message : "Failed to upload CSV"
            toast.error(err)
            console.error("CSV Upload Error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type === "text/csv") {
            setCsvFile(file)
        } else {
            toast.error("Please select a valid CSV file")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Students</DialogTitle>
                    <DialogDescription>Add students individually or upload a CSV file with multiple students</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="manual" className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Manual Entry
                        </TabsTrigger>
                        <TabsTrigger value="csv" className="gap-2">
                            <Upload className="h-4 w-4" />
                            CSV Upload
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Add Single Student</CardTitle>
                                <CardDescription>Enter student details manually</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleManualSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                placeholder="Enter full name"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                                            <Input
                                                id="enrollmentNumber"
                                                value={formData.enrollmentNumber}
                                                onChange={(e) => handleInputChange("enrollmentNumber", e.target.value)}
                                                placeholder="Enter enrollment number"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="branch">Branch</Label>
                                            <Input
                                                id="branch"
                                                value={formData.branch}
                                                onChange={(e) => handleInputChange("branch", e.target.value)}
                                                placeholder="e.g., IT, CSE, ECE"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mobile">Mobile Number</Label>
                                            <Input
                                                id="mobile"
                                                value={formData.mobile}
                                                onChange={(e) => handleInputChange("mobile", e.target.value)}
                                                placeholder="Enter mobile number"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                placeholder="Enter email address"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={loading} className="w-full">
                                        {loading ? "Adding Student..." : "Add Student"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="csv" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Upload CSV File</CardTitle>
                                <CardDescription>Upload a CSV file with multiple students</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="csvFile">Select CSV File</Label>
                                    <Input id="csvFile" type="file" accept=".csv" onChange={handleFileChange} />
                                    {csvFile && <p className="text-sm text-muted-foreground">Selected: {csvFile.name}</p>}
                                </div>

                                <div className="bg-muted p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="h-4 w-4" />
                                        <span className="font-medium text-sm">CSV Format Requirements:</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>• Headers: name, enrollmentNumber, branch, email, mobile</p>
                                        <p>• Example row: "John Doe,23002170210001,IT,john@example.com,9999999999"</p>
                                        <p>• Make sure there are no empty rows</p>
                                    </div>
                                </div>

                                <Button onClick={handleCsvUpload} disabled={!csvFile || loading} className="w-full">
                                    {loading ? "Processing CSV..." : "Upload Students"}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

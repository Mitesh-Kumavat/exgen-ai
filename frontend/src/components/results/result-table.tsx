import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Users, Mail, ArrowUp, ArrowDown } from "lucide-react"
import type { ExamResult, ExamStats } from "@/types/result"

interface ResultsTableProps {
    results: ExamResult[]
    onViewAnswerSheet: (answerSheetId: string) => void
    examInfo: ExamStats | null
}

type SortField = "marks" | "enrollment"
type SortOrder = "asc" | "desc"

export const ResultsTable = ({ results, onViewAnswerSheet, examInfo }: ResultsTableProps) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [sortField, setSortField] = useState<SortField>("marks")
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

    const filteredResults = results.filter((result) => {
        const matchesSearch =
            result.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.student.enrollmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.student.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory = categoryFilter === "all" || result.category === categoryFilter

        return matchesSearch && matchesCategory
    })

    const sortedResults = [...filteredResults].sort((a, b) => {
        let comparison = 0

        if (sortField === "marks") {
            comparison = a.achievedMarks - b.achievedMarks
        } else if (sortField === "enrollment") {
            comparison = a.student.enrollmentNumber.localeCompare(b.student.enrollmentNumber)
        }

        return sortOrder === "asc" ? comparison : -comparison
    })

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }

    const getSortIcon = () => {
        if (sortOrder === "asc") {
            return <ArrowUp className="h-4 w-4" />
        } else {
            return <ArrowDown className="h-4 w-4" />
        }
    }

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case "excellent":
                return "bg-green-100 text-green-800 hover:bg-green-200 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
            case "good":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
            case "average":
                return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700"
            case "weak":
                return "bg-red-100 text-red-800 hover:bg-red-200 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
        }
    }

    const getPassStatus = (achievedMarks: number) => {
        if (!examInfo) return false
        const passingMarks = examInfo.totalMarks * 0.4
        return achievedMarks >= passingMarks
    }

    const getGrade = (achievedMarks: number, totalMarks: number) => {
        const percentage = (achievedMarks / totalMarks) * 100
        if (percentage >= 90) return { grade: "A+", color: "text-green-600 dark:text-green-400" }
        if (percentage >= 80) return { grade: "A", color: "text-green-500 dark:text-green-400" }
        if (percentage >= 70) return { grade: "B+", color: "text-blue-600 dark:text-blue-400" }
        if (percentage >= 60) return { grade: "B", color: "text-blue-500 dark:text-blue-400" }
        if (percentage >= 50) return { grade: "C", color: "text-yellow-600 dark:text-yellow-400" }
        if (percentage >= 40) return { grade: "D", color: "text-orange-600 dark:text-orange-400" }
        return { grade: "F", color: "text-red-600 dark:text-red-400" }
    }

    return (
        <Card className="shadow-lg border-border">
            <CardHeader className="bg-muted/50 border-b border-border">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Users className="h-5 w-5 text-primary" />
                        Student Results ({sortedResults.length})
                    </CardTitle>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 w-full sm:w-64"
                            />
                        </div>

                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="excellent">Excellent</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="average">Average</SelectItem>
                                <SelectItem value="weak">Weak</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                            <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
                                <SelectTrigger className="w-full sm:w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="marks">By Marks</SelectItem>
                                    <SelectItem value="enrollment">By Enrollment</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="sm" onClick={toggleSortOrder} className="px-3 bg-transparent">
                                {getSortIcon()}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="sm:px-4">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead className="font-semibold">Student</TableHead>
                                <TableHead className="font-semibold">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSortField("enrollment")
                                            if (sortField === "enrollment") toggleSortOrder()
                                        }}
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                    >
                                        Enrollment
                                        {sortField === "enrollment" && <span className="ml-1 text-primary">{getSortIcon()}</span>}
                                    </Button>
                                </TableHead>
                                <TableHead className="hidden md:table-cell font-semibold">Email</TableHead>
                                <TableHead className="font-semibold">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSortField("marks")
                                            if (sortField === "marks") toggleSortOrder()
                                        }}
                                        className="h-auto p-0 font-semibold hover:bg-transparent"
                                    >
                                        Score
                                        {sortField === "marks" && <span className="ml-1 text-primary">{getSortIcon()}</span>}
                                    </Button>
                                </TableHead>
                                <TableHead className="font-semibold">Grade</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Category</TableHead>
                                <TableHead className="hidden lg:table-cell font-semibold">Submitted</TableHead>
                                <TableHead className="text-right font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedResults.map((result, _index) => {
                                const percentage = examInfo ? Math.round((result.achievedMarks / examInfo.totalMarks) * 100) : 0
                                const grade = examInfo
                                    ? getGrade(result.achievedMarks, examInfo.totalMarks)
                                    : { grade: "N/A", color: "text-muted-foreground" }
                                const isPassed = getPassStatus(result.achievedMarks)

                                return (
                                    <TableRow key={result._id} className="hover:bg-muted/50 transition-colors border-b border-border">
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{result.student.name}</span>
                                                <span className="md:hidden text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {result.student.email}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {result.student.enrollmentNumber}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex items-center gap-1 text-sm">
                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                {result.student.email}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-lg">
                                                    {result.achievedMarks}
                                                    <span className="text-muted-foreground font-normal">/{examInfo?.totalMarks || 0}</span>
                                                </span>
                                                <span className="text-xs text-muted-foreground">{percentage}%</span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="outline" className={`font-bold ${grade.color} border-current`}>
                                                {grade.grade}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                className={
                                                    isPassed
                                                        ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                                                        : "bg-red-100 text-red-800 hover:bg-red-200 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
                                                }
                                            >
                                                {isPassed ? "PASS" : "FAIL"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <Badge className={getCategoryColor(result.category)}>{result.category.toUpperCase()}</Badge>
                                        </TableCell>

                                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                            {new Date(result.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onViewAnswerSheet(result.answerSheet)}
                                                className="gap-2 hover:bg-primary/10 hover:text-primary"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="hidden sm:inline">View</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

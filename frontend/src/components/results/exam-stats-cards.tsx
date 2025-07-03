import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, UserCheck, UserX, Target, Clock, FileText, Award } from "lucide-react"
import type { ExamStats } from "@/types/result"

interface ExamStatsCardsProps {
    stats: ExamStats
}

export const ExamStatsCards = ({ stats }: ExamStatsCardsProps) => {
    const passRate = stats.enrolledStudents > 0 ? Math.round((stats.passStudents / stats.enrolledStudents) * 100) : 0

    const submissionRate =
        stats.enrolledStudents > 0 ? Math.round((stats.submittedExamPapers / stats.enrolledStudents) * 100) : 0

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Students */}
            <Card className="border-l-4 border-l-blue-500 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.enrolledStudents}</div>
                    <p className="text-xs text-muted-foreground">Enrolled in this exam</p>
                </CardContent>
            </Card>

            {/* Pass Rate */}
            <Card className="border-l-4 border-l-green-500 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                    <UserCheck className="h-4 w-4 text-green-500 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{passRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        {stats.passStudents} of {stats.enrolledStudents} passed
                    </p>
                    <Progress value={passRate} className="mt-2" />
                </CardContent>
            </Card>

            {/* Average Score */}
            <Card className="border-l-4 border-l-purple-500 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <Target className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {Number.parseFloat(stats.averageMarks).toFixed(1)}
                    </div>
                    <p className="text-xs text-muted-foreground">Out of {stats.totalMarks} marks</p>
                    <Progress value={(Number.parseFloat(stats.averageMarks) / stats.totalMarks) * 100} className="mt-2" />
                </CardContent>
            </Card>

            {/* Submission Rate */}
            <Card className="border-l-4 border-l-orange-500 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Submission Rate</CardTitle>
                    <FileText className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{submissionRate}%</div>
                    <p className="text-xs text-muted-foreground">{stats.submittedExamPapers} submissions</p>
                    <Progress value={submissionRate} className="mt-2" />
                </CardContent>
            </Card>

            {/* Additional Stats Row */}
            <Card className="sm:col-span-2 lg:col-span-1 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Failed Students</CardTitle>
                    <UserX className="h-4 w-4 text-red-500 dark:text-red-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failStudents}</div>
                    <p className="text-xs text-muted-foreground">Need improvement</p>
                </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Duration</CardTitle>
                    <Clock className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.duration}</div>
                    <p className="text-xs text-muted-foreground">Minutes allocated</p>
                </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-2 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Exam Overview</CardTitle>
                    <Award className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">Semester {stats.semester}</div>
                            <p className="text-xs text-muted-foreground">Academic level</p>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.totalMarks}</div>
                            <p className="text-xs text-muted-foreground">Total marks</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

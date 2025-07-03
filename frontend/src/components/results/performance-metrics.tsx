import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, Target } from "lucide-react"
import type { ExamResult, ExamInfo } from "@/types/result"

interface PerformanceMetricsProps {
    results: ExamResult[]
    examInfo: ExamInfo | null
}

export const PerformanceMetrics = ({ results, examInfo }: PerformanceMetricsProps) => {
    if (!examInfo) return null

    const totalStudents = results.length
    const passedStudents = results.filter((r) => r.achievedMarks >= examInfo.passingMarks).length
    const passRate = Math.round((passedStudents / totalStudents) * 100)
    const averageScore = Math.round(results.reduce((sum, r) => sum + r.achievedMarks, 0) / totalStudents)
    const averagePercentage = Math.round((averageScore / examInfo.totalMarks) * 100)

    const categoryStats = results.reduce(
        (acc, result) => {
            acc[result.category] = (acc[result.category] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                    {passRate >= 70 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{passRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        {passedStudents} of {totalStudents} students passed
                    </p>
                    <Progress value={passRate} className="mt-2" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <Target className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{averageScore}</div>
                    <p className="text-xs text-muted-foreground">{averagePercentage}% of total marks</p>
                    <Progress value={averagePercentage} className="mt-2" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                    <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{categoryStats.excellent || 0}</div>
                    <p className="text-xs text-muted-foreground">Excellent category students</p>
                    <Progress value={Math.round(((categoryStats.excellent || 0) / totalStudents) * 100)} className="mt-2" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Need Improvement</CardTitle>
                    <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{categoryStats.weak || 0}</div>
                    <p className="text-xs text-muted-foreground">Weak category students</p>
                    <Progress value={Math.round(((categoryStats.weak || 0) / totalStudents) * 100)} className="mt-2" />
                </CardContent>
            </Card>
        </div>
    )
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
} from "recharts"
import { BarChart3, PieChartIcon, TrendingUp, Users } from "lucide-react"
import type { ExamResult, ExamStats } from "@/types/result"

interface AnalyticsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    results: ExamResult[]
    stats: ExamStats | null
}

export const AnalyticsModal = ({ open, onOpenChange, results, stats }: AnalyticsModalProps) => {
    if (!stats) return null

    const scoreRanges = [
        { range: "0-20%", min: 0, max: stats.totalMarks * 0.2, color: "#ef4444" },
        { range: "21-40%", min: stats.totalMarks * 0.2, max: stats.totalMarks * 0.4, color: "#f97316" },
        { range: "41-60%", min: stats.totalMarks * 0.4, max: stats.totalMarks * 0.6, color: "#eab308" },
        { range: "61-80%", min: stats.totalMarks * 0.6, max: stats.totalMarks * 0.8, color: "#22c55e" },
        { range: "81-100%", min: stats.totalMarks * 0.8, max: stats.totalMarks, color: "#16a34a" },
    ]

    const scoreDistribution = scoreRanges.map((range) => ({
        range: range.range,
        count: results.filter((r) => r.achievedMarks > range.min && r.achievedMarks <= range.max).length,
        color: range.color,
    }))

    const categoryData = results.reduce(
        (acc, result) => {
            acc[result.category] = (acc[result.category] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
        name: category,
        value: count,
        percentage: Math.round((count / results.length) * 100),
    }))

    const CATEGORY_COLORS = {
        excellent: "#16a34a",
        good: "#2563eb",
        average: "#eab308",
        weak: "#ef4444",
    }

    const gradeData = results.reduce(
        (acc, result) => {
            const percentage = (result.achievedMarks / stats.totalMarks) * 100
            let grade = "F"
            if (percentage >= 90) grade = "A+"
            else if (percentage >= 80) grade = "A"
            else if (percentage >= 70) grade = "B+"
            else if (percentage >= 60) grade = "B"
            else if (percentage >= 50) grade = "C"
            else if (percentage >= 40) grade = "D"

            acc[grade] = (acc[grade] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const gradeChartData = Object.entries(gradeData).map(([grade, count]) => ({
        grade,
        count,
        percentage: Math.round((count / results.length) * 100),
    }))

    const scores = results.map((r) => r.achievedMarks)
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
    const sortedScores = [...scores].sort((a, b) => a - b)
    const median =
        sortedScores.length % 2 === 0
            ? (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2
            : sortedScores[Math.floor(sortedScores.length / 2)]

    const variance = scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scores.length
    const standardDeviation = Math.sqrt(variance)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:min-w-[1100px] sm:min-w-[600px] h-[90vh] max-h-[900px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                        Exam Analytics - {stats.examName}
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="distribution">Distribution</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="insights">Insights</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="border-border">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.length}</div>
                                    <p className="text-sm text-muted-foreground">Total Submissions</p>
                                </CardContent>
                            </Card>
                            <Card className="border-border">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{mean.toFixed(1)}</div>
                                    <p className="text-sm text-muted-foreground">Average Score</p>
                                </CardContent>
                            </Card>
                            <Card className="border-border">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{median.toFixed(1)}</div>
                                    <p className="text-sm text-muted-foreground">Median Score</p>
                                </CardContent>
                            </Card>
                            <Card className="border-border">
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{Math.max(...scores)}</div>
                                    <p className="text-sm text-muted-foreground">Highest Score</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="border-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Score Distribution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={scoreDistribution}>
                                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                            <XAxis dataKey="range" className="text-xs" />
                                            <YAxis className="text-xs" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--background))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "6px",
                                                }}
                                            />
                                            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChartIcon className="h-5 w-5" />
                                        Performance Categories
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <PieChart>
                                            <Pie
                                                data={categoryChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percentage }) => `${name}: ${percentage}%`}
                                                outerRadius={120}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {categoryChartData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={CATEGORY_COLORS[entry.name.toLowerCase() as keyof typeof CATEGORY_COLORS]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--background))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "6px",
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="distribution" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="border-border">
                                <CardHeader>
                                    <CardTitle>Grade Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={gradeChartData}>
                                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                            <XAxis dataKey="grade" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value) => [value, "Students"]}
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--background))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "6px",
                                                }}
                                            />
                                            <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border-border">
                                <CardHeader>
                                    <CardTitle>Score Range Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <AreaChart data={scoreDistribution}>
                                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                            <XAxis dataKey="range" />
                                            <YAxis />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "hsl(var(--background))",
                                                    border: "1px solid hsl(var(--border))",
                                                    borderRadius: "6px",
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="count"
                                                stroke="hsl(var(--chart-3))"
                                                fill="hsl(var(--chart-3))"
                                                fillOpacity={0.3}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Statistical Measures</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Mean:</span>
                                        <span className="font-semibold">{mean.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Median:</span>
                                        <span className="font-semibold">{median.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Std. Deviation:</span>
                                        <span className="font-semibold">{standardDeviation.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Range:</span>
                                        <span className="font-semibold">{Math.max(...scores) - Math.min(...scores)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Score Extremes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Highest:</span>
                                        <span className="font-semibold text-green-600">{Math.max(...scores)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Lowest:</span>
                                        <span className="font-semibold text-red-600">{Math.min(...scores)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Q1 (25%):</span>
                                        <span className="font-semibold">{sortedScores[Math.floor(scores.length * 0.25)]}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Q3 (75%):</span>
                                        <span className="font-semibold">{sortedScores[Math.floor(scores.length * 0.75)]}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Pass/Fail Analysis</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Pass Rate:</span>
                                        <span className="font-semibold text-green-600">
                                            {Math.round((stats.passStudents / stats.enrolledStudents) * 100)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Passed:</span>
                                        <span className="font-semibold text-green-600">{stats.passStudents}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Failed:</span>
                                        <span className="font-semibold text-red-600">{stats.failStudents}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Submission Rate:</span>
                                        <span className="font-semibold">
                                            {Math.round((stats.submittedExamPapers / stats.enrolledStudents) * 100)}%
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="insights" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Key Insights
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <h4 className="font-semibold text-blue-800 mb-2">Performance Summary</h4>
                                        <p className="text-sm text-blue-700">
                                            The average score is {mean.toFixed(1)} out of {stats.totalMarks}, indicating{" "}
                                            {mean / stats.totalMarks > 0.7 ? "good" : mean / stats.totalMarks > 0.5 ? "average" : "poor"}{" "}
                                            overall performance.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <h4 className="font-semibold text-green-800 mb-2">Pass Rate Analysis</h4>
                                        <p className="text-sm text-green-700">
                                            {stats.passStudents} out of {stats.enrolledStudents} students passed (
                                            {Math.round((stats.passStudents / stats.enrolledStudents) * 100)}% pass rate).
                                        </p>
                                    </div>

                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <h4 className="font-semibold text-purple-800 mb-2">Score Distribution</h4>
                                        <p className="text-sm text-purple-700">
                                            Most students scored in the{" "}
                                            {scoreDistribution.reduce((max, current) => (current.count > max.count ? current : max)).range}{" "}
                                            range.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Recommendations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {stats.failStudents > 0 && (
                                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                            <h4 className="font-semibold text-red-800 mb-2">Students Need Support</h4>
                                            <p className="text-sm text-red-700">
                                                {stats.failStudents} students failed. Consider providing additional support or remedial classes.
                                            </p>
                                        </div>
                                    )}

                                    {standardDeviation > stats.totalMarks * 0.2 && (
                                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <h4 className="font-semibold text-yellow-800 mb-2">High Score Variation</h4>
                                            <p className="text-sm text-yellow-700">
                                                Large variation in scores suggests diverse preparation levels among students.
                                            </p>
                                        </div>
                                    )}

                                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                        <h4 className="font-semibold text-indigo-800 mb-2">Next Steps</h4>
                                        <ul className="text-sm text-indigo-700 space-y-1">
                                            <li>• Review questions with low success rates</li>
                                            <li>• Provide feedback to students</li>
                                            <li>• Plan remedial sessions if needed</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

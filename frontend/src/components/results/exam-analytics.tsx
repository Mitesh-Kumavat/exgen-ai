import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScoreDistributionChart } from "./score-distribution-chart"
import { CategoryAnalysisChart } from "./category-analysis-chart"
import { PerformanceMetrics } from "./performance-metrics"
import { BarChart3, PieChart, TrendingUp } from "lucide-react"
import type { ExamResult, ExamInfo } from "@/types/result"

interface ExamAnalyticsProps {
    results: ExamResult[]
    examInfo: ExamInfo | null
}

export const ExamAnalytics = ({ results, examInfo }: ExamAnalyticsProps) => {
    if (results.length === 0) {
        return (
            <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No data available for analysis</p>
                <p className="text-sm text-muted-foreground mt-2">Results will appear here once students complete the exam</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Performance Metrics */}
            <PerformanceMetrics results={results} examInfo={examInfo} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Score Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Score Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScoreDistributionChart results={results} examInfo={examInfo} />
                    </CardContent>
                </Card>

                {/* Category Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5" />
                            Performance Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoryAnalysisChart results={results} />
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Detailed Statistics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Highest Score</p>
                            <p className="text-2xl font-bold text-green-600">{Math.max(...results.map((r) => r.achievedMarks))}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Lowest Score</p>
                            <p className="text-2xl font-bold text-red-600">{Math.min(...results.map((r) => r.achievedMarks))}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Standard Deviation</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {(() => {
                                    const scores = results.map((r) => r.achievedMarks)
                                    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
                                    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length
                                    return Math.round(Math.sqrt(variance) * 100) / 100
                                })()}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Median Score</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {(() => {
                                    const sorted = [...results.map((r) => r.achievedMarks)].sort((a, b) => a - b)
                                    const mid = Math.floor(sorted.length / 2)
                                    return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
                                })()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

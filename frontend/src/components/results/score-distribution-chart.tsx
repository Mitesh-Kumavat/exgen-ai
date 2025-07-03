import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { ExamResult, ExamInfo } from "@/types/result"

interface ScoreDistributionChartProps {
    results: ExamResult[]
    examInfo: ExamInfo | null
}

export const ScoreDistributionChart = ({ results, examInfo }: ScoreDistributionChartProps) => {
    // Create score ranges
    const createScoreRanges = () => {
        if (!examInfo) return []

        const totalMarks = examInfo.totalMarks
        const rangeSize = Math.ceil(totalMarks / 10) // Create 10 ranges
        const ranges = []

        for (let i = 0; i < totalMarks; i += rangeSize) {
            const start = i
            const end = Math.min(i + rangeSize - 1, totalMarks)
            const count = results.filter((r) => r.achievedMarks >= start && r.achievedMarks <= end).length

            ranges.push({
                range: `${start}-${end}`,
                count,
                percentage: Math.round((count / results.length) * 100),
            })
        }

        return ranges
    }

    const data = createScoreRanges()

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        formatter={(value, name) => [value, name === "count" ? "Students" : name]}
                        labelFormatter={(label) => `Score Range: ${label}`}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Students" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

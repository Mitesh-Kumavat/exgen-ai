import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { ExamResult } from "@/types/result"

interface CategoryAnalysisChartProps {
    results: ExamResult[]
}

export const CategoryAnalysisChart = ({ results }: CategoryAnalysisChartProps) => {
    const categoryData = results.reduce(
        (acc, result) => {
            const category = result.category
            acc[category] = (acc[category] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const data = Object.entries(categoryData).map(([category, count]) => ({
        name: category,
        value: count,
        percentage: Math.round((count / results.length) * 100),
    }))

    const COLORS = {
        excellent: "#10b981",
        good: "#3b82f6",
        average: "#f59e0b",
        weak: "#ef4444",
    }

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || "#8884d8"} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, _name) => [value, "Students"]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

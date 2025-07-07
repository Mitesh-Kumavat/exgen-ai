import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, FileText, Activity, MessageSquare, AlertTriangle } from "lucide-react"
import type { Stats } from "@/pages/Admin/dashboard"

interface DashboardStatsProps {
    stats: Stats | null
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    const statsCards = [
        {
            title: "Total Exams",
            value: stats?.totalExams || 0,
            subtitle: "All exams in system",
            icon: BookOpen,
            borderColor: "border-l-blue-500",
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
        },
        {
            title: "Active Exams",
            value: stats?.activeExamsCount || 0,
            subtitle: "Currently running",
            icon: Activity,
            borderColor: "border-l-green-500",
            iconColor: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-950/20",
        },
        {
            title: "Total Students",
            value: stats?.studentsCount || 0,
            subtitle: "Registered students",
            icon: Users,
            borderColor: "border-l-purple-500",
            iconColor: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/20",
        },
        {
            title: "Answer Sheets",
            value: stats?.answerSheetsCount || 0,
            subtitle: "Submitted responses",
            icon: FileText,
            borderColor: "border-l-indigo-500",
            iconColor: "text-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
        },
        {
            title: "Total Queries",
            value: stats?.totalQueries || 0,
            subtitle: "Student queries raised",
            icon: MessageSquare,
            borderColor: "border-l-cyan-500",
            iconColor: "text-cyan-600",
            bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
        },
        {
            title: "Pending Queries",
            value: stats?.pendingQueries || 0,
            subtitle: "Awaiting resolution",
            icon: AlertTriangle,
            borderColor: "border-l-orange-500",
            iconColor: "text-orange-600",
            bgColor: "bg-orange-50 dark:bg-orange-950/20",
            isUrgent: (stats?.pendingQueries || 0) > 0,
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {statsCards.map((stat, index) => (
                <Card key={index} className={`border ${stat.borderColor} border-l-4 ${stat.isUrgent ? "shadow-md" : ""}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                            {stat.isUrgent && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                                    Urgent
                                </span>
                            )}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                            <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground mb-1">{stat.value.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

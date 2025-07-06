import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MessageSquareIcon as MessageSquareQuestion, CheckCircle, Clock, BarChart3 } from "lucide-react"

interface QueryStatsCardsProps {
    stats: {
        total: number
        resolved: number
        pending: number
    }
}

export const QueryStatsCards = ({ stats }: QueryStatsCardsProps) => {
    const resolvedPercentage = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0
    const pendingPercentage = stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0

    return (
        <div className="flex flex-wrap justify-between max-sm:gap-4">
            <div className="w-full sm:w-[48%] lg:w-[23.5%]">
                <Card className="border-l-4 border-l-blue-500 border-border h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
                        <MessageSquareQuestion className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All time queries</p>
                    </CardContent>
                </Card>
            </div>

            <div className="w-full sm:w-[48%] lg:w-[23.5%]">
                <Card className="border-l-4 border-l-green-500 border-border h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</div>
                        <p className="text-xs text-muted-foreground">{resolvedPercentage}% of total queries</p>
                        <Progress value={resolvedPercentage} className="mt-2" />
                    </CardContent>
                </Card>
            </div>

            <div className="w-full sm:w-[48%] lg:w-[23.5%]">
                <Card className="border-l-4 border-l-orange-500 border-border h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">{pendingPercentage}% of total queries</p>
                        <Progress value={pendingPercentage} className="mt-2" />
                    </CardContent>
                </Card>
            </div>

            <div className="w-full sm:w-[48%] lg:w-[23.5%]">
                <Card className="border-l-4 border-l-purple-500 border-border h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                        <BarChart3 className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{resolvedPercentage}%</div>
                        <p className="text-xs text-muted-foreground">Queries resolved successfully</p>
                        <Progress value={resolvedPercentage} className="mt-2" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

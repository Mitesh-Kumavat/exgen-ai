import { getDashboardStats } from "@/service/result-service"
import { extractErrorMessage } from "@/utils/error-handler"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { WelcomeHeader } from "@/components/dashboard/welcome-header"
import { Skeleton } from "@/components/ui/skeleton"

export interface Stats {
    totalExams: number
    answerSheetsCount: number
    studentsCount: number
    activeExamsCount: number
    pendingQueries: number
    totalQueries: number
}

const Dashboard = () => {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBasicStats = async () => {
            try {
                setLoading(true)
                const response = await getDashboardStats()
                if (response.status === 200) {
                    setStats(response.data.data)
                }
            } catch (error) {
                const err = extractErrorMessage(error, "Failed to fetch stats")
                toast.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchBasicStats()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <Skeleton className="h-16 w-full" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-24" />
                        ))}
                    </div>
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <WelcomeHeader />
                <DashboardStats stats={stats} />
                <QuickActions />
            </div>
        </div>
    )
}

export default Dashboard

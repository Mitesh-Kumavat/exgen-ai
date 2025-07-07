import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getAllQueries } from "@/service/query-service"
import { QueryStatsCards } from "@/components/queries/query-stats-card"
import { QueryFilters } from "@/components/queries/query-filters"
import { QueriesTable } from "@/components/queries/queries-table"
import { QueryDetailModal } from "@/components/queries/query-detail-modal"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquareIcon as MessageSquareQuestion, AlertCircle } from "lucide-react"
import { extractErrorMessage } from "@/utils/error-handler"
import type { Query, QueryFilters as QueryFiltersType } from "@/types/query"

const ManageQueries = () => {
    const [queries, setQueries] = useState<Query[]>([])
    const [filteredQueries, setFilteredQueries] = useState<Query[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [filters, setFilters] = useState<QueryFiltersType>({
        status: "all",
        sortBy: "newest",
        searchQuery: "",
    })

    useEffect(() => {
        fetchQueries()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [queries, filters])

    const fetchQueries = async () => {
        try {
            setLoading(true)
            const response = await getAllQueries()

            if (response.data.success) {
                setQueries(response.data.data)
            } else {
                toast.error("Failed to fetch queries")
            }
        } catch (error) {
            const err = extractErrorMessage(error, "Failed to fetch queries")
            toast.error(err)
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...queries]

        if (filters.status !== "all") {
            if (filters.status === "resolved") {
                filtered = filtered.filter((query) => query.isResolved)
            } else if (filters.status === "pending") {
                filtered = filtered.filter((query) => !query.isResolved)
            }
        }

        if (filters.searchQuery) {
            filtered = filtered.filter(
                (query) =>
                    query.student.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                    query.student.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                    query.student.enrollmentNumber.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                    query.exam.title.toLowerCase().includes(filters.searchQuery.toLowerCase()),
            )
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()

            if (filters.sortBy === "oldest") {
                return dateA - dateB
            } else {
                return dateB - dateA
            }
        })

        setFilteredQueries(filtered)
    }

    const handleViewQuery = (query: Query) => {
        setSelectedQuery(query)
        setDetailModalOpen(true)
    }

    const handleQueryResolved = () => {
        fetchQueries()
        setDetailModalOpen(false)
        setSelectedQuery(null)
    }

    const getQueryStats = () => {
        const total = queries.length
        const resolved = queries.filter((q) => q.isResolved).length
        const pending = total - resolved

        return { total, resolved, pending }
    }

    const stats = getQueryStats()

    if (loading) {
        return (
            <div className="container mx-auto p-4 md:p-6">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground text-lg">Loading queries...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">Manage Queries</h1>
                        <p className="text-muted-foreground">Review and resolve student queries about exam evaluations</p>
                    </div>
                </div>
            </div>

            <QueryStatsCards stats={stats} />

            <QueryFilters filters={filters} onFiltersChange={setFilters} />

            {filteredQueries.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-20">
                        {queries.length === 0 ? (
                            <>
                                <MessageSquareQuestion className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No Queries Found</h3>
                                <p className="text-muted-foreground">No students have raised any queries yet.</p>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No Matching Queries</h3>
                                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                            </>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <QueriesTable queries={filteredQueries} onViewQuery={handleViewQuery} />
            )}

            <QueryDetailModal
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
                query={selectedQuery}
                onQueryResolved={handleQueryResolved}
            />
        </div>
    )
}

export default ManageQueries

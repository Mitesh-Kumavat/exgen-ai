import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, SortAsc } from "lucide-react"
import type { QueryFilters as QueryFiltersType } from "@/types/query"

interface QueryFiltersProps {
    filters: QueryFiltersType
    onFiltersChange: (filters: QueryFiltersType) => void
}

export const QueryFilters = ({ filters, onFiltersChange }: QueryFiltersProps) => {
    const handleFilterChange = (key: keyof QueryFiltersType, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value,
        })
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search by student name, email, enrollment, or exam..."
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="flex flex-wrap gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2 ">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Queries</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 ">
                    <SortAsc className="h-4 w-4 text-muted-foreground" />
                    <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="newest">Newest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

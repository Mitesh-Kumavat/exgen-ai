import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar, User, MailIcon } from "lucide-react"
import type { Query } from "@/types/query"

interface QueriesTableProps {
    queries: Query[]
    onViewQuery: (query: Query) => void
}

export const QueriesTable = ({ queries, onViewQuery }: QueriesTableProps) => {
    const getStatusBadge = (isResolved: boolean) => {
        if (isResolved) {
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700 text-xs">
                    Resolved
                </Badge>
            )
        }
        return (
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700 text-xs">
                Pending
            </Badge>
        )
    }

    return (
        <Card className="shadow-lg border-border">
            <CardContent className="p-0">
                {/* Mobile Card View */}
                <div className="block sm:hidden">
                    <div className="divide-y divide-border">
                        {queries.map((query) => (
                            <div key={query._id} className="p-4 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            <span className="font-semibold text-sm truncate">{query.student.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <MailIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                            <span className="text-xs text-muted-foreground truncate">{query.student.email}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            Enrollment: {query.student.enrollmentNumber}
                                        </span>
                                    </div>
                                    {getStatusBadge(query.isResolved)}
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium truncate">{query.exam.title} : {query.exam.subject}</div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3 flex-shrink-0" />
                                        <span>
                                            {new Date(query.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <Button variant="outline" size="sm" onClick={() => onViewQuery(query)} className="w-full gap-2 text-xs">
                                    <Eye className="h-3 w-3" />
                                    View Details
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto px-2">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead className="font-semibold text-xs sm:text-sm">Student</TableHead>
                                <TableHead className="hidden md:table-cell font-semibold text-xs sm:text-sm">Enrollment</TableHead>
                                <TableHead className="hidden md:table-cell font-semibold text-xs sm:text-sm">Email</TableHead>
                                <TableHead className="font-semibold text-xs sm:text-sm">Exam</TableHead>
                                <TableHead className="font-semibold text-xs sm:text-sm">Subject</TableHead>
                                <TableHead className="font-semibold text-xs sm:text-sm">Status</TableHead>
                                <TableHead className="hidden lg:table-cell font-semibold text-xs sm:text-sm">Date</TableHead>
                                <TableHead className="text-right font-semibold text-xs sm:text-sm">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {queries.map((query) => (
                                <TableRow key={query._id} className="hover:bg-muted/50 transition-colors border-b border-border">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-sm truncate">{query.student.name}</span>
                                            <span className="md:hidden text-xs text-muted-foreground flex items-center gap-1 truncate">
                                                <MailIcon className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">{query.student.email}</span>
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex items-center gap-1 text-sm min-w-0">
                                            <span className="truncate">{query.student.enrollmentNumber}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex items-center gap-1 text-sm min-w-0">
                                            <MailIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                            <span className="truncate">{query.student.email}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium text-sm truncate">{query.exam.title}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium text-sm truncate">{query.exam.subject}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>{getStatusBadge(query.isResolved)}</TableCell>

                                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 flex-shrink-0" />
                                            <span className="text-xs">
                                                {new Date(query.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewQuery(query)}
                                            className="gap-2 hover:bg-primary/10 hover:text-primary text-xs sm:text-sm"
                                        >
                                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="hidden sm:inline">View</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

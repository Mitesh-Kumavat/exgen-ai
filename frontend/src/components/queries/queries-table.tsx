import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Mail, Calendar } from "lucide-react"
import type { Query } from "@/types/query"

interface QueriesTableProps {
    queries: Query[]
    onViewQuery: (query: Query) => void
}

export const QueriesTable = ({ queries, onViewQuery }: QueriesTableProps) => {
    const getStatusBadge = (isResolved: boolean) => {
        if (isResolved) {
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700">
                    Resolved
                </Badge>
            )
        }
        return (
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700">
                Pending
            </Badge>
        )
    }

    return (
        <Card className="shadow-lg border-border">
            <CardHeader className="bg-muted/50 border-b border-border overflow-hidden">
                <CardTitle className="flex items-center gap-2 text-xl">
                    Student Queries ({queries.length})
                </CardTitle>
            </CardHeader>

            <CardContent className="px-4 max-sm:px-2">
                <div className="overflow-x-auto h-full">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead className="font-semibold">Student</TableHead>
                                <TableHead className="hidden md:table-cell font-semibold">Email</TableHead>
                                <TableHead className="font-semibold">Exam</TableHead>
                                <TableHead className="font-semibold">Subject</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="hidden lg:table-cell font-semibold">Query Date</TableHead>
                                <TableHead className="text-right font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {queries.map((query) => (
                                <TableRow key={query._id} className="hover:bg-muted/50 transition-colors border-b border-border">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{query.student.name}</span>
                                            <span className="md:hidden text-xs text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {query.student.email}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex items-center gap-1 text-sm">
                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                            {query.student.email}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{query.exam.title}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{query.exam.subject}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>{getStatusBadge(query.isResolved)}</TableCell>

                                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(query.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewQuery(query)}
                                            className="gap-2 hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Eye className="h-4 w-4" />
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

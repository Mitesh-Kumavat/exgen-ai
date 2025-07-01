import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ExternalLink } from "lucide-react"
import type { SyllabusChapter } from "@/types"

interface SyllabusSectionProps {
    syllabusData: SyllabusChapter[]
}

export const SyllabusSection = ({ syllabusData }: SyllabusSectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Syllabus Chapters
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {syllabusData.map((chapter) => (
                        <div key={chapter._id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold">{chapter.chapter}</h4>
                                        <Badge variant="secondary">{chapter.marks} marks</Badge>
                                    </div>
                                </div>

                                {chapter.url && (
                                    <a
                                        href={chapter.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        View Resource
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

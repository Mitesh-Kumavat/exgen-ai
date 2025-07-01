"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const LoadingCard = () => {
    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-24" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <Skeleton className="h-6 w-48 mb-4" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="p-6">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="border rounded-lg p-4">
                                        <Skeleton className="h-5 w-40 mb-2" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-6 w-20" />
                                            <Skeleton className="h-6 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

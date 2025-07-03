import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const AddressCardSkeleton = () => (
  <Card className="relative">
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Skeleton className="h-4 w-4 rounded-full mt-1" />
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="flex items-start gap-2">
          <Skeleton className="h-4 w-4 rounded-full mt-1" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default AddressCardSkeleton
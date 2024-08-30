import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface GigData {
  id: string
  title: string
  description: string
  price: number
  // Add more fields as needed
}

async function fetchGigData(id: string): Promise<GigData> {
  // Implement your data fetching logic here
  // This is a placeholder
  return {
    id,
    title: 'Sample Gig',
    description: 'This is a sample gig description',
    price: 100,
  }
}

function GigSkeleton() {
    return (
      <Card className="max-w-3xl mx-auto mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" count={3} />
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    )
  }

function GigDetails({ gig }: { gig: GigData }) {
  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>{gig.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{gig.description}</p>
        <p className="text-2xl font-bold mb-4">${gig.price}</p>
        <Button>Book Now</Button>
      </CardContent>
    </Card>
  )
}

export default function GigPage() {
  const router = useRouter()
  const { id } = router.query

  return (
    <Suspense fallback={<GigSkeleton />}>
      {id && <GigDetails gig={fetchGigData(id as string)} />}
    </Suspense>
  )
}

import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import GeneralLayout from '@/layout/GeneralLayout'

interface StoreData {
  id: string
  name: string
  description: string
  products: string[]
  // Add more fields as needed
}

async function fetchStoreData(id: string): Promise<StoreData> {
  // Implement your data fetching logic here
  // This is a placeholder
  return {
    id,
    name: 'Sample Store',
    description: 'This is a sample store description',
    products: ['Product 1', 'Product 2', 'Product 3'],
  }
}

function StoreDetails({ store }: { store: StoreData }) {
  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>{store.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{store.description}</p>
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ul>
              {store.products.map((product, index) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="reviews">
            {/* Implement reviews content */}
            <p>Reviews coming soon...</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function StorePage() {
  const router = useRouter()
  const { id } = router.query

  return (
    <GeneralLayout>
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
      {id && <StoreDetails store={fetchStoreData(id as string)} />}
    </Suspense>
    </GeneralLayout>
  )
}
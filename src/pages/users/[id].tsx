import { useRouter } from 'next/router'
import { Suspense, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow, format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EnvelopeIcon, PhoneIcon, CalendarIcon, MapPinIcon, CreditCardIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface UserData {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  location: string
  joinedAt: string
  role: string
  status: 'active' | 'inactive'
  lastLogin: string
  totalSpent: number
  recentTransactions: Array<{
    id: string
    date: string
    amount: number
    description: string
  }>
}

async function fetchUserData(id: string): Promise<UserData> {
  // Implement your data fetching logic here
  // This is a placeholder
  return {
    id,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    joinedAt: '2023-01-15T00:00:00Z',
    role: 'User',
    status: 'active',
    lastLogin: '2023-05-20T14:30:00Z',
    totalSpent: 1250.75,
    recentTransactions: [
      { id: 't1', date: '2023-05-18T10:00:00Z', amount: 50.00, description: 'Product purchase' },
      { id: 't2', date: '2023-05-15T14:30:00Z', amount: 75.50, description: 'Service subscription' },
      { id: 't3', date: '2023-05-10T09:15:00Z', amount: 120.25, description: 'Premium upgrade' },
    ],
  }
}

function UserSkeleton() {
  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" count={5} />
      </CardContent>
    </Card>
  )
}

function UserDetails({ user }: { user: UserData }) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <Badge variant={user.status === 'active' ? 'secondary' : 'destructive'}>
              {user.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{user.role}</Badge>
          <Badge variant="secondary">
            <ClockIcon className="h-4 w-4 mr-1" />
            {formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span>Last login: {format(new Date(user.lastLogin), 'PPpp')}</span>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold">${user.totalSpent.toFixed(2)}</p>
                  </div>
                  <CreditCardIcon className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p>User activity will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function UserPage() {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    if (id) {
      fetchUserData(id as string).then(setUser)
    }
  }, [id])

  return (
    <Suspense fallback={<UserSkeleton />}>
      {user && <UserDetails user={user!} />}
    </Suspense>
  )
}
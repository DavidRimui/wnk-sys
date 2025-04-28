"use client"

import { useState, useEffect } from "react"
import { getPaymentAnalytics } from "@/lib/analytics"
import type { PaymentAnalytics as PaymentAnalyticsType } from "@/lib/analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign, Phone, RefreshCw, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PaymentAnalytics() {
  const [analytics, setAnalytics] = useState<PaymentAnalyticsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchAnalytics = async () => {
    try {
      const data = await getPaymentAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load payment analytics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()

    // Set up polling for real-time updates
    const interval = setInterval(fetchAnalytics, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [toast])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAnalytics()
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const paymentMethodData = analytics
    ? [
        { name: "M-Pesa", value: analytics.paymentMethodBreakdown.mpesa },
        { name: "Airtel", value: analytics.paymentMethodBreakdown.airtel },
        { name: "Card", value: analytics.paymentMethodBreakdown.card },
      ]
    : []

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No analytics data available</h3>
        <p className="text-muted-foreground">Try refreshing the page</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payment Analytics Dashboard</h2>
        <Button onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
          {isRefreshing ? (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Kshs.{analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From {analytics.totalSuccessful} successful payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.conversionRate > 50 ? (
                <>
                  <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">Good</span>
                </>
              ) : (
                <>
                  <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500">Needs improvement</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Votes Per Transaction</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageVotesPerTransaction.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Kshs.{(analytics.averageVotesPerTransaction * 10).toFixed(2)} per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Success Rate</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalPayments > 0
                ? ((analytics.totalSuccessful / analytics.totalPayments) * 100).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalSuccessful} of {analytics.totalPayments} payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Daily Transactions Chart */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Daily Transactions</CardTitle>
                <CardDescription>Transaction volume over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer
                  config={{
                    total: {
                      label: "Total",
                      color: "hsl(var(--chart-1))",
                    },
                    successful: {
                      label: "Successful",
                      color: "hsl(var(--chart-2))",
                    },
                    failed: {
                      label: "Failed",
                      color: "hsl(var(--chart-3))",
                    },
                    pending: {
                      label: "Pending",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.dailyTransactions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={2} />
                      <Line type="monotone" dataKey="successful" stroke="var(--color-successful)" strokeWidth={2} />
                      <Line type="monotone" dataKey="failed" stroke="var(--color-failed)" strokeWidth={2} />
                      <Line type="monotone" dataKey="pending" stroke="var(--color-pending)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Payment Method Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods used</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} transactions`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Current status of all payment attempts</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer
                  config={{
                    successful: {
                      label: "Successful",
                      color: "hsl(var(--chart-2))",
                    },
                    failed: {
                      label: "Failed",
                      color: "hsl(var(--chart-3))",
                    },
                    pending: {
                      label: "Pending",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Payment Status",
                          successful: analytics.totalSuccessful,
                          failed: analytics.totalFailed,
                          pending: analytics.totalPending,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="successful" fill="var(--color-successful)" />
                      <Bar dataKey="failed" fill="var(--color-failed)" />
                      <Bar dataKey="pending" fill="var(--color-pending)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Daily Transaction Details</CardTitle>
              <CardDescription>Detailed breakdown of transactions by day</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Total Transactions</TableHead>
                    <TableHead>Successful</TableHead>
                    <TableHead>Failed</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Success Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.dailyTransactions.map((day) => (
                    <TableRow key={day.date}>
                      <TableCell className="font-medium">{day.date}</TableCell>
                      <TableCell>{day.total}</TableCell>
                      <TableCell>{day.successful}</TableCell>
                      <TableCell>{day.failed}</TableCell>
                      <TableCell>{day.pending}</TableCell>
                      <TableCell>{day.total > 0 ? ((day.successful / day.total) * 100).toFixed(1) : 0}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Voting performance by candidate category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <ChartContainer
                  config={{
                    transactions: {
                      label: "Transactions",
                      color: "hsl(var(--chart-1))",
                    },
                    votes: {
                      label: "Votes",
                      color: "hsl(var(--chart-2))",
                    },
                    revenue: {
                      label: "Revenue (Kshs)",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.categoryBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis yAxisId="left" orientation="left" stroke="var(--color-transactions)" />
                      <YAxis yAxisId="right" orientation="right" stroke="var(--color-revenue)" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="transactions" fill="var(--color-transactions)" />
                      <Bar yAxisId="left" dataKey="votes" fill="var(--color-votes)" />
                      <Bar yAxisId="right" dataKey="revenue" fill="var(--color-revenue)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Revenue (Kshs)</TableHead>
                    <TableHead>Avg. Votes/Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.categoryBreakdown.map((category) => (
                    <TableRow key={category.category}>
                      <TableCell className="font-medium">{category.category}</TableCell>
                      <TableCell>{category.transactions}</TableCell>
                      <TableCell>{category.votes}</TableCell>
                      <TableCell>{category.revenue.toLocaleString()}</TableCell>
                      <TableCell>{(category.votes / category.transactions).toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { getPaymentRecords } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

interface PaymentRecord {
  reference: string
  candidateId: string
  timestamp: number
  votes: number
}

export function PaymentRecords() {
  const [records, setRecords] = useState<PaymentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getPaymentRecords()
        setRecords(data)
      } catch (error) {
        console.error("Failed to fetch payment records:", error)
        toast({
          title: "Error",
          description: "Failed to load payment records. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecords()

    // Set up polling for real-time updates
    const interval = setInterval(fetchRecords, 5000)
    return () => clearInterval(interval)
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Records</CardTitle>
        <CardDescription>Recent payments for votes</CardDescription>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No payment records found</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Candidate ID</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Amount (Kshs)</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.reference}>
                    <TableCell className="font-medium">{record.reference}</TableCell>
                    <TableCell>{record.candidateId}</TableCell>
                    <TableCell>{record.votes}</TableCell>
                    <TableCell>{record.votes * 10}</TableCell>
                    <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

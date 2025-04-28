"use server"

import { getPaymentRecords, getPendingVotes } from "./actions"

export interface PaymentAnalytics {
  totalPayments: number
  totalSuccessful: number
  totalPending: number
  totalFailed: number
  conversionRate: number
  totalRevenue: number
  averageVotesPerTransaction: number
  paymentMethodBreakdown: {
    mpesa: number
    airtel: number
    card: number
  }
  dailyTransactions: {
    date: string
    total: number
    successful: number
    failed: number
    pending: number
  }[]
  categoryBreakdown: {
    category: string
    transactions: number
    votes: number
    revenue: number
  }[]
}

export async function getPaymentAnalytics(): Promise<PaymentAnalytics> {
  // Get payment records and pending votes
  const paymentRecords = await getPaymentRecords()
  const pendingVotes = await getPendingVotes()

  // Calculate total payments
  const totalPayments = paymentRecords.length

  // Calculate successful payments
  const successfulPayments = paymentRecords.filter((record) => record.status === "completed")
  const totalSuccessful = successfulPayments.length

  // Calculate failed payments
  const failedPayments = paymentRecords.filter((record) => record.status === "failed")
  const totalFailed = failedPayments.length

  // Calculate pending payments
  const totalPending = pendingVotes.length

  // Calculate conversion rate (successful / total initiated)
  const conversionRate = totalPayments > 0 ? (totalSuccessful / (totalPayments + totalPending)) * 100 : 0

  // Calculate total revenue (each vote costs Kshs.10)
  const totalRevenue = successfulPayments.reduce((sum, record) => sum + record.votes * 10, 0)

  // Calculate average votes per transaction
  const averageVotesPerTransaction =
    totalSuccessful > 0 ? successfulPayments.reduce((sum, record) => sum + record.votes, 0) / totalSuccessful : 0

  // Mock payment method breakdown (in a real app, this would come from actual data)
  const paymentMethodBreakdown = {
    mpesa: Math.round(totalSuccessful * 0.7), // 70% M-Pesa
    airtel: Math.round(totalSuccessful * 0.1), // 10% Airtel
    card: Math.round(totalSuccessful * 0.2), // 20% Card
  }

  // Generate daily transactions for the last 7 days
  const dailyTransactions = generateDailyTransactions(paymentRecords, pendingVotes)

  // Generate category breakdown (mock data for now)
  const categoryBreakdown = generateCategoryBreakdown(paymentRecords)

  return {
    totalPayments,
    totalSuccessful,
    totalPending,
    totalFailed,
    conversionRate,
    totalRevenue,
    averageVotesPerTransaction,
    paymentMethodBreakdown,
    dailyTransactions,
    categoryBreakdown,
  }
}

function generateDailyTransactions(paymentRecords: any[], pendingVotes: any[]) {
  const days = 7
  const result = []

  // Generate data for the last 7 days
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split("T")[0]

    // Filter records for this day
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const dayRecords = paymentRecords.filter((record) => {
      const recordDate = new Date(record.timestamp)
      return recordDate >= dayStart && recordDate <= dayEnd
    })

    const dayPending = pendingVotes.filter((vote) => {
      const voteDate = new Date(vote.timestamp)
      return voteDate >= dayStart && voteDate <= dayEnd
    })

    const daySuccessful = dayRecords.filter((record) => record.status === "completed").length
    const dayFailed = dayRecords.filter((record) => record.status === "failed").length

    result.push({
      date: dateString,
      total: dayRecords.length,
      successful: daySuccessful,
      failed: dayFailed,
      pending: dayPending.length,
    })
  }

  // Sort by date ascending
  return result.sort((a, b) => a.date.localeCompare(b.date))
}

function generateCategoryBreakdown(paymentRecords: any[]) {
  // In a real app, this would aggregate data by candidate category
  // For now, we'll generate some mock data
  const categories = ["Media", "Politics & Governance", "Social Media Influence", "Sports", "Tech and Entrepreneurship"]

  return categories
    .map((category) => {
      // Simulate different distribution for each category
      const transactions = Math.floor(Math.random() * 50) + 10
      const votes = transactions * (Math.floor(Math.random() * 3) + 1)
      const revenue = votes * 10

      return {
        category,
        transactions,
        votes,
        revenue,
      }
    })
    .sort((a, b) => b.transactions - a.transactions)
}

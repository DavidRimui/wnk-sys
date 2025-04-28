"use server"

import { revalidatePath } from "next/cache"
import * as bcrypt from "bcryptjs"
import { getCurrentUser, isAdmin } from "./auth"
import { cache } from "react"
import {
  getCandidates as getCandidatesFromDb,
  getCandidateById,
  updateCandidateVotes as updateCandidateVotesInDb,
  updateCandidate as updateCandidateInDb,
  resetAllVotes as resetAllVotesInDb,
  createPayment as createPaymentInDb,
  getPaymentByReference as getPaymentByReferenceFromDb,
  updatePayment as updatePaymentInDb,
  getAllPayments as getAllPaymentsFromDb,
  getPendingPayments as getPendingPaymentsFromDb,
  createAuditLog as createAuditLogInDb,
  getSetting as getSettingFromDb,
  getAllSettings as getAllSettingsFromDb,
  upsertSetting as upsertSettingInDb,
  getUserByEmail as getUserByEmailFromDb,
} from "./db"

// Cached function to get candidates
export const getCandidatesAction = cache(async () => {
  try {
    const candidates = await getCandidatesFromDb()
    return candidates
  } catch (error) {
    console.error("Error fetching candidates:", error)
    throw new Error("Failed to fetch candidates")
  }
})

export async function voteForCandidate(candidateId: string, paymentReference: string, numberOfVotes = 1) {
  try {
    // Check if this payment reference has already been used
    const existingPayment = await getPaymentByReferenceFromDb(paymentReference)

    if (existingPayment) {
      throw new Error("This payment has already been used for voting")
    }

    // Get the candidate
    const candidate = await getCandidateById(candidateId)

    if (!candidate) {
      throw new Error("Candidate not found")
    }

    // Check if voting is enabled
    const votingEnabled = await getSettingFromDb("votingEnabled")

    if (votingEnabled?.value !== "true") {
      throw new Error("Voting is currently disabled")
    }

    // Create a transaction to update the candidate and create a payment record
    // In a real application, you would use a database transaction
    // For now, we'll do these operations sequentially

    // Update candidate votes
    const updatedCandidate = await updateCandidateVotesInDb(candidateId, numberOfVotes)

    // Create payment record
    await createPaymentInDb({
      reference: paymentReference,
      candidateId,
      votes: numberOfVotes,
      amount: numberOfVotes * 10, // Each vote costs Kshs.10
      status: "completed",
    })

    // Log the vote
    await createAuditLogInDb({
      action: "VOTE",
      details: {
        candidateId,
        votes: numberOfVotes,
        paymentReference,
      },
    })

    // Revalidate the path to update the UI
    revalidatePath("/")

    return await getCandidatesFromDb()
  } catch (error) {
    console.error("Error voting for candidate:", error)
    throw error
  }
}

export async function registerPendingVote(checkoutRequestId: string, candidateId: string, votes: number) {
  try {
    // Create a pending payment record
    await createPaymentInDb({
      reference: checkoutRequestId,
      candidateId,
      votes,
      amount: votes * 10, // Each vote costs Kshs.10
      status: "pending",
    })

    console.log(
      `Registered pending vote: ${votes} vote(s) for candidate ${candidateId} with request ID ${checkoutRequestId}`,
    )

    return { success: true }
  } catch (error) {
    console.error("Error registering pending vote:", error)
    throw error
  }
}

export async function processPaymentCallback(callbackData: any) {
  console.log("Processing payment callback:", callbackData)

  try {
    // Extract relevant data from the callback
    const {
      request_reference: checkoutRequestId,
      result_code: resultCode,
      result_desc: resultDesc,
      transaction_code: transactionCode,
      amount,
    } = callbackData

    // Check if this is a successful transaction
    const isSuccessful = resultCode === "0" && resultDesc === "SUCCESS"

    // Find the pending payment
    const pendingPayment = await getPaymentByReferenceFromDb(checkoutRequestId)

    if (!pendingPayment) {
      console.log(`No pending payment found for checkout request ID: ${checkoutRequestId}`)
      return { success: false, message: "No pending payment found" }
    }

    if (!isSuccessful) {
      // Update the payment status to failed
      await updatePaymentInDb(pendingPayment.id, {
        status: "failed",
        metadata: callbackData,
      })

      // Log the failed payment
      await createAuditLogInDb({
        action: "PAYMENT_FAILED",
        details: {
          paymentId: pendingPayment.id,
          resultCode,
          resultDesc,
        },
      })

      console.log(`Payment failed: ${resultDesc}`)
      return { success: false, message: resultDesc }
    }

    // Process the successful payment
    const { candidate_id: candidateId, votes } = pendingPayment

    // Update the payment status
    await updatePaymentInDb(pendingPayment.id, {
      status: "completed",
      metadata: callbackData,
      reference: transactionCode || checkoutRequestId, // Use transaction code if available
    })

    // Update the candidate votes
    await updateCandidateVotesInDb(candidateId, votes)

    // Log the successful payment
    await createAuditLogInDb({
      action: "PAYMENT_COMPLETED",
      details: {
        paymentId: pendingPayment.id,
        candidateId,
        votes,
        amount: pendingPayment.amount,
      },
    })

    // Revalidate the path to update the UI
    revalidatePath("/")

    console.log(`Successfully processed payment for ${votes} vote(s) for candidate ${candidateId}`)

    return { success: true }
  } catch (error) {
    console.error("Error processing payment callback:", error)

    // Log the error
    await createAuditLogInDb({
      action: "PAYMENT_PROCESSING_ERROR",
      details: {
        error: error instanceof Error ? error.message : String(error),
        callbackData,
      },
    })

    throw error
  }
}

export async function resetVotes() {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      throw new Error("Unauthorized: Only admins can reset votes")
    }

    // Reset all votes to 0
    await resetAllVotesInDb()

    // Log the action
    await createAuditLogInDb({
      action: "RESET_VOTES",
      userId: (await getCurrentUser())?.id,
    })

    // Revalidate the path to update the UI
    revalidatePath("/admin")
    revalidatePath("/")

    return await getCandidatesFromDb()
  } catch (error) {
    console.error("Error resetting votes:", error)
    throw error
  }
}

export async function updateCandidateAction(candidateId: string, updates: any) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      throw new Error("Unauthorized: Only admins can update candidates")
    }

    // Update the candidate
    const updatedCandidate = await updateCandidateInDb(candidateId, updates)

    // Log the action
    await createAuditLogInDb({
      action: "UPDATE_CANDIDATE",
      userId: (await getCurrentUser())?.id,
      details: {
        candidateId,
        updates,
      },
    })

    // Revalidate the path to update the UI
    revalidatePath("/admin")
    revalidatePath("/")

    return updatedCandidate
  } catch (error) {
    console.error("Error updating candidate:", error)
    throw error
  }
}

export async function verifyAdminCredentials(email: string, password: string) {
  try {
    const user = await getUserByEmailFromDb(email)

    if (!user || user.role !== "admin") return false

    const passwordMatch = await bcrypt.compare(password, user.password)
    return passwordMatch
  } catch (error) {
    console.error("Error verifying admin credentials:", error)
    return false
  }
}

export async function getPaymentRecords() {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      throw new Error("Unauthorized: Only admins can view payment records")
    }

    const payments = await getAllPaymentsFromDb()

    return payments.map((payment) => ({
      reference: payment.reference,
      candidateId: payment.candidate_id,
      candidateName: payment.candidate_name,
      timestamp: new Date(payment.created_at).getTime(),
      votes: payment.votes,
      amount: payment.amount,
      status: payment.status,
    }))
  } catch (error) {
    console.error("Error fetching payment records:", error)
    throw error
  }
}

export async function getPendingVotes() {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      throw new Error("Unauthorized: Only admins can view pending votes")
    }

    const pendingPayments = await getPendingPaymentsFromDb()

    return pendingPayments.map((payment) => ({
      checkoutRequestId: payment.reference,
      candidateId: payment.candidate_id,
      votes: payment.votes,
      timestamp: new Date(payment.created_at).getTime(),
    }))
  } catch (error) {
    console.error("Error fetching pending votes:", error)
    throw error
  }
}

export async function getAuditLogs(limit = 100) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      throw new Error("Unauthorized: Only admins can view audit logs")
    }

    const logs = await createAuditLogInDb(limit)

    return logs
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    throw error
  }
}

export async function updateSettings(key: string, value: string) {
  try {
    // Check if user is admin
    const admin = await isAdmin()
    if (!admin) {
      throw new Error("Unauthorized: Only admins can update settings")
    }

    await upsertSettingInDb(key, value)

    // Log the action
    await createAuditLogInDb({
      action: "UPDATE_SETTING",
      userId: (await getCurrentUser())?.id,
      details: { key, value },
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating settings:", error)
    throw error
  }
}

export async function getSettings() {
  try {
    const settings = await getAllSettingsFromDb()
    return settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      },
      {} as Record<string, string>,
    )
  } catch (error) {
    console.error("Error fetching settings:", error)
    throw error
  }
}

export const getCandidates = getCandidatesFromDb
export const updateCandidate = updateCandidateInDb

"use client"

import { useState } from "react"
import { registerPendingVote } from "./actions"

// Kitty API types
export interface KittyPaymentRequest {
  amount: number
  kitty_id: number
  phone_number: string
  channel_code: number
  auth_code: string
  first_name: string
  second_name: string
  show_names: boolean
  show_number: boolean
}

export interface KittyPaymentResponse {
  status: boolean
  message: string
  data: {
    checkout_request_id: string
    payment_gateway: string
    customer_message: string
    detail: string
    response_description: string
    checkout_url: string
  } | null
}

export interface KittyCallbackData {
  amount: string
  channel_code: string
  charges_total: string
  first_name: string
  kitty_balance: number
  kitty_id: number
  phone_number: string
  request_reference: string
  result_code: string
  result_desc: string
  second_name: string
  third_party_reference: string
  transaction_code: string
  transaction_type: string
}

// Payment channel codes
export const PAYMENT_CHANNELS = {
  MPESA: 63902,
  AIRTEL_MONEY: 63903,
  CARD: 55,
}

// Kitty API configuration
const KITTY_API_URL = "https://apisalticon.onekitty.co.ke/kitty/api/contribute/"
const KITTY_ID = 5458 // Replace with your actual kitty ID
const AUTH_CODE =
  process.env.NEXT_PUBLIC_KITTY_AUTH_CODE || "1d2314d8864ea3707fea141e43967cfc400bfa7019df33ba8701e6f60ba0a9bb"

// Add a console log to verify the auth code is available
console.log("Kitty Auth Code available:", !!process.env.NEXT_PUBLIC_KITTY_AUTH_CODE)

export const useKittyPayment = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<KittyPaymentResponse | null>(null)

  const initiatePayment = async (
    amount: number,
    phoneNumber: string,
    firstName: string,
    secondName: string,
    candidateId: string,
    votes: number,
    channelCode: number = PAYMENT_CHANNELS.MPESA,
    showNames = true,
    showNumber = false,
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      // Format phone number to ensure it starts with 254
      let formattedPhone = phoneNumber
      if (phoneNumber.startsWith("0")) {
        formattedPhone = `254${phoneNumber.substring(1)}`
      } else if (!phoneNumber.startsWith("254")) {
        formattedPhone = `254${phoneNumber}`
      }

      console.log("Using Kitty Auth Code:", AUTH_CODE)

      const paymentRequest: KittyPaymentRequest = {
        amount,
        kitty_id: KITTY_ID,
        phone_number: formattedPhone,
        channel_code: channelCode,
        auth_code: AUTH_CODE,
        first_name: firstName,
        second_name: secondName,
        show_names: showNames,
        show_number: showNumber,
      }

      console.log("Sending payment request:", JSON.stringify(paymentRequest))

      const response = await fetch(KITTY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      })

      const data: KittyPaymentResponse = await response.json()
      console.log("Received payment response:", JSON.stringify(data))

      if (!response.ok) {
        throw new Error(data.message || "Payment initiation failed")
      }

      setResponse(data)

      // Register the pending vote if we have a checkout request ID
      if (data.status && data.data?.checkout_request_id) {
        await registerPendingVote(data.data.checkout_request_id, candidateId, votes)
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      console.error("Payment error:", errorMessage)
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    initiatePayment,
    isLoading,
    error,
    response,
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { processPaymentCallback } from "@/lib/actions"
import { verifyWebhookSignature } from "@/lib/webhook"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Get the raw request body for signature verification
    const rawBody = await request.text()

    // Get the signature from headers
    const signature = request.headers.get("x-kitty-signature") || ""

    // Verify the signature
    const isValidSignature = verifyWebhookSignature(rawBody, signature)

    if (!isValidSignature) {
      console.error("Invalid webhook signature")

      // Log the invalid signature attempt
      await prisma.auditLog.create({
        data: {
          action: "INVALID_WEBHOOK",
          details: {
            ip: request.headers.get("x-forwarded-for") || request.ip,
            userAgent: request.headers.get("user-agent"),
          },
        },
      })

      return NextResponse.json({ status: "error", message: "Invalid signature" }, { status: 401 })
    }

    // Parse the callback data
    const callbackData = JSON.parse(rawBody)

    console.log("Received Kitty callback:", callbackData)

    // Process the payment callback
    const result = await processPaymentCallback(callbackData)

    // Return a success response to Kitty
    return NextResponse.json({ status: "success", ...result }, { status: 200 })
  } catch (error) {
    console.error("Error processing Kitty callback:", error)

    // Log the error
    await prisma.auditLog.create({
      data: {
        action: "WEBHOOK_ERROR",
        details: {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      },
    })

    return NextResponse.json({ status: "error", message: "Failed to process callback" }, { status: 500 })
  }
}

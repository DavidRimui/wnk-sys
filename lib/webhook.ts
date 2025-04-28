import { createHmac } from "crypto"

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "fallback-webhook-secret-for-development-only"

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  try {
    const computedSignature = createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex")

    return computedSignature === signature
  } catch (error) {
    console.error("Webhook signature verification error:", error)
    return false
  }
}

export function generateWebhookSignature(payload: string): string {
  return createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex")
}

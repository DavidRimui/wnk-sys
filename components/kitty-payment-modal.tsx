"use client"

import type React from "react"

import { useState } from "react"
import { useKittyPayment, PAYMENT_CHANNELS } from "@/lib/kitty"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ExternalLink } from "lucide-react"

interface KittyPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (reference: string) => void
  candidateName: string
  candidateId: string
}

export function KittyPaymentModal({ isOpen, onClose, onSuccess, candidateName, candidateId }: KittyPaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [numberOfVotes, setNumberOfVotes] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<number>(PAYMENT_CHANNELS.MPESA)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const { initiatePayment, isLoading } = useKittyPayment()
  const { toast } = useToast()

  const totalAmount = numberOfVotes * 10 // Each vote costs Kshs.10

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    if (!firstName || !lastName) {
      toast({
        title: "Missing Information",
        description: "Please provide your first and last name",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await initiatePayment(
        totalAmount,
        phoneNumber,
        firstName,
        lastName,
        candidateId,
        numberOfVotes,
        paymentMethod,
      )

      if (response.status) {
        toast({
          title: "Payment Initiated",
          description: response.message,
        })

        if (paymentMethod === PAYMENT_CHANNELS.CARD && response.data?.checkout_url) {
          setCheckoutUrl(response.data.checkout_url)
        } else if (response.data?.checkout_request_id) {
          // For M-Pesa and other mobile money, we'll use the checkout_request_id as our reference
          onSuccess(response.data.checkout_request_id)
        }
      } else {
        toast({
          title: "Payment Failed",
          description: response.message || "Failed to initiate payment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const handleVoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setNumberOfVotes(value)
    } else {
      setNumberOfVotes(1) // Default to 1 if invalid
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vote for {candidateName}</DialogTitle>
          <DialogDescription>Each vote costs Kshs.10. Enter your details to proceed with payment.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!checkoutUrl ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="votes">Number of Votes</Label>
                <Input
                  id="votes"
                  type="number"
                  min="1"
                  value={numberOfVotes}
                  onChange={handleVoteChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Total Amount</Label>
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <span className="text-muted-foreground">Kshs.</span>
                  <span className="ml-1 font-medium">{totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07XX XXX XXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Enter your phone number in the format 07XX XXX XXX</p>
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <RadioGroup
                  defaultValue={PAYMENT_CHANNELS.MPESA.toString()}
                  onValueChange={(value) => setPaymentMethod(Number.parseInt(value))}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={PAYMENT_CHANNELS.MPESA.toString()} id="mpesa" />
                    <Label htmlFor="mpesa">M-Pesa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={PAYMENT_CHANNELS.CARD.toString()} id="card" />
                    <Label htmlFor="card">Card Payment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={PAYMENT_CHANNELS.AIRTEL_MONEY.toString()} id="airtel" />
                    <Label htmlFor="airtel">Airtel Money</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="mb-4">Please click the button below to complete your card payment:</p>
              <Button className="w-full" onClick={() => window.open(checkoutUrl, "_blank")}>
                Proceed to Payment <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                After completing your payment, close this dialog and your votes will be recorded.
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="mt-6">
          {!checkoutUrl && (
            <>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay Kshs.${totalAmount}`
                )}
              </Button>
            </>
          )}
          {checkoutUrl && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

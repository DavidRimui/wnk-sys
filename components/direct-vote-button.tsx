"use client"

import { useState } from "react"
import { voteForCandidate } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface DirectVoteButtonProps {
  candidateId: string
  candidateName: string
}

export const DirectVoteButton = ({ candidateId, candidateName }: DirectVoteButtonProps) => {
  const [paymentReference, setPaymentReference] = useState("")
  const [isVoting, setIsVoting] = useState(false)
  const { toast } = useToast()

  const handleDirectVote = async () => {
    if (!paymentReference) {
      toast({
        title: "Missing Payment Reference",
        description: "Please enter a payment reference.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsVoting(true)
      await voteForCandidate(candidateId, paymentReference)
      toast({
        title: "Vote Recorded",
        description: `Your vote for ${candidateName} has been recorded.`,
      })
    } catch (error: any) {
      console.error("Failed to vote:", error)
      toast({
        title: "Error",
        description: error?.message || "Failed to record your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
      setPaymentReference("")
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="text"
        placeholder="Enter payment reference"
        value={paymentReference}
        onChange={(e) => setPaymentReference(e.target.value)}
      />
      <Button onClick={handleDirectVote} disabled={isVoting} className="w-full">
        {isVoting ? (
          <div className="flex items-center">
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            Voting...
          </div>
        ) : (
          "Vote with Reference"
        )}
      </Button>
    </div>
  )
}

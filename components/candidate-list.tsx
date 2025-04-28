"use client"

import { useState, useEffect } from "react"
import { type Candidate, categories } from "@/lib/data"
import { getCandidatesAction, voteForCandidate } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { KittyPaymentModal } from "./kitty-payment-modal"
import { DirectVoteButton } from "@/components/direct-vote-button"

export function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [numberOfVotes, setNumberOfVotes] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getCandidatesAction()
        setCandidates(data)
      } catch (error) {
        console.error("Failed to fetch candidates:", error)
        toast({
          title: "Error",
          description: "Failed to load candidates. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCandidates()

    // Set up polling for real-time updates
    const interval = setInterval(fetchCandidates, 5000)
    return () => clearInterval(interval)
  }, [toast])

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async (reference: string) => {
    if (!selectedCandidate) return

    try {
      setVotingInProgress(selectedCandidate.id)
      const updatedCandidates = await voteForCandidate(selectedCandidate.id, reference, numberOfVotes)
      setCandidates(updatedCandidates)
      toast({
        title: "Vote Recorded",
        description: `Your payment was successful and your ${numberOfVotes} vote${numberOfVotes > 1 ? "s" : ""} have been recorded.`,
      })
    } catch (error) {
      console.error("Failed to vote:", error)
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setVotingInProgress(null)
      setShowPaymentModal(false)
      setSelectedCandidate(null)
      setNumberOfVotes(1)
    }
  }

  const handlePaymentClose = () => {
    setShowPaymentModal(false)
    setSelectedCandidate(null)
    setNumberOfVotes(1)
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || selectedCategory === "" || candidate.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{candidate.name}</CardTitle>
                <Badge variant="outline">{candidate.category}</Badge>
              </div>
              {candidate.photo && (
                <div className="flex justify-center -mx-6 mt-2">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src={candidate.photo || "/placeholder.svg"}
                      alt={candidate.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {candidate.biography && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mb-4 w-full">
                      <Info className="h-4 w-4 mr-2" />
                      View Biography
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{candidate.name}</DialogTitle>
                      <DialogDescription>{candidate.category}</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center mb-4">
                      {candidate.photo && (
                        <div className="relative w-40 h-40 rounded-full overflow-hidden">
                          <Image
                            src={candidate.photo || "/placeholder.svg"}
                            alt={candidate.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-sm">{candidate.biography}</p>
                  </DialogContent>
                </Dialog>
              )}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">{candidate.votes} votes</div>
                  <Button
                    onClick={() => handleVoteClick(candidate)}
                    disabled={votingInProgress === candidate.id}
                    className="gap-2"
                  >
                    {votingInProgress === candidate.id ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    ) : (
                      <ThumbsUp className="h-4 w-4" />
                    )}
                    Vote (Kshs.10)
                  </Button>
                </div>
                <DirectVoteButton candidateId={candidate.id} candidateName={candidate.name} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No candidates found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {selectedCandidate && (
        <KittyPaymentModal
          isOpen={showPaymentModal}
          onClose={handlePaymentClose}
          onSuccess={handlePaymentSuccess}
          candidateId={selectedCandidate.id}
          candidateName={selectedCandidate.name}
        />
      )}
    </div>
  )
}

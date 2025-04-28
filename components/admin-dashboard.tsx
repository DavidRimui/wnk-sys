"use client"

import { useState, useEffect } from "react"
import { type Candidate, categories } from "@/lib/data"
import { getCandidates, resetVotes, updateCandidate } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { RefreshCw, Edit, Search, Info } from "lucide-react"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { BarChart3 } from "lucide-react"
import Link from "next/link"

export function AdminDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isResetting, setIsResetting] = useState(false)
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null)
  const [editName, setEditName] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editBiography, setEditBiography] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showBiographyDialog, setShowBiographyDialog] = useState(false)
  const [selectedBioCandidate, setSelectedBioCandidate] = useState<Candidate | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getCandidates()
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

  const handleLogout = () => {
    document.cookie = "admin_logged_in=false; path=/; max-age=0"
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    })
    router.push("/admin")
  }

  const handleResetVotes = async () => {
    if (window.confirm("Are you sure you want to reset all votes? This action cannot be undone.")) {
      try {
        setIsResetting(true)
        await resetVotes()
        toast({
          title: "Votes Reset",
          description: "All votes have been reset to zero.",
        })
      } catch (error) {
        console.error("Failed to reset votes:", error)
        toast({
          title: "Error",
          description: "Failed to reset votes. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsResetting(false)
      }
    }
  }

  const handleEditCandidate = (candidate: Candidate) => {
    setEditCandidate(candidate)
    setEditName(candidate.name)
    setEditCategory(candidate.category)
    setEditBiography(candidate.biography || "")
    setShowEditDialog(true)
  }

  const handleViewBiography = (candidate: Candidate) => {
    setSelectedBioCandidate(candidate)
    setShowBiographyDialog(true)
  }

  const handleSaveEdit = async () => {
    if (!editCandidate) return

    try {
      setIsEditing(true)
      await updateCandidate(editCandidate.id, {
        name: editName,
        category: editCategory,
        biography: editBiography || undefined,
      })
      toast({
        title: "Candidate Updated",
        description: "The candidate details have been updated successfully.",
      })
      setShowEditDialog(false)
    } catch (error) {
      console.error("Failed to update candidate:", error)
      toast({
        title: "Error",
        description: "Failed to update candidate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEditing(false)
    }
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || selectedCategory === "" || candidate.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate statistics
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
  const topCandidate = [...candidates].sort((a, b) => b.votes - a.votes)[0]
  const categoryCounts = categories
    .map((category) => {
      const categoryVotes = candidates.filter((c) => c.category === category).reduce((sum, c) => sum + c.votes, 0)
      return { category, votes: categoryVotes }
    })
    .sort((a, b) => b.votes - a.votes)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Voting Statistics</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Payment Analytics
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleResetVotes} disabled={isResetting} className="gap-2">
            {isResetting ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Reset All Votes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Votes</CardTitle>
            <CardDescription>Across all candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVotes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Candidate</CardTitle>
            <CardDescription>Most votes received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{topCandidate?.name || "N/A"}</div>
            <div>{topCandidate?.votes || 0} votes</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Category</CardTitle>
            <CardDescription>Category with most votes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{categoryCounts[0]?.category || "N/A"}</div>
            <div>{categoryCounts[0]?.votes || 0} votes</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Candidate Management</CardTitle>
          <CardDescription>View and edit candidate information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Biography</TableHead>
                  <TableHead className="text-right">Votes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.id}</TableCell>
                    <TableCell>
                      {candidate.photo ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={candidate.photo || "/placeholder.svg"}
                            alt={candidate.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs">{candidate.name.charAt(0)}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.category}</TableCell>
                    <TableCell>
                      {candidate.biography ? (
                        <Button variant="ghost" size="sm" onClick={() => handleViewBiography(candidate)}>
                          <Info className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{candidate.votes}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCandidate(candidate)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>Make changes to the candidate information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="biography">Biography</Label>
              <Textarea
                id="biography"
                value={editBiography}
                onChange={(e) => setEditBiography(e.target.value)}
                rows={5}
                placeholder="Enter candidate biography"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isEditing}>
              {isEditing ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBiographyDialog} onOpenChange={setShowBiographyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBioCandidate?.name}</DialogTitle>
            <DialogDescription>{selectedBioCandidate?.category}</DialogDescription>
          </DialogHeader>
          {selectedBioCandidate?.photo && (
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden">
                <Image
                  src={selectedBioCandidate.photo || "/placeholder.svg"}
                  alt={selectedBioCandidate.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap">{selectedBioCandidate?.biography}</p>
          <DialogFooter>
            <Button onClick={() => setShowBiographyDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

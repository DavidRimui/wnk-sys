import { CandidateList } from "@/components/candidate-list"
import { EnvChecker } from "@/components/env-checker"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Candidate Voting System</h1>
        <EnvChecker />
        <div className="mt-6">
          <CandidateList />
        </div>
      </div>
    </main>
  )
}

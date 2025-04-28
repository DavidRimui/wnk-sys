import { Header } from "@/components/header"
import { AdminDashboard } from "@/components/admin-dashboard"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function AdminDashboardPage() {
  // Check if admin is logged in
  const cookieStore = cookies()
  const isLoggedIn = cookieStore.get("admin_logged_in")?.value === "true"

  if (!isLoggedIn) {
    redirect("/admin")
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <AdminDashboard />
      </div>
    </main>
  )
}

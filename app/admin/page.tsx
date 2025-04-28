import { AdminLogin } from "@/components/admin-login"
import { AdminCredentialsHelper } from "@/components/admin-credentials-helper"
import { Header } from "@/components/header"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default function AdminPage() {
  // Check if admin is logged in
  const cookieStore = cookies()
  const isLoggedIn = cookieStore.get("admin_logged_in")?.value === "true"

  if (isLoggedIn) {
    // If logged in, redirect to admin dashboard
    redirect("/admin/dashboard")
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        <AdminLogin />
        <AdminCredentialsHelper />
      </div>
    </main>
  )
}

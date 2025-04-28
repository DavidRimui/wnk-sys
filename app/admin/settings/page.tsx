import { Header } from "@/components/header"
import { AdminSettings } from "@/components/admin-settings"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth"

export default async function AdminSettingsPage() {
  // Check if admin is logged in
  const admin = await isAdmin()

  if (!admin) {
    redirect("/admin")
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">System Settings</h1>
        <AdminSettings />
      </div>
    </main>
  )
}

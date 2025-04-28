"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Voting System
        </Link>
        <div className="flex items-center gap-4">
          {!isAdmin && (
            <Button asChild variant="outline">
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          )}
          {isAdmin && (
            <Button asChild variant="outline">
              <Link href="/">Back to Voting</Link>
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

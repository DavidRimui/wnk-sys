"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function AdminCredentialsHelper() {
  const [showCredentials, setShowCredentials] = useState(false)

  return (
    <Card className="mt-6 max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Admin Credentials</CardTitle>
        <CardDescription>Use these credentials for testing the admin dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        {showCredentials ? (
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Email:</span> agamirashadrack7@gmail.com
            </div>
            <div>
              <span className="font-semibold">Password:</span> v0t!ngsys@2025
            </div>
          </div>
        ) : (
          <p>Click the button below to reveal the admin credentials for testing.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => setShowCredentials(!showCredentials)} className="w-full">
          {showCredentials ? "Hide Credentials" : "Show Credentials"}
        </Button>
      </CardFooter>
    </Card>
  )
}

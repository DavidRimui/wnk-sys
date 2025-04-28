"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function EnvChecker() {
  const [showDetails, setShowDetails] = useState(false)
  const [envStatus, setEnvStatus] = useState<{
    kittyAuthCode: boolean
    appUrl: boolean
  }>({
    kittyAuthCode: false,
    appUrl: false,
  })

  useEffect(() => {
    setEnvStatus({
      kittyAuthCode: !!process.env.NEXT_PUBLIC_KITTY_AUTH_CODE,
      appUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    })
  }, [])

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Environment Variables Status</CardTitle>
        <CardDescription>Check if environment variables are properly loaded</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">NEXT_PUBLIC_KITTY_AUTH_CODE:</span>
            <span className={`px-2 py-1 rounded text-white ${envStatus.kittyAuthCode ? "bg-green-500" : "bg-red-500"}`}>
              {envStatus.kittyAuthCode ? "Available" : "Missing"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">NEXT_PUBLIC_APP_URL:</span>
            <span className={`px-2 py-1 rounded text-white ${envStatus.appUrl ? "bg-green-500" : "bg-red-500"}`}>
              {envStatus.appUrl ? "Available" : "Missing"}
            </span>
          </div>

          {showDetails && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
              <h3 className="font-medium mb-2">Environment Variable Details:</h3>
              <p className="text-sm mb-2">
                <span className="font-medium">NEXT_PUBLIC_KITTY_AUTH_CODE:</span>{" "}
                {process.env.NEXT_PUBLIC_KITTY_AUTH_CODE
                  ? `${process.env.NEXT_PUBLIC_KITTY_AUTH_CODE.substring(0, 10)}...`
                  : "Not available"}
              </p>
              <p className="text-sm">
                <span className="font-medium">NEXT_PUBLIC_APP_URL:</span>{" "}
                {process.env.NEXT_PUBLIC_APP_URL || "Not available"}
              </p>
            </div>
          )}

          <Button onClick={() => setShowDetails(!showDetails)} className="w-full">
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

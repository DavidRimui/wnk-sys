"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getSettings, updateSettings, getAuditLogs } from "@/lib/actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, logsData] = await Promise.all([getSettings(), getAuditLogs(100)])

        setSettings(settingsData)
        setAuditLogs(logsData)
      } catch (error) {
        console.error("Failed to fetch settings:", error)
        toast({
          title: "Error",
          description: "Failed to load settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleToggleSetting = async (key: string, value: boolean) => {
    try {
      setIsSaving(true)
      await updateSettings(key, value.toString())
      setSettings((prev) => ({ ...prev, [key]: value.toString() }))
      toast({
        title: "Setting Updated",
        description: `${key} has been ${value ? "enabled" : "disabled"}.`,
      })
    } catch (error) {
      console.error(`Failed to update ${key}:`, error)
      toast({
        title: "Error",
        description: `Failed to update ${key}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      setIsSaving(true)
      await updateSettings(key, value)
      setSettings((prev) => ({ ...prev, [key]: value }))
      toast({
        title: "Setting Updated",
        description: `${key} has been updated.`,
      })
    } catch (error) {
      console.error(`Failed to update ${key}:`, error)
      toast({
        title: "Error",
        description: `Failed to update ${key}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General Settings</TabsTrigger>
        <TabsTrigger value="payment">Payment Settings</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="logs">Audit Logs</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Configure general system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="voting-enabled">Enable Voting</Label>
                <p className="text-sm text-muted-foreground">Allow users to vote for candidates</p>
              </div>
              <Switch
                id="voting-enabled"
                checked={settings.votingEnabled === "true"}
                onCheckedChange={(checked) => handleToggleSetting("votingEnabled", checked)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="system-name">System Name</Label>
              <Input
                id="system-name"
                value={settings.systemName || "Candidate Voting System"}
                onChange={(e) => handleUpdateSetting("systemName", e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vote-price">Vote Price (Kshs)</Label>
              <Input
                id="vote-price"
                type="number"
                value={settings.votePrice || "10"}
                onChange={(e) => handleUpdateSetting("votePrice", e.target.value)}
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payment" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>Configure payment integration settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kitty-id">Kitty ID</Label>
              <Input
                id="kitty-id"
                value={settings.kittyId || "5458"}
                onChange={(e) => handleUpdateSetting("kittyId", e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="mpesa-enabled">Enable M-Pesa</Label>
                <p className="text-sm text-muted-foreground">Allow payments via M-Pesa</p>
              </div>
              <Switch
                id="mpesa-enabled"
                checked={settings.mpesaEnabled !== "false"}
                onCheckedChange={(checked) => handleToggleSetting("mpesaEnabled", checked)}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="airtel-enabled">Enable Airtel Money</Label>
                <p className="text-sm text-muted-foreground">Allow payments via Airtel Money</p>
              </div>
              <Switch
                id="airtel-enabled"
                checked={settings.airtelEnabled !== "false"}
                onCheckedChange={(checked) => handleToggleSetting("airtelEnabled", checked)}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="card-enabled">Enable Card Payments</Label>
                <p className="text-sm text-muted-foreground">Allow payments via credit/debit cards</p>
              </div>
              <Switch
                id="card-enabled"
                checked={settings.cardEnabled !== "false"}
                onCheckedChange={(checked) => handleToggleSetting("cardEnabled", checked)}
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-verification">Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">Require users to verify their email before voting</p>
              </div>
              <Switch
                id="require-verification"
                checked={settings.requireEmailVerification === "true"}
                onCheckedChange={(checked) => handleToggleSetting("requireEmailVerification", checked)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-votes-per-user">Maximum Votes Per User</Label>
              <Input
                id="max-votes-per-user"
                type="number"
                value={settings.maxVotesPerUser || "100"}
                onChange={(e) => handleUpdateSetting("maxVotesPerUser", e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                value={settings.webhookUrl || ""}
                onChange={(e) => handleUpdateSetting("webhookUrl", e.target.value)}
                disabled={isSaving}
                placeholder="https://your-domain.com/api/kitty-callback"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="logs" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>System activity logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.userId || "System"}</TableCell>
                      <TableCell>
                        {log.details ? (
                          <pre className="text-xs overflow-auto max-w-xs">{JSON.stringify(log.details, null, 2)}</pre>
                        ) : (
                          <span className="text-muted-foreground">No details</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

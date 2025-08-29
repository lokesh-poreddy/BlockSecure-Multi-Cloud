"use client"

import { Dashboard } from "@/components/dashboard"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <main className="min-h-screen bg-background">
      <Dashboard />
    </main>
  )
}

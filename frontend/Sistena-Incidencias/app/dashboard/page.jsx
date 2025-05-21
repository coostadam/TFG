"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminDashboard } from "@/components/admin-dashboard"
import { TecnicoDashboard } from "@/components/tecnico-dashboard"
import { GestorDashboard } from "@/components/gestor-dashboard"
import { UsuarioDashboard } from "@/components/usuario-dashboard"

export default function DashboardPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const role = localStorage.getItem("userRole")
    if (!role) {
      router.push("/login")
      return
    }

    setUserRole(role)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      {userRole === "admin" && <AdminDashboard />}
      {userRole === "tecnico" && <TecnicoDashboard />}
      {userRole === "gestor" && <GestorDashboard />}
      {userRole === "usuario" && <UsuarioDashboard />}
    </DashboardLayout>
  )
}

"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, ClipboardList, Filter, Plus, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CrearIncidenciaDialog } from "@/components/crear-incidencia-dialog"
import { mockIncidencias } from "@/lib/mock-data"

export function UsuarioDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [incidencias, setIncidencias] = useState([])
  const [filteredIncidencias, setFilteredIncidencias] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [filters, setFilters] = useState({
    estado: "",
    prioridad: "",
  })

  // Diálogos
  const [crearIncidenciaOpen, setCrearIncidenciaOpen] = useState(false)

  useEffect(() => {
    // Inicializar datos - filtrar solo las incidencias del usuario actual
    setIncidencias(mockIncidencias.filter((inc) => inc.creador === "usuario@example.com"))
  }, [])

  useEffect(() => {
    // Filtrar incidencias según la búsqueda y filtros
    let filtered = [...incidencias]

    // Aplicar filtros de estado y prioridad
    if (filters.estado) {
      filtered = filtered.filter((inc) => inc.estado === filters.estado)
    }

    if (filters.prioridad) {
      filtered = filtered.filter((inc) => inc.prioridad === filters.prioridad)
    }

    // Aplicar búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (inc) =>
          inc.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || inc.id.toString().includes(searchQuery),
      )
    }

    // Aplicar ordenamiento
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredIncidencias(filtered)
  }, [incidencias, searchQuery, sortConfig, filters])

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleSaveIncidencia = (incidenciaData) => {
    // Crear nueva incidencia
    const newIncidencia = {
      id: Math.max(...mockIncidencias.map((inc) => inc.id)) + 1,
      creador: "usuario@example.com",
      fechaCreacion: new Date().toISOString().split("T")[0],
      ...incidenciaData,
    }
    setIncidencias([...incidencias, newIncidencia])
    setCrearIncidenciaOpen(false)
  }

  const resetFilters = () => {
    setFilters({
      estado: "",
      prioridad: "",
    })
    setSortConfig({ key: null, direction: "asc" })
    setSearchQuery("")
  }

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "Abierta":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" /> {estado}
          </Badge>
        )
      case "En proceso":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            <RefreshCw className="mr-1 h-3 w-3" /> {estado}
          </Badge>
        )
      case "Cerrada":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> {estado}
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const getPrioridadBadge = (prioridad) => {
    switch (prioridad) {
      case "Alta":
        return <Badge className="bg-red-500">{prioridad}</Badge>
      case "Media":
        return <Badge className="bg-yellow-500">{prioridad}</Badge>
      case "Baja":
        return <Badge className="bg-green-500">{prioridad}</Badge>
      default:
        return <Badge>{prioridad}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mis Incidencias</h1>
          <p className="text-muted-foreground">Gestiona tus incidencias y solicitudes.</p>
        </div>
        <Button onClick={() => setCrearIncidenciaOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Incidencia
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidencias</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidencias.length}</div>
            <p className="text-xs text-muted-foreground">
              {incidencias.filter((inc) => inc.estado === "Cerrada").length} resueltas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abiertas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidencias.filter((inc) => inc.estado === "Abierta").length}</div>
            <p className="text-xs text-muted-foreground">
              {incidencias.filter((inc) => inc.estado === "Abierta" && inc.prioridad === "Alta").length} de alta
              prioridad
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidencias.filter((inc) => inc.estado === "En proceso").length}</div>
            <p className="text-xs text-muted-foreground">Siendo atendidas por técnicos</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold">Listado de Incidencias</h2>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <div className="p-2 space-y-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Estado</label>
                    <Select value={filters.estado} onValueChange={(value) => setFilters({ ...filters, estado: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Abierta">Abierta</SelectItem>
                        <SelectItem value="En proceso">En proceso</SelectItem>
                        <SelectItem value="Cerrada">Cerrada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Prioridad</label>
                    <Select
                      value={filters.prioridad}
                      onValueChange={(value) => setFilters({ ...filters, prioridad: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Baja">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-2" onClick={resetFilters}>
                    Limpiar filtros
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("id")}>
                      ID {sortConfig.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("titulo")}>
                      Título {sortConfig.key === "titulo" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("estado")}>
                      Estado {sortConfig.key === "estado" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("prioridad")}>
                      Prioridad {sortConfig.key === "prioridad" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </Button>
                  </TableHead>
                  <TableHead>Técnico Asignado</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("fechaCreacion")}>
                      Fecha {sortConfig.key === "fechaCreacion" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidencias.length > 0 ? (
                  filteredIncidencias.map((incidencia) => (
                    <TableRow key={incidencia.id}>
                      <TableCell className="font-medium">#{incidencia.id}</TableCell>
                      <TableCell>{incidencia.titulo}</TableCell>
                      <TableCell>{getEstadoBadge(incidencia.estado)}</TableCell>
                      <TableCell>{getPrioridadBadge(incidencia.prioridad)}</TableCell>
                      <TableCell>{incidencia.tecnico || "Sin asignar"}</TableCell>
                      <TableCell>{incidencia.fechaCreacion}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No has creado ninguna incidencia
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Diálogos */}
      <CrearIncidenciaDialog
        open={crearIncidenciaOpen}
        onOpenChange={setCrearIncidenciaOpen}
        onSave={handleSaveIncidencia}
        tecnicos={[]}
        isUsuario={true}
      />
    </div>
  )
}

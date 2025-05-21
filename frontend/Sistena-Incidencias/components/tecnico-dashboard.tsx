"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Clock, Filter, Plus, RefreshCw, Search, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CrearIncidenciaDialog } from "@/components/crear-incidencia-dialog"
import { ResolverIncidenciaDialog } from "@/components/resolver-incidencia-dialog"
import { mockIncidencias } from "@/lib/mock-data"

export function TecnicoDashboard() {
  const [activeTab, setActiveTab] = useState("asignadas")
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
  const [resolverIncidenciaOpen, setResolverIncidenciaOpen] = useState(false)
  const [currentIncidencia, setCurrentIncidencia] = useState(null)

  useEffect(() => {
    // Inicializar datos
    setIncidencias(mockIncidencias)
  }, [])

  useEffect(() => {
    // Filtrar incidencias según la pestaña activa y la búsqueda
    let filtered = [...incidencias]

    if (activeTab === "asignadas") {
      filtered = filtered.filter((inc) => inc.tecnico === "tecnico@example.com")
    } else if (activeTab === "propias") {
      filtered = filtered.filter((inc) => inc.creador === "tecnico@example.com")
    }

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
  }, [incidencias, activeTab, searchQuery, sortConfig, filters])

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleResolverIncidencia = (incidencia) => {
    setCurrentIncidencia(incidencia)
    setResolverIncidenciaOpen(true)
  }

  const handleSaveIncidencia = (incidenciaData) => {
    // Crear nueva incidencia
    const newIncidencia = {
      id: Math.max(...incidencias.map((inc) => inc.id)) + 1,
      creador: "tecnico@example.com",
      fechaCreacion: new Date().toISOString().split("T")[0],
      ...incidenciaData,
    }
    setIncidencias([...incidencias, newIncidencia])
    setCrearIncidenciaOpen(false)
  }

  const handleResolverGuardar = (resolucion) => {
    // Actualizar incidencia resuelta
    setIncidencias(
      incidencias.map((inc) => (inc.id === currentIncidencia.id ? { ...inc, estado: "Cerrada", resolucion } : inc)),
    )
    setResolverIncidenciaOpen(false)
    setCurrentIncidencia(null)
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

  const incidenciasAsignadas = incidencias.filter((inc) => inc.tecnico === "tecnico@example.com")
  const incidenciasAbiertas = incidenciasAsignadas.filter((inc) => inc.estado !== "Cerrada")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel de Técnico</h1>
          <p className="text-muted-foreground">Gestiona las incidencias asignadas a ti.</p>
        </div>
        <Button onClick={() => setCrearIncidenciaOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Incidencia
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidencias Asignadas</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidenciasAsignadas.length}</div>
            <p className="text-xs text-muted-foreground">
              {incidenciasAsignadas.filter((inc) => inc.estado === "Cerrada").length} resueltas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidenciasAbiertas.length}</div>
            <p className="text-xs text-muted-foreground">
              {incidenciasAbiertas.filter((inc) => inc.prioridad === "Alta").length} de alta prioridad
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {incidenciasAsignadas.filter((inc) => inc.estado === "En proceso").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (incidenciasAsignadas.filter((inc) => inc.estado === "En proceso").length /
                  incidenciasAsignadas.length) *
                  100,
              ) || 0}
              % del total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="asignadas" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="asignadas">Incidencias Asignadas</TabsTrigger>
            <TabsTrigger value="propias">Mis Incidencias</TabsTrigger>
          </TabsList>

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
                        <SelectItem value="todos">Todos</SelectItem>
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
                        <SelectItem value="todas">Todas</SelectItem>
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

        <TabsContent value="asignadas" className="space-y-4">
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
                    <TableHead>Creador</TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("fechaCreacion")}>
                        Fecha {sortConfig.key === "fechaCreacion" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
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
                        <TableCell>{incidencia.creador}</TableCell>
                        <TableCell>{incidencia.fechaCreacion}</TableCell>
                        <TableCell className="text-right">
                          {incidencia.estado !== "Cerrada" && (
                            <Button variant="outline" size="sm" onClick={() => handleResolverIncidencia(incidencia)}>
                              Resolver
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No se encontraron incidencias asignadas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="propias" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      {/* Diálogos */}
      <CrearIncidenciaDialog
        open={crearIncidenciaOpen}
        onOpenChange={setCrearIncidenciaOpen}
        onSave={handleSaveIncidencia}
        tecnicos={[]}
        isTecnico={true}
      />

      <ResolverIncidenciaDialog
        open={resolverIncidenciaOpen}
        onOpenChange={setResolverIncidenciaOpen}
        incidencia={currentIncidencia}
        onSave={handleResolverGuardar}
      />
    </div>
  )
}

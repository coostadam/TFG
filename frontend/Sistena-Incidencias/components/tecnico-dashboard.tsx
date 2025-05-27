"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Clock, Filter, Plus, RefreshCw, Search, Wrench, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResolverIncidenciaDialog } from "@/components/resolver-incidencia-dialog"
import { CrearTipoIncidenciaDialog } from "@/components/CrearTipoIncidenciaDialog"

interface Incidencia {
  id: number
  descripcion: string
  estado: string
  prioridad: string
  titulo?: string
  fechaCreacion: string
  usuario: {
    username: string
  }
  tecnico: {
    username?: string
  }
}

export function TecnicoDashboard() {
  const [activeTab, setActiveTab] = useState("asignadas")
  const [searchQuery, setSearchQuery] = useState("")
  const [incidencias, setIncidencias] = useState<Incidencia[]>([])
  const [filteredIncidencias, setFilteredIncidencias] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [filters, setFilters] = useState({
    estado: "",
    prioridad: "",
  })

  // Diálogos
  const [resolverIncidenciaOpen, setResolverIncidenciaOpen] = useState(false)
  const [currentIncidencia, setCurrentIncidencia] = useState(null)
  const [crearTipoIncidenciaOpen, setCrearTipoIncidenciaOpen] = useState(false)

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const response = await fetch("http://localhost:8080/ServiceNow/resources/tecnico/incidencias/misIncidencias", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al obtener incidencias");
        }

        const data = await response.json();

        setIncidencias(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchIncidencias();
  }, [])

  useEffect(() => {
    // Filtrar incidencias según la pestaña activa y la búsqueda
    let filtered = [...incidencias]

    if (filters.estado && filters.estado !== "all") {
      filtered = filtered.filter((inc) => inc.estado === filters.estado)
    }

    if (filters.prioridad && filters.prioridad !== "all") {
      filtered = filtered.filter((inc) => inc.prioridad === filters.prioridad)
    }

    // Aplicar búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (inc) =>
          inc.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) || inc.id.toString().includes(searchQuery),
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

  const handleResolverGuardar = async (resolucion) => {
    try {
      const response = await fetch(`http://localhost:8080/ServiceNow/resources/tecnico/cerrarIncidencia/${currentIncidencia.id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ solucion: resolucion })
      });

      if (response.ok) {
        setCurrentIncidencia(null);
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error("Error al cerrar incidencia:", errorText);
        alert("No se pudo cerrar la incidencia: " + errorText);
      }
    } catch (error) {
      console.error("Error de red al cerrar incidencia:", error);
      alert("Error de red al cerrar la incidencia");
    }
  };

  const handleGuardarTipoIncidencia = async (nuevoTipo) => {
    try {
      const tipoNormalizado = nuevoTipo.nombre.trim().replace(/\s+/g, ' ');
      const tipoUrl = encodeURIComponent(tipoNormalizado);

      const response = await fetch(`http://localhost:8080/ServiceNow/resources/tecnico/addTipo/${tipoUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoTipo),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Error al guardar: " + errorText);
        return;
      }

      alert("Tipo de incidencia creado correctamente");
      setCrearTipoIncidenciaOpen(false);

    } catch (error) {
      alert("Error de red: " + error.message);
    }
  };

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
      case "ALTA":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" /> {estado}
          </Badge>
        )
      case "EN_ESPERA":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            <RefreshCw className="mr-1 h-3 w-3" /> EN ESPERA
          </Badge>
        )
      case "CERRADA_EXITO":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> CERRADA EXITO
          </Badge>
        )
      case "ASIGNADA":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
            <UserCheck className="mr-1 h-3 w-3" /> {estado}
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const getPrioridadBadge = (prioridad) => {
    switch (prioridad) {
      case "MUY_ALTA":
        return <Badge className="bg-red-500">MUY ALTA</Badge>
      case "ALTA":
        return <Badge className="bg-orange-500">{prioridad}</Badge>
      case "MEDIA":
        return <Badge className="bg-yellow-500">{prioridad}</Badge>
      case "BAJA":
        return <Badge className="bg-green-500">{prioridad}</Badge>
      default:
        return <Badge>{prioridad}</Badge>
    }
  }

  const incidenciasAsignadas = incidencias.filter((inc) => inc.tecnico.username === localStorage.getItem("userEmail"))
  const incidenciasAbiertas = incidenciasAsignadas.filter((inc) => inc.estado !== "CERRADA_EXITO")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel de Técnico</h1>
          <p className="text-muted-foreground">Gestiona las incidencias asignadas a ti.</p>
        </div>
        <Button onClick={() => setCrearTipoIncidenciaOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />  Añadir Tipo Incidencia
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
              {incidenciasAsignadas.filter((inc) => inc.estado === "CERRADA_EXITO").length} resueltas
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
              {incidenciasAbiertas.filter((inc) => inc.prioridad === "MUY_ALTA").length} de muy alta prioridad
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
              {incidenciasAsignadas.filter((inc) => inc.estado === "ASIGNADA").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (incidenciasAsignadas.filter((inc) => inc.estado === "ASIGNADA").length /
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
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="ALTA">Alta</SelectItem>
                        <SelectItem value="ASIGNADA">Asignada</SelectItem>
                        <SelectItem value="CERRADA_EXITO">Cerrada</SelectItem>
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
                        <SelectItem value="MUY_ALTA">Muy alta</SelectItem>
                        <SelectItem value="ALTA">Alta</SelectItem>
                        <SelectItem value="MEDIA">Media</SelectItem>
                        <SelectItem value="BAJA">Baja</SelectItem>
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
                        <TableCell>{incidencia.descripcion}</TableCell>
                        <TableCell>{getEstadoBadge(incidencia.estado)}</TableCell>
                        <TableCell>{getPrioridadBadge(incidencia.prioridad)}</TableCell>
                        <TableCell>{incidencia.usuario.username}</TableCell>
                        <TableCell>{incidencia.fechaCreacion.replace(/Z$/, "")}</TableCell>
                        <TableCell className="text-right">
                          {incidencia.estado !== "CERRADA_EXITO" && (
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
                        <TableCell>{incidencia.descripcion}</TableCell>
                        <TableCell>{getEstadoBadge(incidencia.estado)}</TableCell>
                        <TableCell>{getPrioridadBadge(incidencia.prioridad)}</TableCell>
                        <TableCell>{incidencia.tecnico.username || "Sin asignar"}</TableCell>
                        <TableCell>{incidencia.fechaCreacion.replace(/Z$/, "")}</TableCell>
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

      <ResolverIncidenciaDialog
        open={resolverIncidenciaOpen}
        onOpenChange={setResolverIncidenciaOpen}
        incidencia={currentIncidencia}
        onSave={handleResolverGuardar}
      />

      <CrearTipoIncidenciaDialog
        open={crearTipoIncidenciaOpen}
        onOpenChange={setCrearTipoIncidenciaOpen}
        onSave={handleGuardarTipoIncidencia}
      />

    </div>
  )
}

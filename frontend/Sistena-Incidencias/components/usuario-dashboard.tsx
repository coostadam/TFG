"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, ClipboardList, Filter, Plus, RefreshCw, Search, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CrearIncidenciaDialog } from "@/components/crear-incidencia-dialog"

export function UsuarioDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [incidencias, setIncidencias] = useState([])
  const [filteredIncidencias, setFilteredIncidencias] = useState([])
  const [tipos, setTipos] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [filters, setFilters] = useState({
    estado: "",
    prioridad: "",
  })

  // Diálogos
  const [crearIncidenciaOpen, setCrearIncidenciaOpen] = useState(false)

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const response = await fetch("http://localhost:8080/ServiceNow/resources/user/incidencias", {
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
  }, []);


   useEffect(() => {
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
  }, [incidencias, searchQuery, sortConfig, filters])

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleSaveIncidencia = async (incidenciaData) => {
    try {
      const response = await fetch("http://localhost:8080/ServiceNow/resources/user/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(incidenciaData),
      });

      if (!response.ok) {
        throw new Error("Error al crear la incidencia");
      }

      const nuevaIncidencia = await response.json();

      // Actualizar la lista sin necesidad de recargar desde cero
      setIncidencias((prev) => [...prev, nuevaIncidencia]);
      setCrearIncidenciaOpen(false);
    } catch (error) {
      console.error("Error creando incidencia:", error);
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

  useEffect(() => {
    const fecthTipos = async () => {
      try {
        const response = await fetch("http://localhost:8080/ServiceNow/resources/user/tipos", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al obtener los tipos");
        }

        const data = await response.json();

        setTipos(data);
      } catch (error) {
        console.error(error);
      }
    }

    fecthTipos();
  }, []);


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
              {incidencias.filter((inc) => inc.estado === "CERRADA_EXITO").length} resueltas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abiertas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidencias.filter((inc) => inc.estado === "ALTA").length}</div>
            <p className="text-xs text-muted-foreground">
              {incidencias.filter((inc) => inc.estado === "ALTA" && inc.prioridad === "MUY_ALTA").length} de muy alta
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
            <div className="text-2xl font-bold">{incidencias.filter((inc) => inc.estado === "ASIGNADA").length}</div>
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
                        <SelectItem value="ALTA">Alta</SelectItem>
                        <SelectItem value="EN_ESPERA">En espera</SelectItem>
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

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("id")}>
                      Nº {sortConfig.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("descripcion")}>
                      Título {sortConfig.key === "descripcion" && (sortConfig.direction === "asc" ? "↑" : "↓")}
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
                      <TableCell className="font-medium">{incidencia.id}</TableCell>
                      <TableCell>{incidencia.descripcion}</TableCell>
                      <TableCell>{getEstadoBadge(incidencia.estado)}</TableCell>
                      <TableCell>{getPrioridadBadge(incidencia.prioridad)}</TableCell>
                      <TableCell>{incidencia.tecnico?.username || "Sin asignar"}</TableCell>
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
      </div>

      {/* Diálogos */}
      <CrearIncidenciaDialog
        open={crearIncidenciaOpen}
        onOpenChange={setCrearIncidenciaOpen}
        onSave={handleSaveIncidencia}
        tecnicos={[]}
        isUsuario={true}
        tipos={tipos}
      />
    </div>
  )
}

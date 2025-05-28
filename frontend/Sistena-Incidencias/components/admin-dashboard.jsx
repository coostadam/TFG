"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  ClipboardList,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CrearIncidenciaDialog } from "@/components/crear-incidencia-dialog"
import { EditarIncidenciaDialog } from "@/components/editar-incidencia-dialog"
import { EditarUsuarioDialog } from "@/components/editar-usuario-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { mockIncidencias, mockTecnicos } from "@/lib/mock-data"

export function AdminDashboard() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState("todas")
  const [searchQuery, setSearchQuery] = useState("")
  const [incidencias, setIncidencias] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [filteredIncidencias, setFilteredIncidencias] = useState([])
  const [filteredUsuarios, setFilteredUsuarios] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [filters, setFilters] = useState({
    estado: "",
    prioridad: "",
  })

  // Diálogos
  const [editarUsuarioOpen, setEditarUsuarioOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const response = await fetch("http://localhost:8080/ServiceNow/resources/admin/allIncidencias", {
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

    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:8080/ServiceNow/resources/admin/allUsers", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al obtener usuarios");
        }

        const data = await response.json();

        setUsuarios(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsuarios();
  }, [tabParam])

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

  useEffect(() => {
    // Filtrar usuarios según la búsqueda
    let filtered = [...usuarios]

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.apellido?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.correo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.usuario?.toLowerCase().includes(searchQuery.toLowerCase()),
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

    setFilteredUsuarios(filtered)
  }, [usuarios, searchQuery, sortConfig])

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleEditUsuario = (usuario) => {
    setCurrentItem(usuario)
    setEditarUsuarioOpen(true)
  }

  const handleEditIncidencia = async (incidencia) => {
    setCurrentItem(incidencia);

    try {
      const response = await fetch(`http://localhost:8080/ServiceNow/resources/admin/incidenciaEspera/${incidencia.id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al obtener usuarios");
      }

      window.location.reload();

    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteConfirm = async (usuario) => {
    const confirmado = window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${usuario.usuario}?`)
    if (!confirmado) return

    try {
      const response = await fetch(`http://localhost:8080/ServiceNow/resources/admin/deleteUser/${usuario.usuario}`, {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        alert("Usuario eliminado correctamente.")
        setUsuarios((prevUsuarios) => prevUsuarios.filter((u) => u.usuario !== usuario.usuario))
        window.location.reload();
      } else {
        const error = await response.text()
        alert(`Error al eliminar el usuario: ${error}`)
      }
    } catch (error) {
      console.error("Error en la eliminación:", error)
      alert("Error al conectar con el servidor.")
    }
  }



  const handleSaveUsuario = (usuarioData) => {
    if (currentItem) {
      // Editar usuario existente
      const usuariosActualizados = usuarios.map((user) =>
        user.id === currentItem.id ? { ...user, ...usuarioData } : user,
      )

      // Guardar en localStorage
      localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados))
      setUsuarios(usuariosActualizados)
    }
    setEditarUsuarioOpen(false)
    setCurrentItem(null)
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

  const getRolBadge = (tipo) => {
    switch (tipo) {
      case "ADMINISTRADOR":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
            Administrador
          </Badge>
        )
      case "TECNICO":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            Técnico
          </Badge>
        )
      case "GESTOR":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            Gestor
          </Badge>
        )
      case "USUARIO_BASICO":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            Usuario
          </Badge>
        )
      default:
        return <Badge variant="outline">{tipo}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel de Administrador</h1>
          <p className="text-muted-foreground">Gestiona todas las incidencias y usuarios del sistema.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidencias</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidencias.length}</div>
            <p className="text-xs text-muted-foreground">
              +{incidencias.filter((inc) => inc.fechaCreacion.replace(/Z$/, "") === new Date().toISOString().split("T")[0]).length} hoy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidencias Abiertas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidencias.filter((inc) => inc.estado === "ALTA").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((incidencias.filter((inc) => inc.estado === "ALTA").length / incidencias.length) * 100)}%
              del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asignadas</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidencias.filter((inc) => inc.estado === "ASIGNADAS").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((incidencias.filter((inc) => inc.estado === "ASIGNADAS").length / incidencias.length) * 100)}
              % del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Registrados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.length}</div>
            <p className="text-xs text-muted-foreground">
              {usuarios.filter((user) => user.tipoUsuario === "TECNICO").length} técnicos disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="todas">Todas las Incidencias</TabsTrigger>
            <TabsTrigger value="usuarios">Gestión de Usuarios</TabsTrigger>
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
            {(activeTab === "todas" || activeTab === "propias") && (
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
            )}
          </div>
        </div>

        <TabsContent value="todas" className="space-y-4">
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
                        <TableCell>{incidencia.tecnico ? incidencia.tecnico.username : "Sin asignar"}</TableCell>
                        <TableCell>{incidencia.fechaCreacion.replace(/Z$/, "")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditIncidencia(incidencia)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No se encontraron incidencias
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
                        <TableCell>{incidencia.tecnico ? incidencia.tecnico.username : "Sin asignar"}</TableCell>
                        <TableCell>{incidencia.fechaCreacion}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditIncidencia(incidencia)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No has creado ninguna incidencia
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-4">
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
                      <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("nombre")}>
                        Nombre {sortConfig.key === "nombre" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("apellidos")}>
                        Apellido {sortConfig.key === "apellidos" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("email")}>
                        Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("telefono")}>
                        Teléfono {sortConfig.key === "telefono" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("tipo")}>
                        Rol {sortConfig.key === "tipo" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.length > 0 ? (
                    filteredUsuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">#{usuario.id}</TableCell>
                        <TableCell>{usuario.nombre}</TableCell>
                        <TableCell>{usuario.apellido}</TableCell>
                        <TableCell>{usuario.correo}</TableCell>
                        <TableCell>{usuario.tlfno}</TableCell>
                        <TableCell>{getRolBadge(usuario.tipoUsuario)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditUsuario(usuario)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleDeleteConfirm(usuario)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No se encontraron usuarios
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

      <EditarUsuarioDialog
        open={editarUsuarioOpen}
        onOpenChange={setEditarUsuarioOpen}
        usuario={currentItem}
        onSave={handleSaveUsuario}
        tiposUsuario={["ADMINISTRADOR", "TECNICO", "GESTOR", "USUARIO_BASICO"]}
      />
    </div>
  )
}

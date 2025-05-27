"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EditarUsuarioDialog({ open, onOpenChange, usuario, onSave, tiposUsuario = [] }) {
  const [nombre, setNombre] = useState("")
  const [apellido, setApellidos] = useState("")
  const [correo, setEmail] = useState("")
  const [tlfno, setTelefono] = useState("")
  const [tipoUsuario, setTipo] = useState("")

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || "")
      setApellidos(usuario.apellido || "")
      setEmail(usuario.correo || "")
      setTelefono(usuario.tlfno || "")
      setTipo(usuario.tipoUsuario || "")
    }
  }, [usuario])

  const handleSubmit = (e) => {
    e.preventDefault()

    const usuarioData = {
      nombre,
      apellido,
      correo,
      tlfno,
      tipoUsuario,
    }

    onSave(usuarioData)
  }

  if (!usuario) return null

  // Mapeo de tipos de usuario para mostrar nombres más amigables
  const tipoLabels = {
    admin: "Administrador",
    tecnico: "Técnico",
    gestor: "Gestor",
    usuario: "Usuario",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>Modifica los detalles del usuario.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input id="apellidos" value={apellido} onChange={(e) => setApellidos(e.target.value)} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={correo} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" value={tlfno} onChange={(e) => setTelefono(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Rol del Usuario</Label>
              <Select value={tipoUsuario} onValueChange={setTipo} required>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecciona el rol de usuario" />
                </SelectTrigger>
                <SelectContent>
                  {tiposUsuario.map((tipo, index) => (
                    <SelectItem key={index} value={tipo}>
                      {tipoLabels[tipo] || tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

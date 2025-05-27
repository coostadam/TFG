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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EditarIncidenciaDialog({ open, onOpenChange, incidencia, onSave, tecnicos = [], isGestor = false }) {
  const [titulo, setTitulo] = useState("")
  const [prioridad, setPrioridad] = useState("")
  const [estado, setEstado] = useState("")
  const [tecnico, setTecnico] = useState("")

  useEffect(() => {
    if (incidencia) {
      setTitulo(incidencia.descripcion || "")
      setPrioridad(incidencia.prioridad || "")
      setEstado(incidencia.estado || "")
      setTecnico(incidencia.tecnico || "")
    }
  }, [incidencia])

  const handleSubmit = (e) => {
    e.preventDefault()

    const incidenciaData = {
      tecnico: tecnico === "no-asignado" ? null : tecnico,
    }

    onSave(incidenciaData)
  }

  if (!incidencia) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Incidencia #{incidencia.id}</DialogTitle>
          <DialogDescription>Solo puedes cambiar el técnico asignado.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" value={titulo} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select value={prioridad} onValueChange={setPrioridad} disabled>
                  <SelectTrigger id="prioridad">
                    <SelectValue placeholder="Selecciona la prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MUY_ALTA">Muy alta</SelectItem>
                    <SelectItem value="ALTA">Alta</SelectItem>
                    <SelectItem value="MEDIA">Media</SelectItem>
                    <SelectItem value="BAJA">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={estado} onValueChange={setEstado} disabled>
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALTA">Alta</SelectItem>
                    <SelectItem value="ASIGNADA">Asignada</SelectItem>
                    <SelectItem value="CERRADA_EXITO">Cerrada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {tecnicos.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="tecnico">Técnico Asignado</Label>
                <Select value={tecnico || "no-asignado"} onValueChange={setTecnico}>
                  <SelectTrigger id="tecnico">
                    <SelectValue placeholder="Selecciona un técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-asignado">Sin asignar</SelectItem>
                    {tecnicos.map((tec) => (
                      <SelectItem key={tec.correo} value={tec.correo}>
                        {tec.nombre} {tec.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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

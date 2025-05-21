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
  const [descripcion, setDescripcion] = useState("")
  const [prioridad, setPrioridad] = useState("")
  const [estado, setEstado] = useState("")
  const [tecnico, setTecnico] = useState("")

  useEffect(() => {
    if (incidencia) {
      setTitulo(incidencia.titulo || "")
      setDescripcion(incidencia.descripcion || "")
      setPrioridad(incidencia.prioridad || "Media")
      setEstado(incidencia.estado || "Abierta")
      setTecnico(incidencia.tecnico || "")
    }
  }, [incidencia])

  const handleSubmit = (e) => {
    e.preventDefault()

    const incidenciaData = {
      titulo,
      descripcion,
      prioridad,
      estado,
      tecnico: tecnico || null,
    }

    onSave(incidenciaData)
  }

  if (!incidencia) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Incidencia #{incidencia.id}</DialogTitle>
          <DialogDescription>Modifica los detalles de la incidencia.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select value={prioridad} onValueChange={setPrioridad} required>
                  <SelectTrigger id="prioridad">
                    <SelectValue placeholder="Selecciona la prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={estado} onValueChange={setEstado} required>
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Abierta">Abierta</SelectItem>
                    <SelectItem value="En proceso">En proceso</SelectItem>
                    <SelectItem value="Cerrada">Cerrada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(isGestor || !isGestor) && tecnicos.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="tecnico">Técnico Asignado</Label>
                <Select value={tecnico} onValueChange={setTecnico}>
                  <SelectTrigger id="tecnico">
                    <SelectValue placeholder="Selecciona un técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-asignado">Sin asignar</SelectItem>
                    {tecnicos.map((tec, index) => (
                      <SelectItem key={index} value={tec.email}>
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

"use client"

import { useEffect, useState } from "react"
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

export function CrearIncidenciaDialog({
  open,
  onOpenChange,
  onSave,
  tecnicos = [],
  isUsuario = false,
  isTecnico = false,
  tipos = [],
}) {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [prioridad, setPrioridad] = useState("Media")
  const [tecnico, setTecnico] = useState("")
  const [tipoSeleccionado, setTipoSeleccionado] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    const incidenciaData = {
      prioridad,
      titulo,
      tipo: tipoSeleccionado,
      descripcion
    }

    onSave(incidenciaData)

    setTitulo("")
    setDescripcion("")
    setPrioridad("Media")
    setTecnico("")
    setTipoSeleccionado("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Incidencia</DialogTitle>
          <DialogDescription>Completa el formulario para crear una nueva incidencia en el sistema.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombreDispositivo">Nombre dispositivo</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Impresora HP 400"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe detalladamente la incidencia..."
                required
                rows={4}
              />
            </div>
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
                  <SelectItem value="Muy_Alta">Muy Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo de incidencia</Label>
              <Select value={tipoSeleccionado} onValueChange={setTipoSeleccionado}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tipos.map((tipo, index) => (
                    <SelectItem key={index} value={tipo.nombre}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!isUsuario && !isTecnico && tecnicos.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="tecnico">Asignar Técnico (Opcional)</Label>
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
            <Button type="submit">Crear Incidencia</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

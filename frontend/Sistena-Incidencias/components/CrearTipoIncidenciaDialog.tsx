"use client"
 
import { useState } from "react"
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
 
export function CrearTipoIncidenciaDialog({ open, onOpenChange, onSave }) {
  const [nombreTipo, setNombreTipo] = useState("")
 
  const handleSubmit = (e) => {
    e.preventDefault()
 
    if (!nombreTipo.trim()) return
 
    onSave({ nombre: nombreTipo })
 
    setNombreTipo("")
    onOpenChange(false)
  }
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nuevo Tipo de Incidencia</DialogTitle>
          <DialogDescription>
            Introduce el nombre para crear un nuevo tipo de incidencia.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombreTipo">Nombre</Label>
              <Input
                id="nombreTipo"
                value={nombreTipo}
                onChange={(e) => setNombreTipo(e.target.value)}
                placeholder="Ej: Base de datos"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
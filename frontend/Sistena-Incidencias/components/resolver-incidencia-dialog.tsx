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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ResolverIncidenciaDialog({ open, onOpenChange, incidencia, onSave }) {
  const [resolucion, setResolucion] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(resolucion)
    setResolucion("")
  }

  if (!incidencia) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Resolver Incidencia #{incidencia.id}</DialogTitle>
          <DialogDescription>Indica cómo has resuelto esta incidencia.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium">Título</div>
              <div className="text-sm">{incidencia.titulo}</div>
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-medium">Descripción</div>
              <div className="text-sm">{incidencia.descripcion}</div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resolucion">Solución</Label>
              <Textarea
                id="resolucion"
                value={resolucion}
                onChange={(e) => setResolucion(e.target.value)}
                placeholder="Describe cómo has resuelto esta incidencia..."
                required
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Marcar como Resuelta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

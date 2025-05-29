import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { AlertCircle } from "lucide-react"

export function AlertSuccess({ message }: { message: string }) {
  return (
    <Alert variant="default" className="mb-4 flex items-center gap-2 bg-green-100 text-green-800">
      <AlertCircle className="h-4 w-4 text-green-600" />
      <div>
        {/* <AlertTitle>Peticion exitosa</AlertTitle> */}
        <AlertDescription>{message}</AlertDescription>
      </div>
    </Alert>
  )
}

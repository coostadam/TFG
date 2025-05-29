import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface AlertDestructiveProps {
  message: string
}

export function AlertDestructive({ message }: AlertDestructiveProps) {
  return (
    <Alert variant="destructive" className="mb-4 flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      <div>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </div>
    </Alert>
  )
}

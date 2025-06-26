import { useCallback } from "react"
import { toast as sonnerToast } from "sonner"

export function useToast() {
  const toast = useCallback(
    ({
      title,
      description,
      variant = "default",
    }: {
      title: string
      description?: string
      variant?: "default" | "destructive"
    }) => {
      sonnerToast[variant === "destructive" ? "error" : "message"](title, {
        description,
      })
    },
    []
  )

  return { toast }
}

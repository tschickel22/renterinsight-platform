import { toast as sonnerToast, ToastOptions } from 'sonner'

interface ToastParams extends ToastOptions {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const toast = ({ title, description, variant = 'default', ...props }: ToastParams) => {
    sonnerToast[variant === 'destructive' ? 'error' : 'success'](title, {
      description,
      ...props,
    })
  }

  return { toast }
}

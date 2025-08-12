import { cva, type VariantProps } from 'class-variance-authority'
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const alertVariants = cva('rounded-md p-3 flex items-start gap-2', {
  variants: {
    variant: {
      info: 'bg-blue-50 border border-blue-200',
      success: 'bg-green-50 border border-green-200',
      warning: 'bg-amber-50 border border-amber-200',
      error: 'bg-red-50 border border-red-200',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

const textVariants = cva('text-sm', {
  variants: {
    variant: {
      info: 'text-blue-800',
      success: 'text-green-800',
      warning: 'text-amber-800',
      error: 'text-red-800',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

const iconVariants = cva('w-4 h-4 mt-0.5 flex-shrink-0', {
  variants: {
    variant: {
      info: 'text-blue-600',
      success: 'text-green-600',
      warning: 'text-amber-600',
      error: 'text-red-600',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

interface AlertProps extends VariantProps<typeof alertVariants> {
  children: React.ReactNode
  showIcon?: boolean
  className?: string
}

export function Alert({ children, variant = 'info', showIcon = true, className }: AlertProps) {
  const Icon = icons[variant || 'info']

  return (
    <div className={`${alertVariants({ variant })} ${className || ''}`}>
      {showIcon && <Icon className={iconVariants({ variant })} />}
      <div className={textVariants({ variant })}>{children}</div>
    </div>
  )
}

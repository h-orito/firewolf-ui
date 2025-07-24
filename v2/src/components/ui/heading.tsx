import { cn } from '@/lib/utils'

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  center?: boolean
}

const headingStyles = {
  1: 'text-4xl md:text-5xl font-bold',
  2: 'text-3xl md:text-4xl font-bold',
  3: 'text-2xl md:text-3xl font-bold',
  4: 'text-xl md:text-2xl font-semibold',
  5: 'text-lg md:text-xl font-semibold',
  6: 'text-base md:text-lg font-semibold',
}

export function Heading({ level, children, className, center = false }: HeadingProps) {
  const Component = `h${level}` as const
  const baseClasses = headingStyles[level]
  const centerClass = center ? 'text-center' : ''

  return (
    <Component className={cn(baseClasses, centerClass, 'text-gray-900 mb-4', className)}>
      {children}
    </Component>
  )
}

// 便利なエクスポート
export const H1 = ({ children, className, center }: Omit<HeadingProps, 'level'>) => (
  <Heading level={1} className={className} center={center}>
    {children}
  </Heading>
)

export const H2 = ({ children, className, center }: Omit<HeadingProps, 'level'>) => (
  <Heading level={2} className={className} center={center}>
    {children}
  </Heading>
)

export const H3 = ({ children, className, center }: Omit<HeadingProps, 'level'>) => (
  <Heading level={3} className={className} center={center}>
    {children}
  </Heading>
)

export const H4 = ({ children, className, center }: Omit<HeadingProps, 'level'>) => (
  <Heading level={4} className={className} center={center}>
    {children}
  </Heading>
)

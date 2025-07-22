'use client'

interface ClickToRevealProps {
  children: React.ReactNode
  className?: string
}

export function ClickToReveal({ children, className = '' }: ClickToRevealProps) {
  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.target as HTMLElement
    target.style.display = 'none'
  }

  return (
    <span className={className} onClick={handleClick}>
      {children}
    </span>
  )
}

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface VillageMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  speaker?: string
  messageType?: 'normal' | 'werewolf' | 'mason' | 'grave' | 'spectate'
  time?: string
}

const VillageMessage = React.forwardRef<HTMLDivElement, VillageMessageProps>(
  ({ className, speaker, messageType = 'normal', time, children, ...props }, ref) => {
    const messageTypeClass = {
      normal: 'text-foreground',
      werewolf: 'text-red-600 dark:text-red-400',
      mason: 'text-blue-600 dark:text-blue-400',
      grave: 'text-gray-500 dark:text-gray-400',
      spectate: 'text-purple-600 dark:text-purple-400',
    }[messageType]

    return (
      <div
        ref={ref}
        className={cn(
          'font-mono text-sm leading-relaxed p-2 border-b border-border last:border-b-0',
          messageTypeClass,
          className
        )}
        {...props}
      >
        {(speaker || time) && (
          <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
            {time && <span>{time}</span>}
            {speaker && <span className="font-semibold">{speaker}</span>}
          </div>
        )}
        <div className="whitespace-pre-wrap">{children}</div>
      </div>
    )
  }
)
VillageMessage.displayName = 'VillageMessage'

export { VillageMessage }

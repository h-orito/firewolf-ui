import * as React from 'react'
import { cn } from '@/lib/utils'
import type { components } from '@/types/generated/api'

type MessageView = components['schemas']['MessageView']

export interface VillageMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: MessageView
}

const VillageMessage = React.forwardRef<HTMLDivElement, VillageMessageProps>(
  ({ className, message, ...props }, ref) => {
    const messageTypeClass = getMessageTypeClass(message.content.type.code)
    const timeString = formatMessageTime(message.time.datetime)

    return (
      <div
        ref={ref}
        className={cn('font-mono text-sm leading-relaxed', messageTypeClass, className)}
        {...props}
      >
        <div className="flex items-start gap-3">
          {/* 発言番号・時間 */}
          <div className="text-xs text-gray-500 flex-shrink-0 w-16">
            {message.content.num && (
              <div>
                {message.content.type.code}:{message.content.num}
              </div>
            )}
            <div>{timeString}</div>
          </div>

          {/* 発言者・内容 */}
          <div className="flex-1 min-w-0">
            {/* 発言者情報 */}
            {message.from && (
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800">{message.from.charaName.name}</span>
                {message.from.player && (
                  <span className="text-xs text-gray-500">({message.from.player.nickname})</span>
                )}
                {message.to && (
                  <>
                    <span className="text-xs text-gray-500">→</span>
                    <span className="text-sm text-gray-600">{message.to.charaName.name}</span>
                  </>
                )}
              </div>
            )}

            {/* メッセージ内容 */}
            <div className="whitespace-pre-wrap break-words">{message.content.text}</div>
          </div>
        </div>
      </div>
    )
  }
)
VillageMessage.displayName = 'VillageMessage'

function getMessageTypeClass(messageType: string): string {
  switch (messageType) {
    case 'NORMAL_SAY':
      return 'text-foreground'
    case 'WEREWOLF_SAY':
      return 'text-red-600'
    case 'MASON_SAY':
      return 'text-blue-600'
    case 'GRAVE_SAY':
      return 'text-gray-500'
    case 'SPECTATE_SAY':
      return 'text-purple-600'
    case 'MONOLOGUE_SAY':
      return 'text-green-600'
    case 'SYSTEM':
      return 'text-orange-600 font-medium'
    default:
      return 'text-foreground'
  }
}

function formatMessageTime(datetime: string): string {
  const date = new Date(datetime)
  return date.toLocaleString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export { VillageMessage }

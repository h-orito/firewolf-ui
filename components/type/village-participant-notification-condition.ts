interface VillageParticipantNotificationCondition {
  discord_webhook_url: string
  village: VillageCondition
  message: MessageCondition
}

interface VillageCondition {
  start: boolean
  day_change: boolean
  epilogue: boolean
}

interface MessageCondition {
  secret_say: boolean
  ability_say: boolean
  anchor: boolean
  keywords: string[]
}

export default VillageParticipantNotificationCondition

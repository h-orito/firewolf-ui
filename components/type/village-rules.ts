import VillageMessageRestricts from '~/components/type/village-message-restricts'

interface VillageRules {
  open_vote: boolean
  available_skill_request: boolean
  available_spectate: boolean
  open_skill_in_grave: boolean
  visible_grave_message: boolean
  available_suddenly_death: boolean
  available_commit: boolean
  auto_generated: boolean
  available_dummy_skill: boolean
  available_action: boolean
  available_secret_say: boolean
  available_guard_same_target: boolean
  message_restrict: VillageMessageRestricts
}

export default VillageRules

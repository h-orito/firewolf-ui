import VillageParticipantNotificationCondition from './village-participant-notification-condition'
import CharaName from './chara-name'
import Player from '~/components/type/player'
import Chara from '~/components/type/chara'
import Dead from '~/components/type/dead'
import ComingOuts from '~/components/type/coming-outs'
import Skill from '~/components/type/skill'
import SkillRequest from '~/components/type/skill-request'

interface VillageParticipant {
  id: number
  name: string
  chara_name: CharaName
  chara: Chara
  player: Player | null
  dead: Dead | null
  spectator: boolean
  skill: Skill | null
  skill_request: SkillRequest | null
  win: boolean | null
  comming_outs: ComingOuts
  notification: VillageParticipantNotificationCondition | null
}

export default VillageParticipant

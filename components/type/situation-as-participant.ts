import ParticipantRpSituation from './participant-rp-situation'
import VillageAdminSituation from '~/components/type/village-admin-situation'
import VillageSaySituation from '~/components/type/village-say-situation'
import VillageParticipateSituation from '~/components/type/village-participate-situation'
import VillageSkillRequestSituation from '~/components/type/village-skill-request-situation'
import VillageCommitSituation from '~/components/type/village-commit-situation'
import VillageVoteSituation from '~/components/type/village-vote-situation'
import VillageCreatorSituation from '~/components/type/village-creator-situation'
import VillageAbilitySituations from '~/components/type/village-ability-situations'
import VillageComingOutSituation from '~/components/type/village-coming-out-situation'

interface SituationAsParticipant {
  participate: VillageParticipateSituation
  skill_request: VillageSkillRequestSituation
  commit: VillageCommitSituation
  coming_out: VillageComingOutSituation
  say: VillageSaySituation
  rp: ParticipantRpSituation
  ability: VillageAbilitySituations
  vote: VillageVoteSituation
  creator: VillageCreatorSituation
  admin: VillageAdminSituation
}

export default SituationAsParticipant

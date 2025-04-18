import VillageOrganizations from '~/components/type/village-organizations'
import VillageCharachip from '~/components/type/village-charachip'
import VillagePassword from '~/components/type/village-password'
import PersonCapacity from '~/components/type/person-capacity'
import VillageTime from '~/components/type/village-time'
import VillageTags from '~/components/type/village-tags'
import VillageRules from '~/components/type/village-rules'

interface VillageSettings {
  capacity: PersonCapacity
  time: VillageTime
  charachip: VillageCharachip
  organizations: VillageOrganizations
  rules: VillageRules
  tags: VillageTags
  password: VillagePassword
}

export default VillageSettings

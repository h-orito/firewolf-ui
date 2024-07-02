import VillageParticipant from '~/components/type/village-participant'
import MessageTime from '~/components/type/message-time'
import MessageContent from '~/components/type/message-content'
import CharaName from '~/components/type/chara-name'

interface Message {
  from: VillageParticipant | null
  from_character_name: CharaName | null
  to: VillageParticipant | null
  to_character_name: CharaName | null
  time: MessageTime
  content: MessageContent
}

export default Message

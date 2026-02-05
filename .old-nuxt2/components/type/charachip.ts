import Chara from '~/components/type/chara'
import Designer from '~/components/type/designer'

interface Charachip {
  id: number
  name: string
  designer: Designer
  description_url: string
  chara_list: Chara[]
  is_available_change_name: boolean
}

export default Charachip

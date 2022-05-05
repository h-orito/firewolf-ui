import { Vue } from 'nuxt-property-decorator'
import qs from 'qs'
import SituationAsParticipant from '../type/situation-as-participant'
import DebugVillage from '../type/debug-village'
import Village from '~/components/type/village'
import VillageDay from '~/components/type/village-day'
import Message from '~/components/type/message'
import Messages from '~/components/type/messages'
import Charachips from '~/components/type/charachips'
import VillageLatest from '~/components/type/village-latest'
import villageUserSettings from '~/components/village/user-settings/village-user-settings'

const api = {
  fetchVillage(app: Vue, villageId: number): Promise<Village> {
    return app.$axios.$get(`/village/${villageId}`)
  },

  fetchMessageList(
    app: Vue,
    villageId: number,
    displayDay: VillageDay | null,
    isDispLatestPage: boolean,
    isDispLatest: boolean,
    currentPageNum: number | null,
    messageTypeFilter: string[] | null,
    participantIdFilter: number[] | null,
    keywordFilter: string | null
  ): Promise<Messages> {
    const params: any = {
      message_type_list: messageTypeFilter,
      participant_id_list: participantIdFilter,
      keyword: keywordFilter
    }
    const pagingSetting = villageUserSettings.getPaging(app)
    if (pagingSetting.is_paging) {
      params.page_size = pagingSetting.message_per_page
      params.page_num = isDispLatestPage ? 10000 : currentPageNum
      params.is_disp_latest = isDispLatest
    }
    return app.$axios.$get(
      `/village/${villageId}/day/${displayDay!.day}/time/${
        displayDay!.noonnight
      }/message-list`,
      {
        params,
        paramsSerializer: params =>
          qs.stringify(params, { arrayFormat: 'repeat' })
      }
    )
  },

  fetchSituation(app: Vue, villageId: number): Promise<SituationAsParticipant> {
    return app.$axios.$get(`/village/${villageId}/situation`)
  },

  async fetchCharachipName(app: Vue, village: Village): Promise<string> {
    const charachipIds = village.setting.charachip.charachip_ids
    const charachips: Charachips = await app.$axios.$get(`/charachips`, {
      params: {
        charachipIds
      },
      paramsSerializer: params =>
        qs.stringify(params, { arrayFormat: 'repeat' })
    })
    return charachips.list.map(c => c.name).join('、')
  },

  fetchDebugVillage(app: Vue, villageId: number): Promise<DebugVillage> {
    return app.$axios.$get(`/admin/village/${villageId}`)
  },

  fetchVillageLatest(
    app: Vue,
    villageId: number,
    latestMessageUnixtimeMilli: number
  ): Promise<VillageLatest> {
    return app.$axios.$get(`/village/${villageId}/latest`, {
      params: {
        from: latestMessageUnixtimeMilli
      }
    })
  },

  postAbility(
    app: Vue,
    villageId: number,
    myselfId: number | null,
    targetId: number | null,
    abilityType: string
  ): Promise<void> {
    return app.$axios.$post(`/village/${villageId}/ability`, {
      myself_id: myselfId,
      target_id: targetId,
      ability_type: abilityType
    })
  },

  postCommit(app: Vue, villageId: number, commit: boolean): Promise<void> {
    return app.$axios.$post(`/village/${villageId}/commit`, {
      commit
    })
  },

  postComingout(app: Vue, villageId: number, skills: string[]): Promise<void> {
    return app.$axios.$post(`/village/${villageId}/comingout`, {
      skill_code: skills
    })
  },

  postLeave(app: Vue, villageId: number): Promise<void> {
    return app.$axios.$post(`/village/${villageId}/leave`)
  },

  postConfirmParticipate(
    app: Vue,
    villageId: number,
    charaId: number,
    firstRequestSkill: string,
    secondRequestSkill: string,
    joinMessage: string,
    joinPassword: string | null,
    spectator: boolean
  ): Promise<Message | null> {
    return app.$axios.$post(`/village/${villageId}/participate-confirm`, {
      chara_id: charaId,
      first_request_skill: firstRequestSkill,
      second_request_skill: secondRequestSkill,
      join_message: joinMessage,
      join_password: joinPassword,
      spectator
    })
  },

  postParticipate(
    app: Vue,
    villageId: number,
    charaId: number,
    firstRequestSkill: string | null,
    secondRequestSkill: string | null,
    joinMessage: string,
    joinPassword: string | null,
    spectator: boolean
  ): Promise<void> {
    return app.$axios.$post(`/village/${villageId}/participate`, {
      chara_id: charaId,
      first_request_skill: firstRequestSkill,
      second_request_skill: secondRequestSkill,
      join_message: joinMessage,
      join_password: joinPassword,
      spectator
    })
  },

  postSkillRequest(
    app: Vue,
    villageId: number,
    firstRequestSkill: string,
    secondRequestSkill: string
  ): Promise<void> {
    return app.$axios.$post(`/village/${villageId}/change-skill`, {
      first_request_skill: firstRequestSkill,
      second_request_skill: secondRequestSkill
    })
  },

  postConfirmSay(
    app: Vue,
    villageId: number,
    message: string,
    messageType: string,
    faceType: string,
    targetId: number | null
  ): Promise<Message | null> {
    return app.$axios.$post(`/village/${villageId}/say-confirm`, {
      message,
      message_type: messageType,
      face_type: faceType,
      target_id: targetId
    })
  },

  postSay(
    app: Vue,
    villageId: number,
    message: string,
    messageType: string,
    faceType: string,
    targetId: number | null
  ): Promise<void> {
    return app.$axios.$post(`/village/${villageId}/say`, {
      message,
      message_type: messageType,
      face_type: faceType,
      target_id: targetId
    })
  },

  postConfirmActionSay(
    app: Vue,
    villageId: number,
    myself: string,
    target: string | null,
    message: string
  ): Promise<Message | null> {
    return app.$axios.$post(`/village/${villageId}/action-confirm`, {
      myself,
      target,
      message
    })
  },

  postAction(
    app: Vue,
    villageId: number,
    myself: string,
    target: string | null,
    message: string
  ): Promise<void> {
    return app.$axios.$post(`/village/${villageId}/action`, {
      myself,
      target,
      message
    })
  },

  postVote(app: Vue, villageId: number, targetId: number): Promise<void> {
    return app.$axios.$post(`/village/${villageId}/vote`, {
      target_id: targetId
    })
  }
}

export default api

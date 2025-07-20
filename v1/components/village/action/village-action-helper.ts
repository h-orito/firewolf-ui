import SituationAsParticipant from '~/components/type/situation-as-participant'
import { MESSAGE_TYPE } from '~/components/const/consts'

export interface VillageAction {
  code: string
  name: string
  icon: string
}

const actionHelper = {
  getAvailableActions(situation: SituationAsParticipant): VillageAction[] {
    const actions: VillageAction[] = []
    if (this.isDispMyself(situation))
      actions.push({ code: 'myself', name: '参加', icon: 'user' })
    if (this.isDispSay(situation))
      actions.push({ code: 'say', name: '発言', icon: 'comment-dots' })
    if (this.isDispParticipate(situation))
      actions.push({ code: 'participate', name: '入村', icon: 'sign-in-alt' })
    if (this.isDispSpectate(situation))
      actions.push({ code: 'spectate', name: '見学', icon: 'sign-in-alt' })
    if (this.isDispSkillRequest(situation))
      actions.push({ code: 'skill_request', name: '役職希望', icon: 'star' })
    if (this.isDispChangeName(situation))
      actions.push({ code: 'change_name', name: '名前変更', icon: 'user' })
    if (this.isDispLeave(situation))
      actions.push({ code: 'leave', name: '退村', icon: 'sign-out-alt' })
    if (this.isDispVote(situation))
      actions.push({ code: 'vote', name: '投票', icon: 'skull' })
    if (this.isDispComingout(situation))
      actions.push({ code: 'comingout', name: 'CO', icon: 'hand-paper' })
    if (this.isDispActionSay(situation))
      actions.push({
        code: 'actionsay',
        name: 'アクション',
        icon: 'comment-dots'
      })
    if (this.isDispCreatorMenu(situation))
      actions.push({
        code: 'creator',
        name: '村建てメニュー',
        icon: 'star'
      })
    situation.ability.list
      .filter(ab => ab.usable)
      .forEach(ability => {
        actions.push({
          code: ability.type.code,
          name: ability.type.name,
          icon: 'bolt'
        })
      })
    if (this.isDispCommit(situation))
      actions.push({ code: 'commit', name: '時短', icon: 'clock' })
    return actions
  },
  existsAction(situation: SituationAsParticipant): boolean {
    return this.getAvailableActions(situation).length > 0
  },
  isDispMyself(situation: SituationAsParticipant): boolean {
    return !!situation.participate.myself
  },
  isDispSay(situation: SituationAsParticipant): boolean {
    return situation.say.available_say
  },
  isDispParticipate(situation: SituationAsParticipant): boolean {
    return situation.participate.available_participate
  },
  isDispSpectate(situation: SituationAsParticipant): boolean {
    return situation.participate.available_spectate
  },
  isDispSkillRequest(situation: SituationAsParticipant): boolean {
    return (
      situation.participate.participating &&
      situation.skill_request.available_skill_request
    )
  },
  isDispChangeName(situation: SituationAsParticipant): boolean {
    return (
      situation.participate.participating &&
      situation.rp.is_available_change_name
    )
  },
  isDispLeave(situation: SituationAsParticipant): boolean {
    return situation.participate.available_leave
  },
  isDispVote(situation: SituationAsParticipant): boolean {
    return situation.vote.available_vote
  },
  isDispCommit(situation: SituationAsParticipant): boolean {
    return situation.commit.available_commit
  },
  isDispComingout(situation: SituationAsParticipant): boolean {
    return situation.coming_out.available_coming_out
  },
  isDispActionSay(situation: SituationAsParticipant): boolean {
    return situation.say.selectable_message_type_list.some(s => {
      return s.message_type.code === MESSAGE_TYPE.ACTION
    })
  },
  isDispCreatorMenu(situation: SituationAsParticipant): boolean {
    return situation.creator.available_creator_setting
  }
}

export default actionHelper

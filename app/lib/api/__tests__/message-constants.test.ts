import { describe, it, expect } from 'vitest'
import {
  MESSAGE_TYPE,
  MESSAGE_TYPE_GROUP,
  MESSAGE_TYPE_MAP,
  ALL_MESSAGE_TYPE_GROUPS,
  isSayType,
  isSystemType,
  isActionType,
  isParticipantsType
} from '../message-constants'

describe('message-constants', () => {
  describe('MESSAGE_TYPE', () => {
    it('should have correct say message types', () => {
      expect(MESSAGE_TYPE.NORMAL_SAY).toBe('NORMAL_SAY')
      expect(MESSAGE_TYPE.MONOLOGUE_SAY).toBe('MONOLOGUE_SAY')
      expect(MESSAGE_TYPE.GRAVE_SAY).toBe('GRAVE_SAY')
      expect(MESSAGE_TYPE.WEREWOLF_SAY).toBe('WEREWOLF_SAY')
      expect(MESSAGE_TYPE.SYMPATHIZE_SAY).toBe('SYMPATHIZE_SAY')
      expect(MESSAGE_TYPE.LOVERS_SAY).toBe('LOVERS_SAY')
      expect(MESSAGE_TYPE.SPECTATE_SAY).toBe('SPECTATE_SAY')
      expect(MESSAGE_TYPE.CREATOR_SAY).toBe('CREATOR_SAY')
      expect(MESSAGE_TYPE.SECRET_SAY).toBe('SECRET_SAY')
    })

    it('should have correct system message types', () => {
      expect(MESSAGE_TYPE.PUBLIC_SYSTEM).toBe('PUBLIC_SYSTEM')
      expect(MESSAGE_TYPE.PRIVATE_SYSTEM).toBe('PRIVATE_SYSTEM')
      expect(MESSAGE_TYPE.PRIVATE_SEER).toBe('PRIVATE_SEER')
      expect(MESSAGE_TYPE.PRIVATE_WISE).toBe('PRIVATE_WISE')
      expect(MESSAGE_TYPE.PRIVATE_PSYCHIC).toBe('PRIVATE_PSYCHIC')
      expect(MESSAGE_TYPE.PRIVATE_GURU).toBe('PRIVATE_GURU')
      expect(MESSAGE_TYPE.PRIVATE_WEREWOLF).toBe('PRIVATE_WEREWOLF')
      expect(MESSAGE_TYPE.PRIVATE_FANATIC).toBe('PRIVATE_FANATIC')
      expect(MESSAGE_TYPE.PRIVATE_MASON).toBe('PRIVATE_MASON')
      expect(MESSAGE_TYPE.PRIVATE_FOX).toBe('PRIVATE_FOX')
      expect(MESSAGE_TYPE.PRIVATE_SYMPATHIZER).toBe('PRIVATE_SYMPATHIZER')
      expect(MESSAGE_TYPE.PRIVATE_CORONER).toBe('PRIVATE_CORONER')
      expect(MESSAGE_TYPE.PRIVATE_LOVERS).toBe('PRIVATE_LOVERS')
      expect(MESSAGE_TYPE.PRIVATE_ABILITY).toBe('PRIVATE_ABILITY')
    })

    it('should have correct special message types', () => {
      expect(MESSAGE_TYPE.PARTICIPANTS).toBe('PARTICIPANTS')
      expect(MESSAGE_TYPE.ACTION).toBe('ACTION')
    })
  })

  describe('MESSAGE_TYPE_GROUP', () => {
    it('should have correct message type groups', () => {
      expect(MESSAGE_TYPE_GROUP.SYSTEM).toBe('SYSTEM')
      expect(MESSAGE_TYPE_GROUP.PRIVATE_SYSTEM).toBe('PRIVATE_SYSTEM')
      expect(MESSAGE_TYPE_GROUP.NORMAL_SAY).toBe('NORMAL_SAY')
      expect(MESSAGE_TYPE_GROUP.WEREWOLF_SAY).toBe('WEREWOLF_SAY')
      expect(MESSAGE_TYPE_GROUP.SYMPATHIZE_SAY).toBe('SYMPATHIZE_SAY')
      expect(MESSAGE_TYPE_GROUP.LOVERS_SAY).toBe('LOVERS_SAY')
      expect(MESSAGE_TYPE_GROUP.MONOLOGUE_SAY).toBe('MONOLOGUE_SAY')
      expect(MESSAGE_TYPE_GROUP.GRAVE_SAY).toBe('GRAVE_SAY')
      expect(MESSAGE_TYPE_GROUP.ACTION).toBe('ACTION')
      expect(MESSAGE_TYPE_GROUP.SECRET_SAY).toBe('SECRET_SAY')
      expect(MESSAGE_TYPE_GROUP.CREATOR_SAY).toBe('CREATOR_SAY')
    })
  })

  describe('ALL_MESSAGE_TYPE_GROUPS', () => {
    it('should contain all message type groups', () => {
      expect(ALL_MESSAGE_TYPE_GROUPS).toHaveLength(11)
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(MESSAGE_TYPE_GROUP.SYSTEM)
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(
        MESSAGE_TYPE_GROUP.PRIVATE_SYSTEM
      )
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(MESSAGE_TYPE_GROUP.NORMAL_SAY)
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(MESSAGE_TYPE_GROUP.WEREWOLF_SAY)
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(
        MESSAGE_TYPE_GROUP.SYMPATHIZE_SAY
      )
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(MESSAGE_TYPE_GROUP.LOVERS_SAY)
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(
        MESSAGE_TYPE_GROUP.MONOLOGUE_SAY
      )
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(MESSAGE_TYPE_GROUP.GRAVE_SAY)
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(MESSAGE_TYPE_GROUP.ACTION)
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(MESSAGE_TYPE_GROUP.SECRET_SAY)
      expect(ALL_MESSAGE_TYPE_GROUPS).toContain(MESSAGE_TYPE_GROUP.CREATOR_SAY)
    })
  })

  describe('MESSAGE_TYPE_MAP', () => {
    it('should correctly map say types', () => {
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.NORMAL_SAY)).toBe('say')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.WEREWOLF_SAY)).toBe('say')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.GRAVE_SAY)).toBe('say')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.MONOLOGUE_SAY)).toBe('say')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.SYMPATHIZE_SAY)).toBe('say')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.LOVERS_SAY)).toBe('say')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.SPECTATE_SAY)).toBe('say')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.SECRET_SAY)).toBe('say')
    })

    it('should correctly map system types', () => {
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PUBLIC_SYSTEM)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_SYSTEM)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_SEER)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_WISE)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_PSYCHIC)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_GURU)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_CORONER)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_WEREWOLF)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_FANATIC)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_MASON)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_FOX)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_SYMPATHIZER)).toBe(
        'system'
      )
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_LOVERS)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PRIVATE_ABILITY)).toBe('system')
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.CREATOR_SAY)).toBe('system')
    })

    it('should correctly map special types', () => {
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.PARTICIPANTS)).toBe(
        'participants'
      )
      expect(MESSAGE_TYPE_MAP.get(MESSAGE_TYPE.ACTION)).toBe('action')
    })
  })

  describe('isSayType', () => {
    it('should return true for say types', () => {
      expect(isSayType(MESSAGE_TYPE.NORMAL_SAY)).toBe(true)
      expect(isSayType(MESSAGE_TYPE.WEREWOLF_SAY)).toBe(true)
      expect(isSayType(MESSAGE_TYPE.GRAVE_SAY)).toBe(true)
      expect(isSayType(MESSAGE_TYPE.MONOLOGUE_SAY)).toBe(true)
      expect(isSayType(MESSAGE_TYPE.SYMPATHIZE_SAY)).toBe(true)
      expect(isSayType(MESSAGE_TYPE.LOVERS_SAY)).toBe(true)
      expect(isSayType(MESSAGE_TYPE.SPECTATE_SAY)).toBe(true)
      expect(isSayType(MESSAGE_TYPE.SECRET_SAY)).toBe(true)
    })

    it('should return false for non-say types', () => {
      expect(isSayType(MESSAGE_TYPE.PUBLIC_SYSTEM)).toBe(false)
      expect(isSayType(MESSAGE_TYPE.PRIVATE_SYSTEM)).toBe(false)
      expect(isSayType(MESSAGE_TYPE.ACTION)).toBe(false)
      expect(isSayType(MESSAGE_TYPE.PARTICIPANTS)).toBe(false)
      expect(isSayType(MESSAGE_TYPE.CREATOR_SAY)).toBe(false)
    })

    it('should return false for unknown types', () => {
      expect(isSayType('UNKNOWN_TYPE')).toBe(false)
    })
  })

  describe('isSystemType', () => {
    it('should return true for system types', () => {
      expect(isSystemType(MESSAGE_TYPE.PUBLIC_SYSTEM)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_SYSTEM)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_SEER)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_WISE)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_PSYCHIC)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_GURU)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_CORONER)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_WEREWOLF)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_FANATIC)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_MASON)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_FOX)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_SYMPATHIZER)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_LOVERS)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.PRIVATE_ABILITY)).toBe(true)
      expect(isSystemType(MESSAGE_TYPE.CREATOR_SAY)).toBe(true)
    })

    it('should return false for non-system types', () => {
      expect(isSystemType(MESSAGE_TYPE.NORMAL_SAY)).toBe(false)
      expect(isSystemType(MESSAGE_TYPE.WEREWOLF_SAY)).toBe(false)
      expect(isSystemType(MESSAGE_TYPE.ACTION)).toBe(false)
      expect(isSystemType(MESSAGE_TYPE.PARTICIPANTS)).toBe(false)
    })

    it('should return false for unknown types', () => {
      expect(isSystemType('UNKNOWN_TYPE')).toBe(false)
    })
  })

  describe('isActionType', () => {
    it('should return true for action type', () => {
      expect(isActionType(MESSAGE_TYPE.ACTION)).toBe(true)
    })

    it('should return false for non-action types', () => {
      expect(isActionType(MESSAGE_TYPE.NORMAL_SAY)).toBe(false)
      expect(isActionType(MESSAGE_TYPE.PUBLIC_SYSTEM)).toBe(false)
      expect(isActionType(MESSAGE_TYPE.PARTICIPANTS)).toBe(false)
    })

    it('should return false for unknown types', () => {
      expect(isActionType('UNKNOWN_TYPE')).toBe(false)
    })
  })

  describe('isParticipantsType', () => {
    it('should return true for participants type', () => {
      expect(isParticipantsType(MESSAGE_TYPE.PARTICIPANTS)).toBe(true)
    })

    it('should return false for non-participants types', () => {
      expect(isParticipantsType(MESSAGE_TYPE.NORMAL_SAY)).toBe(false)
      expect(isParticipantsType(MESSAGE_TYPE.PUBLIC_SYSTEM)).toBe(false)
      expect(isParticipantsType(MESSAGE_TYPE.ACTION)).toBe(false)
    })

    it('should return false for unknown types', () => {
      expect(isParticipantsType('UNKNOWN_TYPE')).toBe(false)
    })
  })
})

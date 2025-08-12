'use client'

import type { Camp, MessageType, Skill } from '@/types/skill'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fragment, useState } from 'react'

interface SkillListProps {
  skills: Skill[]
}

export function SkillList({ skills }: SkillListProps) {
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set())

  const toggleSkillExpansion = (skillCode: string) => {
    setExpandedSkills((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(skillCode)) {
        newSet.delete(skillCode)
      } else {
        newSet.add(skillCode)
      }
      return newSet
    })
  }

  const isWolfCamp = (camp?: Camp) => {
    return camp?.code === 'WEREWOLF'
  }

  const getCountCampDisplay = (countCamp?: Camp) => {
    if (!countCamp) return '-'
    return countCamp.code === 'WEREWOLF' ? '人狼' : '人間'
  }

  const scrollToAbility = (abilityCode: string) => {
    const targetId = abilityCode.toLowerCase()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const formatMessageTypeList = (messageTypes: MessageType[] | undefined) => {
    if (!messageTypes || messageTypes.length === 0) return '-'
    return messageTypes.map((mt) => mt.name).join('、')
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4">役職一覧</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left min-w-[100px]">役職名</th>
              <th className="border border-gray-300 p-2 text-left min-w-[60px]">略称</th>
              <th className="border border-gray-300 p-2 text-left min-w-[100px]">所属陣営</th>
              <th className="border border-gray-300 p-2 text-left min-w-[120px]">能力</th>
              <th className="border border-gray-300 p-2 text-left min-w-[100px]">占い結果</th>
              <th className="border border-gray-300 p-2 text-left min-w-[100px]">霊視結果</th>
              <th className="border border-gray-300 p-2 text-left min-w-[120px]">発言可能</th>
              <th className="border border-gray-300 p-2 text-left min-w-[120px]">可視</th>
              <th className="border border-gray-300 p-2 text-left min-w-[120px]">
                勝敗判定カウント
              </th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <Fragment key={skill.code}>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => toggleSkillExpansion(skill.code)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {skill.name}
                      <FontAwesomeIcon
                        icon={expandedSkills.has(skill.code) ? faChevronDown : faChevronRight}
                        className="ml-1 h-3 w-3"
                      />
                    </button>
                  </td>
                  <td className="border border-gray-300 p-2">{skill.short_name}</td>
                  <td
                    className={`border border-gray-300 p-2 ${
                      isWolfCamp(skill.win_judge_camp) ? 'text-red-600 font-bold' : ''
                    }`}
                  >
                    {skill.win_judge_camp.name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {skill.manual_ability_list.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {skill.manual_ability_list.map((ability, index) => (
                          <button
                            key={`${skill.code}-${ability.code}`}
                            onClick={() => scrollToAbility(ability.code)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {ability.name}
                            {index < skill.manual_ability_list.length - 1 && '、'}
                          </button>
                        ))}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td
                    className={`border border-gray-300 p-2 ${
                      skill.divine_result_wolf ? 'text-red-600 font-bold' : ''
                    }`}
                  >
                    {skill.divine_result_wolf ? '人狼' : '人狼でない'}
                  </td>
                  <td
                    className={`border border-gray-300 p-2 ${
                      skill.psychic_result_wolf ? 'text-red-600 font-bold' : ''
                    }`}
                  >
                    {skill.psychic_result_wolf ? '人狼' : '人狼でない'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatMessageTypeList(skill.sayable_skill_message_type_list)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatMessageTypeList(skill.viewable_skill_message_type_list)}
                  </td>
                  <td
                    className={`border border-gray-300 p-2 ${
                      skill.count_camp && isWolfCamp(skill.count_camp)
                        ? 'text-red-600 font-bold'
                        : ''
                    }`}
                  >
                    {getCountCampDisplay(skill.count_camp)}
                  </td>
                </tr>
                {expandedSkills.has(skill.code) && (
                  <tr>
                    <td colSpan={9} className="border border-gray-300 p-4 bg-gray-50">
                      <div className="text-sm whitespace-pre-wrap">{skill.description}</div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

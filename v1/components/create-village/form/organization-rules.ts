import Skill from '~/components/type/skill'

const contain_skills = {
  params: ['skills'],

  validate(value, { skills }) {
    if (value == null || !skills) return true // 空の場合チェックしない
    const skillShortnames: string[] = skillShornames(skills)
    return !Object.values(toPersonNumOrgMap(value)).some((org: string) => {
      return containInvalidSkill(org, skillShortnames)
    })
  },

  message(field, { skills }) {
    return `不明な役職が存在しています`
  }
}

const dummy_skill = {
  params: ['availableDummySkill'],

  validate(value, { availableDummySkill }) {
    if (availableDummySkill || !value) return true // 役欠けありの場合チェックしない
    return !Object.values(toPersonNumOrgMap(value)).some((org: string) => {
      return !!org && !org.includes('村')
    })
  },

  message(field, { availableDummySkill }) {
    return '役欠けなしの場合村人を1名以上含めてください'
  }
}

const person_num = {
  validate(value) {
    if (value == null) return true // 空の場合チェックしない
    return !Object.entries(toPersonNumOrgMap(value)).some(
      arr => !isPersonNumCollect(arr[0], arr[1])
    )
  },

  message(field, { skills }) {
    return `人数が合っていない行があります`
  }
}

const toPersonNumOrgMap = (value: string): Object => {
  return Object.fromEntries(
    value
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line: string) => {
        const str: string[] = line.split('人：')
        return [parseInt(str[0]), str[1]]
      })
  )
}

const person_minmax = {
  validate(value) {
    if (value == null) return true // 空の場合チェックしない
    return !Object.keys(toPersonNumOrgMap(value)).some(
      num => parseInt(num) < 5 || parseInt(num) > 999
    )
  },

  message(field, { skills }) {
    return `最低5人、最大999人です`
  }
}

const containInvalidSkill = (org: string, skillnames: string[]): boolean => {
  return org.split('').some(o => !skillnames.includes(o))
}

const isPersonNumCollect = (num: string, org: string): boolean => {
  return parseInt(num) === org.length
}

const skillShornames = (skills: Skill[]): string[] => {
  return skills.map(s => s.short_name)
}

export { contain_skills, dummy_skill, person_num, person_minmax }

import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  createAnchorString,
  createAnchorCopyString,
  convertToDecoratedText,
  convertToAnchorTag,
  convertToMessageText,
  getAnchorType,
  getAnchorNum,
  isDispAnchor,
  getMessageNumber,
  getComingOutString
} from '../message-converter'
import { MESSAGE_TYPE } from '~/lib/api/message-constants'

describe('message-converter', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<script>alert("XSS")</script>')).toBe(
        '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
      )
    })

    it('should escape ampersand', () => {
      expect(escapeHtml('foo & bar')).toBe('foo &amp; bar')
    })

    it('should escape single quotes', () => {
      expect(escapeHtml("it's")).toBe('it&#39;s')
    })

    it('should handle empty string', () => {
      expect(escapeHtml('')).toBe('')
    })

    it('should handle string without special characters', () => {
      expect(escapeHtml('hello world')).toBe('hello world')
    })
  })

  describe('createAnchorString', () => {
    it('should create anchor for NORMAL_SAY', () => {
      expect(createAnchorString(MESSAGE_TYPE.NORMAL_SAY, 123)).toBe('>>123')
    })

    it('should create anchor for MONOLOGUE_SAY', () => {
      expect(createAnchorString(MESSAGE_TYPE.MONOLOGUE_SAY, 456)).toBe('>>-456')
    })

    it('should create anchor for GRAVE_SAY', () => {
      expect(createAnchorString(MESSAGE_TYPE.GRAVE_SAY, 789)).toBe('>>+789')
    })

    it('should create anchor for WEREWOLF_SAY', () => {
      expect(createAnchorString(MESSAGE_TYPE.WEREWOLF_SAY, 100)).toBe('>>*100')
    })

    it('should create anchor for SYMPATHIZE_SAY', () => {
      expect(createAnchorString(MESSAGE_TYPE.SYMPATHIZE_SAY, 50)).toBe('>>=50')
    })

    it('should create anchor for LOVERS_SAY', () => {
      expect(createAnchorString(MESSAGE_TYPE.LOVERS_SAY, 25)).toBe('>>?25')
    })

    it('should create anchor for SPECTATE_SAY', () => {
      expect(createAnchorString(MESSAGE_TYPE.SPECTATE_SAY, 10)).toBe('>>@10')
    })

    it('should create anchor for CREATOR_SAY', () => {
      expect(createAnchorString(MESSAGE_TYPE.CREATOR_SAY, 5)).toBe('>>#5')
    })

    it('should create anchor for ACTION', () => {
      expect(createAnchorString(MESSAGE_TYPE.ACTION, 999)).toBe('>>a999')
    })

    it('should create anchor for SECRET_SAY', () => {
      expect(createAnchorString(MESSAGE_TYPE.SECRET_SAY, 111)).toBe('>>s111')
    })

    it('should return empty string for unknown type', () => {
      expect(createAnchorString('UNKNOWN_TYPE', 123)).toBe('')
    })
  })

  describe('createAnchorCopyString', () => {
    it('should return anchor only for WEREWOLF_SAY', () => {
      expect(
        createAnchorCopyString(MESSAGE_TYPE.WEREWOLF_SAY, '>>*123', 'Alice')
      ).toBe('>>*123')
    })

    it('should prepend shortName for other types', () => {
      expect(
        createAnchorCopyString(MESSAGE_TYPE.NORMAL_SAY, '>>123', 'Bob')
      ).toBe('Bob>>123')
    })

    it('should prepend shortName for MONOLOGUE_SAY', () => {
      expect(
        createAnchorCopyString(MESSAGE_TYPE.MONOLOGUE_SAY, '>>-456', 'Carol')
      ).toBe('Carol>>-456')
    })
  })

  describe('convertToDecoratedText', () => {
    it('should convert color tags', () => {
      expect(convertToDecoratedText('[[#ff0000]]red text[[/#]]')).toBe(
        '<span style="color: #ff0000">red text</span>'
      )
    })

    it('should convert bold tags', () => {
      expect(convertToDecoratedText('[[b]]bold text[[/b]]')).toBe(
        '<strong>bold text</strong>'
      )
    })

    it('should convert strike tags', () => {
      expect(convertToDecoratedText('[[s]]strike text[[/s]]')).toBe(
        '<span style="text-decoration: line-through;">strike text</span>'
      )
    })

    it('should convert large tags', () => {
      expect(convertToDecoratedText('[[large]]large text[[/large]]')).toBe(
        '<span style="font-size: 150%;">large text</span>'
      )
    })

    it('should convert small tags', () => {
      expect(convertToDecoratedText('[[small]]small text[[/small]]')).toBe(
        '<span style="font-size: 80%;">small text</span>'
      )
    })

    it('should convert ruby tags', () => {
      expect(
        convertToDecoratedText('[[ruby]]漢字[[rt]]かんじ[[/rt]][[/ruby]]')
      ).toBe('<ruby>漢字<rt>かんじ</rt></ruby>')
    })

    it('should convert cw (content warning) tags', () => {
      const result = convertToDecoratedText('[[cw]]spoiler content[[/cw]]')
      expect(result).toContain('class="netabare cursor-pointer"')
      expect(result).toContain('spoiler content')
    })

    it('should handle multiple decorations', () => {
      const input = '[[b]]bold[[/b]] and [[#0000ff]]blue[[/#]]'
      const result = convertToDecoratedText(input)
      expect(result).toContain('<strong>bold</strong>')
      expect(result).toContain('<span style="color: #0000ff">blue</span>')
    })

    it('should handle text without decorations', () => {
      expect(convertToDecoratedText('plain text')).toBe('plain text')
    })
  })

  describe('convertToAnchorTag', () => {
    it('should convert normal anchor', () => {
      const result = convertToAnchorTag('&gt;&gt;123')
      expect(result).toContain('class="anchor')
      expect(result).toContain('&gt;&gt;123')
    })

    it('should convert monologue anchor', () => {
      const result = convertToAnchorTag('&gt;&gt;-456')
      expect(result).toContain('class="anchor')
    })

    it('should convert grave anchor', () => {
      const result = convertToAnchorTag('&gt;&gt;+789')
      expect(result).toContain('class="anchor')
    })

    it('should convert werewolf anchor', () => {
      const result = convertToAnchorTag('&gt;&gt;*100')
      expect(result).toContain('class="anchor')
    })

    it('should convert sympathize anchor', () => {
      const result = convertToAnchorTag('&gt;&gt;=50')
      expect(result).toContain('class="anchor')
    })

    it('should convert lovers anchor', () => {
      const result = convertToAnchorTag('&gt;&gt;?25')
      expect(result).toContain('class="anchor')
    })

    it('should convert spectate anchor', () => {
      const result = convertToAnchorTag('&gt;&gt;@10')
      expect(result).toContain('class="anchor')
    })

    it('should convert creator anchor', () => {
      const result = convertToAnchorTag('&gt;&gt;#5')
      expect(result).toContain('class="anchor')
    })

    it('should convert action anchor', () => {
      const result = convertToAnchorTag('&gt;&gt;a999')
      expect(result).toContain('class="anchor')
    })

    it('should convert secret anchor', () => {
      const result = convertToAnchorTag('&gt;&gt;s111')
      expect(result).toContain('class="anchor')
    })

    it('should convert multiple anchors', () => {
      const result = convertToAnchorTag('see &gt;&gt;123 and &gt;&gt;456')
      expect(result.match(/class="anchor/g)?.length).toBe(2)
    })

    it('should match only up to 5 digits in anchor', () => {
      // 6桁の数字は5桁までマッチし、残りの1桁はリンク外に残る
      const result = convertToAnchorTag('&gt;&gt;123456')
      expect(result).toContain('&gt;&gt;12345</a>6')
    })
  })

  describe('convertToMessageText', () => {
    it('should escape HTML, convert decorations, and convert anchors', () => {
      const input = '[[b]]Hello[[/b]] >>123 <script>'
      const result = convertToMessageText(input)
      expect(result).toContain('<strong>Hello</strong>')
      expect(result).toContain('class="anchor')
      expect(result).toContain('&lt;script&gt;')
    })
  })

  describe('getAnchorType', () => {
    it('should detect NORMAL_SAY anchor', () => {
      expect(getAnchorType('>>123')).toBe(MESSAGE_TYPE.NORMAL_SAY)
    })

    it('should detect MONOLOGUE_SAY anchor', () => {
      expect(getAnchorType('>>-456')).toBe(MESSAGE_TYPE.MONOLOGUE_SAY)
    })

    it('should detect WEREWOLF_SAY anchor', () => {
      expect(getAnchorType('>>*100')).toBe(MESSAGE_TYPE.WEREWOLF_SAY)
    })

    it('should detect GRAVE_SAY anchor', () => {
      expect(getAnchorType('>>+789')).toBe(MESSAGE_TYPE.GRAVE_SAY)
    })

    it('should detect SYMPATHIZE_SAY anchor', () => {
      expect(getAnchorType('>>=50')).toBe(MESSAGE_TYPE.SYMPATHIZE_SAY)
    })

    it('should detect LOVERS_SAY anchor', () => {
      expect(getAnchorType('>>?25')).toBe(MESSAGE_TYPE.LOVERS_SAY)
    })

    it('should detect SPECTATE_SAY anchor', () => {
      expect(getAnchorType('>>@10')).toBe(MESSAGE_TYPE.SPECTATE_SAY)
    })

    it('should detect CREATOR_SAY anchor', () => {
      expect(getAnchorType('>>#5')).toBe(MESSAGE_TYPE.CREATOR_SAY)
    })

    it('should detect ACTION anchor', () => {
      expect(getAnchorType('>>a999')).toBe(MESSAGE_TYPE.ACTION)
    })

    it('should detect SECRET_SAY anchor', () => {
      expect(getAnchorType('>>s111')).toBe(MESSAGE_TYPE.SECRET_SAY)
    })

    it('should return null for text without anchor', () => {
      expect(getAnchorType('no anchor here')).toBeNull()
    })

    it('should return null for invalid anchor', () => {
      expect(getAnchorType('>>x123')).toBeNull()
    })
  })

  describe('getAnchorNum', () => {
    it('should extract number from anchor text', () => {
      expect(getAnchorNum('>>123')).toBe(123)
    })

    it('should extract number with prefix', () => {
      expect(getAnchorNum('>>*456')).toBe(456)
    })

    it('should handle 5 digit numbers', () => {
      expect(getAnchorNum('>>99999')).toBe(99999)
    })
  })

  describe('isDispAnchor', () => {
    it('should return true for NORMAL_SAY regardless of progress', () => {
      expect(isDispAnchor(true, MESSAGE_TYPE.NORMAL_SAY)).toBe(true)
      expect(isDispAnchor(false, MESSAGE_TYPE.NORMAL_SAY)).toBe(true)
    })

    it('should return true for WEREWOLF_SAY regardless of progress', () => {
      expect(isDispAnchor(true, MESSAGE_TYPE.WEREWOLF_SAY)).toBe(true)
      expect(isDispAnchor(false, MESSAGE_TYPE.WEREWOLF_SAY)).toBe(true)
    })

    it('should return false for MONOLOGUE_SAY during progress', () => {
      expect(isDispAnchor(true, MESSAGE_TYPE.MONOLOGUE_SAY)).toBe(false)
    })

    it('should return true for MONOLOGUE_SAY when not in progress', () => {
      expect(isDispAnchor(false, MESSAGE_TYPE.MONOLOGUE_SAY)).toBe(true)
    })

    it('should return false for SECRET_SAY during progress', () => {
      expect(isDispAnchor(true, MESSAGE_TYPE.SECRET_SAY)).toBe(false)
    })

    it('should return true for SECRET_SAY when not in progress', () => {
      expect(isDispAnchor(false, MESSAGE_TYPE.SECRET_SAY)).toBe(true)
    })
  })

  describe('getMessageNumber', () => {
    it('should return day.num format when num exists', () => {
      const message = {
        time: { day: 3 },
        content: { num: 42 }
      }
      expect(getMessageNumber(message as any)).toBe('3.42')
    })

    it('should return day.0 when num is undefined', () => {
      const message = {
        time: { day: 5 },
        content: {}
      }
      expect(getMessageNumber(message as any)).toBe('5.0')
    })
  })

  describe('getComingOutString', () => {
    it('should return null when no coming outs', () => {
      const message = {
        from: {
          comming_outs: { list: [] }
        }
      }
      expect(getComingOutString(message as any)).toBeNull()
    })

    it('should return null when comming_outs is undefined', () => {
      const message = {
        from: {}
      }
      expect(getComingOutString(message as any)).toBeNull()
    })

    it('should return null when from is undefined', () => {
      const message = {}
      expect(getComingOutString(message as any)).toBeNull()
    })

    it('should return single CO string', () => {
      const message = {
        from: {
          comming_outs: {
            list: [{ skill: { short_name: '占' } }]
          }
        }
      }
      expect(getComingOutString(message as any)).toBe('占CO')
    })

    it('should return multiple CO string', () => {
      const message = {
        from: {
          comming_outs: {
            list: [
              { skill: { short_name: '占' } },
              { skill: { short_name: '霊' } }
            ]
          }
        }
      }
      expect(getComingOutString(message as any)).toBe('占,霊CO')
    })
  })
})

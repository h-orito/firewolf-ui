import { cn } from '../utils'

describe('cn', () => {
  test('単一のクラス名を正しく処理する', () => {
    expect(cn('test-class')).toBe('test-class')
  })

  test('複数のクラス名を正しく結合する', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  test('条件付きクラス名を正しく処理する', () => {
    expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
  })

  test('Tailwindの重複クラスを正しくマージする', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  test('空の値や未定義の値を無視する', () => {
    expect(cn('base', null, undefined, '', 'final')).toBe('base final')
  })
})

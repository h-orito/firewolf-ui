import { render, screen, fireEvent } from '@testing-library/react'
import { NumberInput } from '../number-input'

describe('NumberInput', () => {
  it('renders with label and value', () => {
    const mockOnChange = jest.fn()

    render(<NumberInput value={10} onChange={mockOnChange} label="テスト入力" />)

    expect(screen.getByLabelText('テスト入力')).toBeInTheDocument()
    expect(screen.getByDisplayValue('10')).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    const mockOnChange = jest.fn()

    render(<NumberInput value={10} onChange={mockOnChange} />)

    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '20' } })

    expect(mockOnChange).toHaveBeenCalledWith(20)
  })

  it('enforces minimum value', () => {
    const mockOnChange = jest.fn()

    render(<NumberInput value={10} onChange={mockOnChange} min={5} />)

    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '3' } })

    expect(mockOnChange).toHaveBeenCalledWith(5)
  })

  it('enforces maximum value', () => {
    const mockOnChange = jest.fn()

    render(<NumberInput value={10} onChange={mockOnChange} max={15} />)

    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '20' } })

    expect(mockOnChange).toHaveBeenCalledWith(15)
  })

  it('shows error message', () => {
    const mockOnChange = jest.fn()

    render(<NumberInput value={10} onChange={mockOnChange} error="エラーメッセージ" />)

    expect(screen.getByText('エラーメッセージ')).toBeInTheDocument()
  })

  it('shows range hint when min and max are set', () => {
    const mockOnChange = jest.fn()

    render(<NumberInput value={10} onChange={mockOnChange} min={5} max={15} />)

    expect(screen.getByText('5〜15の範囲で入力してください')).toBeInTheDocument()
  })

  it('handles empty input correctly', () => {
    const mockOnChange = jest.fn()

    render(<NumberInput value={10} onChange={mockOnChange} min={0} />)

    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '' } })

    expect(mockOnChange).toHaveBeenCalledWith(0)
  })

  it('shows required indicator', () => {
    const mockOnChange = jest.fn()

    render(<NumberInput value={10} onChange={mockOnChange} label="必須項目" required />)

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    const mockOnChange = jest.fn()

    render(<NumberInput value={10} onChange={mockOnChange} disabled />)

    const input = screen.getByRole('spinbutton')
    expect(input).toBeDisabled()
  })
})

interface ToggleSliderProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
}

export function ToggleSlider({
  checked,
  onChange,
  disabled = false,
  label,
  className = '',
}: ToggleSliderProps) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault()
      onChange(!checked)
    }
  }

  return (
    <label className={`flex items-center space-x-3 cursor-pointer ${className}`}>
      <div
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
          checked
            ? disabled
              ? 'bg-blue-300'
              : 'bg-blue-600 hover:bg-blue-700'
            : disabled
              ? 'bg-gray-200'
              : 'bg-gray-300 hover:bg-gray-400'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleToggle}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
      {label && (
        <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</span>
      )}
    </label>
  )
}

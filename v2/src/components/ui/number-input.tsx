interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  placeholder?: string
  className?: string
  error?: string
  label?: string
  required?: boolean
  suffix?: string
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  placeholder,
  className = '',
  error,
  label,
  required = false,
  suffix,
}: NumberInputProps) {
  const inputId = `number-input-${Math.random().toString(36).substr(2, 9)}`
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // 空文字の場合は最小値または0を設定
    if (newValue === '') {
      onChange(min ?? 0)
      return
    }

    const numValue = parseInt(newValue, 10)

    // 数値でない場合は変更しない
    if (isNaN(numValue)) {
      return
    }

    // 範囲チェック
    let validValue = numValue
    if (min !== undefined && numValue < min) {
      validValue = min
    }
    if (max !== undefined && numValue > max) {
      validValue = max
    }

    onChange(validValue)
  }

  const handleBlur = () => {
    // フォーカスが外れた時に範囲内の値に修正
    let validValue = value
    if (min !== undefined && value < min) {
      validValue = min
    }
    if (max !== undefined && value > max) {
      validValue = max
    }

    if (validValue !== value) {
      onChange(validValue)
    }
  }

  const hasError = Boolean(error)

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type="number"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            suffix ? 'pr-12' : ''
          } ${
            hasError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900'}`}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
              {suffix}
            </span>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <span>⚠</span>
          <span>{error}</span>
        </p>
      )}
      {(min !== undefined || max !== undefined) && !error && (
        <p className="text-xs text-gray-500">
          {min !== undefined && max !== undefined
            ? `${min}〜${max}の範囲で入力してください`
            : min !== undefined
              ? `${min}以上で入力してください`
              : `${max}以下で入力してください`}
        </p>
      )}
    </div>
  )
}

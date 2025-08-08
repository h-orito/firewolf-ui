import { forwardRef } from 'react'

export interface RadioOption<T extends string> {
  value: T
  label: string
}

interface RadioGroupProps<T extends string> {
  name: string
  value: T
  options: RadioOption<T>[]
  onChange: (value: T) => void
  className?: string
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps<any>>(
  <T extends string>(
    { name, value, options, onChange, className = '' }: RadioGroupProps<T>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div ref={ref} className={`inline-flex rounded-lg bg-gray-100 p-1 ${className}`}>
        {options.map((option, index) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value as T)}
              className="sr-only peer"
            />
            <div
              className={`
                px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200
                peer-checked:bg-blue-500 peer-checked:text-white peer-checked:shadow-sm
                text-gray-600 hover:text-gray-900
                ${index === 0 ? 'rounded-l-md' : ''}
                ${index === options.length - 1 ? 'rounded-r-md' : ''}
              `}
            >
              {option.label}
            </div>
          </label>
        ))}
      </div>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

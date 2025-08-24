/**
 * フォームバリデーション統合コンポーザブル
 *
 * vee-validate v4 と @nuxt/ui の統合を行う
 */
import { useField, useForm } from 'vee-validate'
import type { ObjectSchema } from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import type { FieldState } from '~/utils/validation-rules'

/**
 * @nuxt/ui用のカラータイプ
 */
type UIColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'


/**
 * APIエラーレスポンス
 */
interface ApiErrorResponse {
  data?: {
    errors?: Record<string, string | string[]>
  }
}

/**
 * フォーム全体のバリデーション管理
 * toTypedSchemaを使用してYupスキーマから型を自動推論します
 */
export function useFormValidation(
  schema: ObjectSchema<Record<string, unknown>>,
  initialValues: Record<string, unknown> = {}
) {
  const validationSchema = toTypedSchema(schema)

  const {
    values,
    errors,
    meta,
    isSubmitting,
    handleSubmit,
    resetForm,
    setFieldValue,
    setErrors,
    validate,
  } = useForm({
    validationSchema,
    initialValues,
  })

  // @nuxt/ui用のフォーム状態
  const formState = computed(() => ({
    errors: errors.value,
    isValid: meta.value.valid,
    touched: meta.value.touched,
  }))

  // フォーム送信ハンドラー
  const onSubmit = handleSubmit(async (values) => {
    try {
      return values
    } catch (error) {
      // API エラーの場合はフォームエラーとして設定
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as ApiErrorResponse
        if (apiError.data?.errors) {
          // エラーハンドリング - 型アサーションを使用
          setErrors(apiError.data.errors as Record<string, string>)
        }
      }
      throw error
    }
  })

  return {
    // フォーム値
    values: readonly(values),
    
    // バリデーション状態
    errors: readonly(errors),
    meta: readonly(meta),
    formState: readonly(formState),
    
    // フォーム状態
    isSubmitting: readonly(isSubmitting),
    
    // フォーム操作
    handleSubmit: onSubmit,
    resetForm,
    setFieldValue,
    setErrors,
    validate,
  }
}

/**
 * 個別フィールドのバリデーション管理
 */
export function useFieldValidation<T = unknown>(
  name: string,
  initialValue?: T,
  options?: {
    required?: boolean
    validateOnInput?: boolean
    validateOnBlur?: boolean
  }
) {
  const field = useField<T>(name, undefined, {
    initialValue,
    validateOnValueUpdate: options?.validateOnInput ?? true,
  })

  const {
    value,
    errorMessage,
    meta,
    setValue,
    setTouched,
    resetField,
  } = field

  // @nuxt/ui 用のフィールド状態
  const fieldState = computed<FieldState<T>>(() => ({
    value: value.value,
    error: errorMessage.value,
    touched: meta.touched,
    valid: meta.valid,
  }))
  
  const inputProps = computed(() => ({
    modelValue: value.value,
    error: !!errorMessage.value,
    help: errorMessage.value,
    color: (errorMessage.value ? 'error' : 'primary') as UIColor,
  }))

  const selectProps = computed(() => ({
    modelValue: value.value,
    error: !!errorMessage.value,
    help: errorMessage.value,
    color: (errorMessage.value ? 'error' : 'primary') as UIColor,
  }))

  const checkboxProps = computed(() => ({
    modelValue: value.value,
    error: !!errorMessage.value,
    help: errorMessage.value,
    color: (errorMessage.value ? 'error' : 'primary') as UIColor,
  }))

  const textareaProps = computed(() => ({
    modelValue: value.value,
    error: !!errorMessage.value,
    help: errorMessage.value,
    color: (errorMessage.value ? 'error' : 'primary') as UIColor,
  }))

  const switchProps = computed(() => ({
    modelValue: value.value,
    error: !!errorMessage.value,
    help: errorMessage.value,
    color: (errorMessage.value ? 'error' : 'primary') as UIColor,
  }))

  const radioGroupProps = computed(() => ({
    modelValue: value.value,
    error: !!errorMessage.value,
    help: errorMessage.value,
    color: (errorMessage.value ? 'error' : 'primary') as UIColor,
  }))

  // イベントハンドラー
  const handleInput = (newValue: T) => {
    setValue(newValue)
  }

  const handleBlur = () => {
    setTouched(true)
  }

  return {
    // フィールド値
    value: readonly(value),
    
    // バリデーション状態
    errorMessage: readonly(errorMessage),
    meta: readonly(meta),
    fieldState: readonly(fieldState),
    
    // コンポーネント用プロパティ
    inputProps: readonly(inputProps),
    selectProps: readonly(selectProps),
    checkboxProps: readonly(checkboxProps),
    textareaProps: readonly(textareaProps),
    switchProps: readonly(switchProps),
    radioGroupProps: readonly(radioGroupProps),
    
    // フィールド操作
    setValue,
    setTouched,
    resetField,
    handleInput,
    handleBlur,
  }
}

/**
 * 配列フィールドのバリデーション管理
 */
export function useArrayFieldValidation<T>(name: string, initialValue: T[] = []) {
  const { value, errorMessage, meta, setValue } = useField<T[]>(name, undefined, {
    initialValue,
  })

  const addItem = (item: T) => {
    const currentValue = Array.isArray(value.value) ? value.value : []
    setValue([...currentValue, item])
  }

  const removeItem = (index: number) => {
    const currentValue = Array.isArray(value.value) ? value.value : []
    const newValue = currentValue.filter((_, i) => i !== index)
    setValue(newValue)
  }

  const updateItem = (index: number, item: T) => {
    const currentValue = Array.isArray(value.value) ? value.value : []
    const newValue = [...currentValue]
    newValue[index] = item
    setValue(newValue)
  }

  return {
    value: readonly(value),
    errorMessage: readonly(errorMessage),
    meta: readonly(meta),
    addItem,
    removeItem,
    updateItem,
  }
}

/**
 * 非同期バリデーション用のコンポーザブル
 */
export function useAsyncValidation() {
  const pendingValidations = ref(new Set<string>())

  const validateAsync = async <T>(
    fieldName: string,
    value: T,
    validator: (value: T) => Promise<boolean | string>
  ): Promise<string | undefined> => {
    pendingValidations.value.add(fieldName)

    try {
      const result = await validator(value)
      
      if (typeof result === 'string') {
        return result // エラーメッセージ
      }
      
      return result ? undefined : '検証に失敗しました'
    } catch (error) {
      console.error(`非同期バリデーションエラー (${fieldName}):`, error)
      return '検証中にエラーが発生しました'
    } finally {
      pendingValidations.value.delete(fieldName)
    }
  }

  const isValidating = (fieldName?: string): boolean => {
    if (fieldName) {
      return pendingValidations.value.has(fieldName)
    }
    return pendingValidations.value.size > 0
  }

  return {
    validateAsync,
    isValidating,
    pendingValidations: readonly(pendingValidations),
  }
}

/**
 * フォームの状態保存・復元
 */
export function useFormPersistence<T extends Record<string, unknown>>(formKey: string) {
  const saveForm = (values: T) => {
    if (import.meta.client) {
      localStorage.setItem(`form_${formKey}`, JSON.stringify(values))
    }
  }

  const loadForm = (): T | null => {
    if (import.meta.client) {
      const saved = localStorage.getItem(`form_${formKey}`)
      return saved ? JSON.parse(saved) as T : null
    }
    return null
  }

  const clearForm = () => {
    if (import.meta.client) {
      localStorage.removeItem(`form_${formKey}`)
    }
  }

  return {
    saveForm,
    loadForm,
    clearForm,
  }
}
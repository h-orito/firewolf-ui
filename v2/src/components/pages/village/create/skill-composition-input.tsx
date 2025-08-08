import {
  parseSkillComposition,
  validateSkillComposition,
  extractSkillStringsFromComposition,
  type CompositionValidationResult,
  type ParsedSkillComposition,
  type ParticipantDetail,
} from '@/lib/utils/skill'
import {
  basicCompositionPattern,
  generateV1StyleCompositions,
} from '@/lib/utils/skill-composition-generator'
import type { Skill } from '@/types/skill'
import { AlertCircle, CheckCircle, HelpCircle, Info, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Alert } from '@/components/ui/alert'

interface SkillCompositionInputProps {
  value: string
  onChange: (value: string) => void
  skills?: Skill[]
  isDummySkillMissing?: boolean
  minParticipants: number
  maxParticipants: number
  className?: string
}

export function SkillCompositionInput({
  value,
  onChange,
  skills,
  isDummySkillMissing,
  minParticipants,
  maxParticipants,
  className = '',
}: SkillCompositionInputProps) {
  const [composition, setComposition] = useState<ParsedSkillComposition[]>([])
  const [showTooltip, setShowTooltip] = useState(false)
  const [validation, setValidation] = useState<CompositionValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
    totalParticipants: 0,
    wolfCount: 0,
    villagerSideCount: 0,
    thirdPartyCount: 0,
    campBalance: {
      wolf: 0,
      villager: 0,
      thirdParty: 0,
    },
    skillCounts: {},
    participantDetails: [],
  })

  // 編成文字列が変更された時の処理
  useEffect(() => {
    // 役職部分のみを抽出してパース
    const skillStrings = extractSkillStringsFromComposition(value)
    const combinedSkillString = skillStrings.join('')
    const parsed = parseSkillComposition(combinedSkillString, skills)
    const validated = validateSkillComposition(
      parsed,
      skills,
      isDummySkillMissing,
      value,
      minParticipants,
      maxParticipants
    )

    setComposition(parsed)
    setValidation(validated)
  }, [value, skills, isDummySkillMissing, minParticipants, maxParticipants])

  const handleInputChange = (newValue: string) => {
    onChange(newValue)
  }

  // 編成自動生成の処理
  const handleGenerateComposition = () => {
    if (!skills) return

    try {
      const result = generateV1StyleCompositions(
        minParticipants,
        maxParticipants,
        basicCompositionPattern,
        skills
      )
      onChange(result)
    } catch (error) {
      console.error('編成生成エラー:', error)
    }
  }

  // tooltipの外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTooltip && !(event.target as Element).closest('.relative')) {
        setShowTooltip(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTooltip])

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* 自動生成ボタン */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleGenerateComposition}
              className="px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!skills}
            >
              <RefreshCw className="w-4 h-4 inline mr-1" />
              編成を自動生成
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTooltip(!showTooltip)}
                className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                aria-label="詳細説明"
              >
                <HelpCircle className="w-3 h-3 text-gray-600" />
              </button>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                  設定した人数範囲（{minParticipants}人〜{maxParticipants}
                  人）で編成を自動生成し、下のテキストエリアに上書きします
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>
          </div>
          {!skills && (
            <Alert variant="warning" showIcon={false}>
              役職データの読み込み中です...
            </Alert>
          )}
        </div>

        {/* 手動入力エリア */}
        <div className="space-y-2">
          <textarea
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="例: 狼狼占霊狩狂村村村村"
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-y ${
              validation.isValid
                ? 'border-gray-300 focus:ring-blue-500'
                : 'border-red-300 focus:ring-red-500'
            }`}
          />

          <div className="text-xs text-gray-500">
            役職の略称を連続して入力してください（例: 狼狼占霊狩狂村村村村）
          </div>
        </div>
      </div>

      {/* 編成プレビュー */}
      {composition.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium mb-2">編成プレビュー</h4>
          {/* 人数ごとの詳細情報 */}
          {validation.participantDetails.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <h5 className="text-xs font-medium text-gray-700 mb-2">人数ごとの詳細</h5>
              <div className="space-y-2">
                {validation.participantDetails.map((detail) => (
                  <div key={detail.participants} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{detail.participants}人:</span>
                      <span>
                        狼{detail.wolfCount}人, 人間{detail.humanCount}人, 縄{detail.ropeCount}本
                      </span>
                    </div>
                    {/* 人数ごとのエラー表示 */}
                    {detail.errors.map((error, index) => (
                      <div
                        key={`${detail.participants}-error-${index}`}
                        className="flex items-start space-x-1 text-xs text-red-600 ml-2"
                      >
                        <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    ))}
                    {/* 人数ごとの警告表示 */}
                    {detail.warnings.map((warning, index) => (
                      <div
                        key={`${detail.participants}-warning-${index}`}
                        className="flex items-start space-x-1 text-xs text-amber-600 ml-2"
                      >
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* バリデーションメッセージ */}
      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="mt-3 space-y-2">
          {validation.errors.map((error, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}

          {validation.warnings.map((warning, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm text-amber-600">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {validation.isValid && composition.length > 0 && (
        <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>編成は有効です</span>
        </div>
      )}
    </div>
  )
}

import Image from 'next/image'
import type { Chara } from '@/types/charachip'
import type { components } from '@/types/generated/api'

type CharaView = components['schemas']['CharaView']

interface CharacterImageProps {
  chara: Chara | CharaView
  faceType?: string
  alt?: string
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'original'
}

export function CharacterImage({
  chara,
  faceType = 'NORMAL',
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  size = 'original',
}: CharacterImageProps) {
  // 指定されたfaceTypeの画像を取得、なければ最初の画像を使用
  const getImageUrl = () => {
    const targetFace = chara.face_list.find((face) => face.type === faceType)
    return targetFace?.image_url || chara.face_list[0]?.image_url
  }

  // サイズ設定を取得
  const getSizeConfig = () => {
    if (size === 'original') {
      return {
        width: chara.display.width,
        height: chara.display.height,
      }
    }

    const sizeMap = {
      xs: { width: 16, height: 16 },
      sm: { width: 24, height: 24 },
      md: { width: 32, height: 32 },
      lg: { width: 40, height: 40 },
      xl: { width: 48, height: 48 },
    }

    return sizeMap[size]
  }

  const imageUrl = getImageUrl()
  const sizeConfig = getSizeConfig()

  if (!imageUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-500 text-xs rounded ${className}`}
        style={{
          width: sizeConfig.width,
          height: sizeConfig.height,
        }}
      >
        画像なし
      </div>
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={alt || chara.chara_name.name}
      width={sizeConfig.width}
      height={sizeConfig.height}
      className={`rounded ${className}`}
      loading={loading}
      priority={priority}
    />
  )
}

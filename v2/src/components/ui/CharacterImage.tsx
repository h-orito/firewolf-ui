import Image from 'next/image'
import type { Chara } from '@/types/charachip'
import type { components } from '@/types/generated/api'

type CharaView = components['schemas']['CharaView']

interface CharacterImageProps {
  chara: Chara | CharaView
  faceType?: string
  alt?: string
  className?: string
  /** 画像サイズの倍率（1.0 = 元サイズ） */
  scale?: number
}

export function CharacterImage({
  chara,
  faceType = 'NORMAL',
  alt,
  className = '',
  scale = 1,
}: CharacterImageProps) {
  // 指定されたfaceTypeの画像を取得、なければ最初の画像を使用
  const getImageUrl = () => {
    const targetFace = chara.face_list.find((face) => face.type === faceType)
    return targetFace?.image_url || chara.face_list[0]?.image_url
  }

  // サイズ設定を取得（スケール適用）
  const getSizeConfig = () => {
    // キャラクターの元サイズにスケールを適用
    return {
      width: Math.round(chara.display.width * scale),
      height: Math.round(chara.display.height * scale),
    }
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
      loading="lazy"
    />
  )
}

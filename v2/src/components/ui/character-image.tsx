import Image from 'next/image'
import type { Chara } from '@/types/charachip'

interface CharacterImageProps {
  chara: Chara
  faceType?: string
  alt?: string
  className?: string
}

export function CharacterImage({
  chara,
  faceType = 'NORMAL',
  alt,
  className = '',
}: CharacterImageProps) {
  // 指定されたfaceTypeの画像を取得、なければ最初の画像を使用
  const getImageUrl = () => {
    const targetFace = chara.face_list?.find((face) => face.type === faceType)
    return targetFace?.image_url || chara.face_list?.[0]?.image_url
  }

  const imageUrl = getImageUrl()

  if (!imageUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-500 text-xs ${className}`}
        style={{
          width: chara.display.width,
          height: chara.display.height,
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
      width={chara.display.width}
      height={chara.display.height}
      className={className}
    />
  )
}

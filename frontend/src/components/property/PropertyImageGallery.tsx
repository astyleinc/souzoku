'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, Camera, Expand } from 'lucide-react'

type PropertyImageGalleryProps = {
  images: string[]
  title: string
}

export const PropertyImageGallery = ({ images, title }: PropertyImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (images.length === 0) return null

  const goPrev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const goNext = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <>
      <div className="relative">
        {/* メイン画像 */}
        <div
          className="relative aspect-[16/9] sm:aspect-[2/1] bg-neutral-100 cursor-pointer group"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[activeIndex]}
            alt={`${title} - 写真${activeIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority={activeIndex === 0}
          />
          {/* オーバーレイ */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Expand className="w-6 h-6 text-white opacity-0 group-hover:opacity-70 transition-opacity" />
          </div>

          {/* 前後ナビ */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 text-white hover:bg-black/50 flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 text-white hover:bg-black/50 flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* 枚数表示 */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2.5 py-1.5 rounded-lg backdrop-blur-sm">
            <Camera className="w-3.5 h-3.5" />
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* サムネイル一覧 */}
        {images.length > 1 && (
          <div className="flex gap-1.5 mt-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden transition-all ${
                  i === activeIndex
                    ? 'ring-2 ring-primary-500 opacity-100'
                    : 'opacity-60 hover:opacity-90'
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} - サムネイル${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ライトボックス */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* 閉じるボタン */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 枚数 */}
          <div className="absolute top-4 left-4 text-white/70 text-sm z-10">
            {activeIndex + 1} / {images.length}
          </div>

          {/* メイン画像 */}
          <div
            className="relative w-full max-w-5xl aspect-[4/3] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} - 写真${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* 前後ナビ */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* サムネイル */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i) }}
                  className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all ${
                    i === activeIndex
                      ? 'ring-2 ring-white opacity-100'
                      : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`サムネイル${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

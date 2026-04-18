import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSearch } from '@/components/home/HeroSearch'
import { HeroReveal } from '@/components/home/HeroReveal'
import { HomeResults } from '@/components/home/HomeResults'
import { HomeFeatures } from '@/components/home/HomeFeatures'

export const metadata: Metadata = {
  title: 'Ouver｜相続不動産の入札マッチング',
  description:
    '相続した不動産を、複数の買い手による入札で市場価格に。税理士・司法書士と連携し、手続きもワンストップで解決します。',
  openGraph: {
    title: 'Ouver｜相続不動産の入札マッチング',
    description: '入札方式で適正価格、士業連携で相続手続きもワンストップ。',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <div className="bg-warm min-h-screen">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* 背景写真 + 左からフェードするオーバーレイ */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format"
              alt=""
              fill
              priority
              className="object-cover object-[center_40%]"
              sizes="100vw"
            />
            <div className="absolute inset-0 hero-gradient" />
          </div>
          {/* 下端を warm に溶かし、次セクションへ繋げる */}
          <div className="absolute inset-x-0 bottom-0 h-28 z-[1] hero-edge pointer-events-none" />

          <HeroReveal searchSlot={<HeroSearch />} />
        </section>

        {/* RESULTS */}
        <HomeResults />

        {/* FEATURES */}
        <HomeFeatures />

        {/* PARTNERS CTA — 士業・提携宅建業者の募集導線 */}
        <section className="relative overflow-hidden mt-5">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1400&q=80&auto=format"
              alt=""
              fill
              className="object-cover object-[center_60%]"
              sizes="100vw"
            />
            <div className="absolute inset-0 cta-gradient" />
          </div>

          <div className="relative z-[1] max-w-[1260px] mx-auto px-5 md:px-9 py-20 flex flex-wrap items-center justify-between gap-8">
            <div>
              <div className="text-[11px] tracking-[0.32em] font-semibold text-white/60 mb-4">
                FOR PARTNERS
              </div>
              <h2 className="text-white font-bold text-[clamp(22px,2.6vw,30px)] tracking-[-0.025em] leading-[1.3]">
                税理士・司法書士・宅建業者の皆さまへ
              </h2>
              <p className="text-white/70 text-[13px] mt-3 max-w-[480px] leading-[1.85]">
                相続案件のワンストップ化を担うパートナーを募集しています。紹介料・案件配分の仕組みをご案内します。
              </p>
            </div>
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-bark rounded-full text-[13px] font-semibold whitespace-nowrap transition-[transform,opacity] hover:-translate-y-px hover:opacity-95"
            >
              パートナー制度を見る
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

const fade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: EASE },
  },
}

const lineMask: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const lineInner: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.7, ease: EASE },
  },
}

const eyebrowLine: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.5, ease: EASE },
  },
}

export const HeroReveal = ({ searchSlot }: { searchSlot: ReactNode }) => (
  <>
    <div className="relative z-[2] max-w-[1260px] mx-auto px-5 md:px-9 pt-24 md:pt-36 pb-32 md:pb-40">
      <div className="max-w-[640px]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fade}
          transition={{ delay: 0 }}
          className="flex items-center gap-3 mb-10 text-[11px] tracking-[0.32em] font-semibold text-sage-deep"
        >
          <motion.span
            aria-hidden
            variants={eyebrowLine}
            style={{ originX: 0 }}
            className="block w-8 h-px bg-sage-deep/50"
          />
          入札で、相続不動産を適正価格に
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={lineMask}
          transition={{ delayChildren: 0.15 }}
          className="font-bold text-[clamp(28px,5.4vw,60px)] leading-[1.1] tracking-[-0.035em] text-bark mb-7 [word-break:keep-all] [overflow-wrap:anywhere]"
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span variants={lineInner} className="block whitespace-nowrap">
              相続した不動産を、
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span variants={lineInner} className="block whitespace-nowrap">
              <span className="text-sage-deep">もっと納得</span>できる価格で。
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.85 }}
          className="text-[15px] text-bark-2 leading-[1.95] max-w-[480px] mb-10"
        >
          複数の買い手による入札で市場価格を形成。税理士・司法書士と連携し、相続手続きもワンストップで。
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 1.0 }}
        >
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-bark text-warm rounded-full text-[13px] font-semibold tracking-[0.02em] transition-[transform,opacity] hover:opacity-90 hover:-translate-y-px"
          >
            物件を探す
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE, delay: 1.15 }}
      className="relative z-[3] max-w-[1260px] mx-auto px-5 md:px-9 -mt-[88px] md:-mt-[104px] pb-4"
    >
      {searchSlot}
    </motion.div>
  </>
)

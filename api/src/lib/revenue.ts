import {
  COMMISSION_RATE_NW,
  COMMISSION_RATE_DIRECT,
  TIERED_BROKER_RATE,
  BROKERAGE_FEE,
  ONE_SIDED_BROKER_RATE,
  LOW_VALUE_THRESHOLD,
  LOW_VALUE_FEE_CAP,
} from '@shared/constants'

// 仲介手数料を計算（片手、税別）
// 低廉な空家等の売買特例: 800万円以下は上限30万円（税別）
export const calculateBrokerageFee = (salePrice: number): number => {
  const calculated = Math.floor(salePrice * BROKERAGE_FEE.RATE + BROKERAGE_FEE.BASE_ADDITION)
  if (salePrice <= LOW_VALUE_THRESHOLD) {
    return Math.min(LOW_VALUE_FEE_CAP, calculated)
  }
  return calculated
}

// 両手仲介手数料（税別）
export const calculateBothSidesFee = (salePrice: number): number =>
  calculateBrokerageFee(salePrice) * BROKERAGE_FEE.BOTH_SIDES_MULTIPLIER

// 税込み
export const withTax = (amount: number): number =>
  Math.floor(amount * (1 + BROKERAGE_FEE.TAX_RATE))

// 段階的手数料率から業者レートを取得
export const getBrokerTieredRate = (totalDeals: number) => {
  if (totalDeals <= TIERED_BROKER_RATE.INITIAL.maxDeals) {
    return {
      brokerRate: TIERED_BROKER_RATE.INITIAL.brokerRate,
      ouverRate: TIERED_BROKER_RATE.INITIAL.ouverRate,
    }
  }
  if (totalDeals <= TIERED_BROKER_RATE.GROWING.maxDeals) {
    return {
      brokerRate: TIERED_BROKER_RATE.GROWING.brokerRate,
      ouverRate: TIERED_BROKER_RATE.GROWING.ouverRate,
    }
  }
  return {
    brokerRate: TIERED_BROKER_RATE.STANDARD.brokerRate,
    ouverRate: TIERED_BROKER_RATE.STANDARD.ouverRate,
  }
}

// 報酬配分を計算
export type RevenueBreakdown = {
  brokerageFee: number
  brokerageFeeWithTax: number
  brokerAmount: number
  ouverAmount: number
  professionalAmount: number
  nwAmount: number
  brokerRate: number
  ouverRate: number
  professionalRate: number
  nwRate: number
}

export const calculateRevenueDistribution = (
  salePrice: number,
  isNwReferral: boolean,
  brokerTotalDeals: number,
  options: { isOneSided?: boolean } = {},
): RevenueBreakdown => {
  const isOneSided = options.isOneSided ?? false

  // 片手仲介時は片手分の手数料のみ、両手時はその2倍
  const brokerageFee = isOneSided
    ? calculateBrokerageFee(salePrice)
    : calculateBothSidesFee(salePrice)
  const brokerageFeeWithTax = withTax(brokerageFee)

  const baseRates = isNwReferral ? COMMISSION_RATE_NW : COMMISSION_RATE_DIRECT

  let brokerRate: number
  let ouverRate: number

  if (isOneSided) {
    // 片手仲介時は業者 60% 固定、段階的手数料率は適用しない
    brokerRate = ONE_SIDED_BROKER_RATE
    // 士業・NW率は維持し、残りを Ouver が取る
    ouverRate = 1 - brokerRate - baseRates.PROFESSIONAL - baseRates.NW
  } else {
    // 両手時は段階的手数料率を適用（業者とOuverの間で調整、士業・NWは固定）
    const tiered = getBrokerTieredRate(brokerTotalDeals)
    brokerRate = tiered.brokerRate
    ouverRate = tiered.ouverRate
  }

  const professionalRate = baseRates.PROFESSIONAL
  const nwRate = baseRates.NW

  const brokerAmount = Math.floor(brokerageFee * brokerRate)
  const professionalAmount = Math.floor(brokerageFee * professionalRate)
  const nwAmount = Math.floor(brokerageFee * nwRate)
  // Ouverは端数を吸収
  const ouverAmount = brokerageFee - brokerAmount - professionalAmount - nwAmount

  return {
    brokerageFee,
    brokerageFeeWithTax,
    brokerAmount,
    ouverAmount,
    professionalAmount,
    nwAmount,
    brokerRate,
    ouverRate,
    professionalRate,
    nwRate,
  }
}

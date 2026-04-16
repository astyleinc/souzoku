import {
  COMMISSION_RATE_NW,
  COMMISSION_RATE_DIRECT,
  TIERED_BROKER_RATE,
  BROKERAGE_FEE,
} from '@shared/constants'

// 仲介手数料を計算（片手、税別）
export const calculateBrokerageFee = (salePrice: number): number =>
  Math.floor(salePrice * BROKERAGE_FEE.RATE + BROKERAGE_FEE.BASE_ADDITION)

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
): RevenueBreakdown => {
  const brokerageFee = calculateBothSidesFee(salePrice)
  const brokerageFeeWithTax = withTax(brokerageFee)

  const baseRates = isNwReferral ? COMMISSION_RATE_NW : COMMISSION_RATE_DIRECT
  const tiered = getBrokerTieredRate(brokerTotalDeals)

  // 段階的手数料率は業者とOuverの間で調整。士業・NWは固定
  const brokerRate = tiered.brokerRate
  const ouverRate = tiered.ouverRate
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

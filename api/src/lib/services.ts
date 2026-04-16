import { getDb } from '../db/client'
import { createPropertyService } from '../services/property.service'
import { createBidService } from '../services/bid.service'
import { createProfessionalService } from '../services/professional.service'
import { createBrokerService } from '../services/broker.service'
import { createCaseService } from '../services/case.service'
import { createRevenueService } from '../services/revenue.service'
import { createNotificationService } from '../services/notification.service'

// サービスインスタンスの取得を一箇所に集約
export const services = {
  get property() { return createPropertyService(getDb()) },
  get bid() { return createBidService(getDb()) },
  get professional() { return createProfessionalService(getDb()) },
  get broker() { return createBrokerService(getDb()) },
  get case() { return createCaseService(getDb()) },
  get revenue() { return createRevenueService(getDb()) },
  get notification() { return createNotificationService(getDb()) },
}

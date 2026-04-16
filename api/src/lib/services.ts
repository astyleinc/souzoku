import { getDb } from '../db/client'
import { createPropertyService } from '../services/property.service'
import { createBidService } from '../services/bid.service'
import { createProfessionalService } from '../services/professional.service'
import { createBrokerService } from '../services/broker.service'
import { createCaseService } from '../services/case.service'
import { createRevenueService } from '../services/revenue.service'
import { createNotificationService } from '../services/notification.service'
import { createUserService } from '../services/user.service'
import { createDocumentService } from '../services/document.service'
import { createSupportService } from '../services/support.service'
import { createAuditService } from '../services/audit.service'
import { createAdminService } from '../services/admin.service'
import { createTransactionService } from '../services/transaction.service'
import { createReferralService } from '../services/referral.service'
import { createContentService } from '../services/content.service'

// サービスインスタンスの取得を一箇所に集約
export const services = {
  get property() { return createPropertyService(getDb()) },
  get bid() { return createBidService(getDb()) },
  get professional() { return createProfessionalService(getDb()) },
  get broker() { return createBrokerService(getDb()) },
  get case() { return createCaseService(getDb()) },
  get revenue() { return createRevenueService(getDb()) },
  get notification() { return createNotificationService(getDb()) },
  get user() { return createUserService(getDb()) },
  get document() { return createDocumentService(getDb()) },
  get support() { return createSupportService(getDb()) },
  get audit() { return createAuditService(getDb()) },
  get admin() { return createAdminService(getDb()) },
  get transaction() { return createTransactionService(getDb()) },
  get referral() { return createReferralService(getDb()) },
  get content() { return createContentService(getDb()) },
}

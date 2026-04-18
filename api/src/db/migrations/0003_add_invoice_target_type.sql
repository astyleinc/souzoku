-- 請求書テーブルに対象種別カラムを追加（業者・士業・NWの3種）
DO $$ BEGIN
  CREATE TYPE "invoice_target_type" AS ENUM ('broker', 'professional', 'nw');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "invoices"
  ADD COLUMN IF NOT EXISTS "target_type" "invoice_target_type" NOT NULL DEFAULT 'broker';

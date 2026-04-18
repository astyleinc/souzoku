DO $$ BEGIN
  CREATE TYPE "public"."invoice_target_type" AS ENUM('broker', 'professional', 'nw');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "inheritance_start_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN IF NOT EXISTS "target_type" "invoice_target_type" DEFAULT 'broker' NOT NULL;

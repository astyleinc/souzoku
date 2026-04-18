ALTER TABLE "cases" ADD COLUMN "is_one_sided" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "revenue_distributions" ADD COLUMN "is_one_sided" boolean DEFAULT false NOT NULL;
ALTER TABLE "properties" ADD COLUMN "registering_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "registering_reminder_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "instant_price_reached_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "instant_price_bid_id" uuid;
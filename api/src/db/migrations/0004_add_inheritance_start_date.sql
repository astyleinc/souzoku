-- 相続開始日: 相続税申告期限（10ヶ月）・相続登記期限（3年）のカウントダウン起点
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "inheritance_start_date" timestamp with time zone;

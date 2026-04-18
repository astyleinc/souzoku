-- =====================================================================
-- Ouver 相続不動産マッチング — デモ用ログインアカウント
-- 本番デモで各ロールのログイン確認をするための最小アカウントSQL。
--
-- 使い方: Supabase SQL Editor に貼って実行。
-- 再実行しても壊れないよう ON CONFLICT DO NOTHING で冪等化。
--
-- 作成されるアカウント（共通パスワード: demo1234）:
--   demo-admin@ouver.jp          / admin         demo-admin-2@ouver.jp          / admin
--   demo-admin-3@ouver.jp        / admin
--   demo-seller@ouver.jp         / seller        demo-seller-2@ouver.jp         / seller
--   demo-seller-3@ouver.jp       / seller
--   demo-buyer@ouver.jp          / buyer         demo-buyer-2@ouver.jp          / buyer
--   demo-buyer-3@ouver.jp        / buyer
--   demo-professional@ouver.jp   / professional  demo-professional-2@ouver.jp   / professional
--   demo-professional-3@ouver.jp / professional
--   demo-broker@ouver.jp         / broker        demo-broker-2@ouver.jp         / broker
--   demo-broker-3@ouver.jp       / broker
--
-- 備考:
--   - auth_user / auth_account は BetterAuth が管理するテーブル。
--   - auth_account.password は BetterAuth が使う scrypt 形式 (N=16384,r=16,p=1,dkLen=64)
--     で生成した "salt_hex:key_hex" をそのまま入れている。
--   - 通常の Node.js 経由では databaseHooks で users レコードが自動作成されるが、
--     SQL 直挿入ではフックが走らないため users / profiles / professionals / brokers も
--     同時に投入している。
-- =====================================================================

BEGIN;

-- =====================================================================
-- 1. BetterAuth ユーザー (auth_user)
-- =====================================================================
INSERT INTO auth_user (id, name, email, email_verified, role, phone) VALUES
  ('demo-admin-auth-id',          '田中 太郎',   'demo-admin@ouver.jp',          true, 'admin',        '03-0000-0000'),
  ('demo-admin-2-auth-id',        '田中 次郎',   'demo-admin-2@ouver.jp',        true, 'admin',        '03-0000-0001'),
  ('demo-admin-3-auth-id',        '佐久間 由美', 'demo-admin-3@ouver.jp',        true, 'admin',        '03-0000-0002'),
  ('demo-seller-auth-id',         '中村 一郎',   'demo-seller@ouver.jp',         true, 'seller',       '03-1111-1111'),
  ('demo-seller-2-auth-id',       '中村 二郎',   'demo-seller-2@ouver.jp',       true, 'seller',       '03-1111-1112'),
  ('demo-seller-3-auth-id',       '石井 愛子',   'demo-seller-3@ouver.jp',       true, 'seller',       '03-1111-1113'),
  ('demo-buyer-auth-id',          '山本 健一',   'demo-buyer@ouver.jp',          true, 'buyer',        '03-2222-2222'),
  ('demo-buyer-2-auth-id',        '山本 健二',   'demo-buyer-2@ouver.jp',        true, 'buyer',        '03-2222-2223'),
  ('demo-buyer-3-auth-id',        '神野 美咲',   'demo-buyer-3@ouver.jp',        true, 'buyer',        '03-2222-2224'),
  ('demo-professional-auth-id',   '山田 太郎',   'demo-professional@ouver.jp',   true, 'professional', '03-3333-3333'),
  ('demo-professional-2-auth-id', '山田 次郎',   'demo-professional-2@ouver.jp', true, 'professional', '03-3333-3334'),
  ('demo-professional-3-auth-id', '宮田 あすか', 'demo-professional-3@ouver.jp', true, 'professional', '03-3333-3335'),
  ('demo-broker-auth-id',         '松本 大輝',   'demo-broker@ouver.jp',         true, 'broker',       '03-4444-4444'),
  ('demo-broker-2-auth-id',       '松本 二輝',   'demo-broker-2@ouver.jp',       true, 'broker',       '03-4444-4445'),
  ('demo-broker-3-auth-id',       '豊島 健吾',   'demo-broker-3@ouver.jp',       true, 'broker',       '03-4444-4446')
ON CONFLICT (email) DO NOTHING;

-- =====================================================================
-- 2. BetterAuth パスワード (auth_account, provider_id='credential')
--    全アカウント共通パスワード: demo1234
--    (scrypt で個別ソルトを振ってある)
-- =====================================================================
INSERT INTO auth_account (id, account_id, provider_id, user_id, password) VALUES
  ('demo-admin-acct-id',          'demo-admin-auth-id',          'credential', 'demo-admin-auth-id',
   'a84e8c3b15794a6eec30e355a31f1371:dd8a973a937ae21f15b4d9a1e1c8ee03a38256c956c01abbfac372f143c5b67d4a1ca845226ca1162927dbd7bb7935f3d857799a5d18b73a19f143e423ae2089'),
  ('demo-admin-2-acct-id',        'demo-admin-2-auth-id',        'credential', 'demo-admin-2-auth-id',
   'a84e8c3b15794a6eec30e355a31f1371:dd8a973a937ae21f15b4d9a1e1c8ee03a38256c956c01abbfac372f143c5b67d4a1ca845226ca1162927dbd7bb7935f3d857799a5d18b73a19f143e423ae2089'),
  ('demo-admin-3-acct-id',        'demo-admin-3-auth-id',        'credential', 'demo-admin-3-auth-id',
   'a84e8c3b15794a6eec30e355a31f1371:dd8a973a937ae21f15b4d9a1e1c8ee03a38256c956c01abbfac372f143c5b67d4a1ca845226ca1162927dbd7bb7935f3d857799a5d18b73a19f143e423ae2089'),
  ('demo-seller-acct-id',         'demo-seller-auth-id',         'credential', 'demo-seller-auth-id',
   '13e8974d0fccddf6badc3c5c67bb9d69:b16740bc73af05dd5f8d631acfea2b5591fe3aa6de24636d31bc2fb7a6e404e892208f8712b9ed8ce0d32406894d7b53fe5bf37c5527316c11de76cef4376a8d'),
  ('demo-seller-2-acct-id',       'demo-seller-2-auth-id',       'credential', 'demo-seller-2-auth-id',
   '13e8974d0fccddf6badc3c5c67bb9d69:b16740bc73af05dd5f8d631acfea2b5591fe3aa6de24636d31bc2fb7a6e404e892208f8712b9ed8ce0d32406894d7b53fe5bf37c5527316c11de76cef4376a8d'),
  ('demo-seller-3-acct-id',       'demo-seller-3-auth-id',       'credential', 'demo-seller-3-auth-id',
   '13e8974d0fccddf6badc3c5c67bb9d69:b16740bc73af05dd5f8d631acfea2b5591fe3aa6de24636d31bc2fb7a6e404e892208f8712b9ed8ce0d32406894d7b53fe5bf37c5527316c11de76cef4376a8d'),
  ('demo-buyer-acct-id',          'demo-buyer-auth-id',          'credential', 'demo-buyer-auth-id',
   'e3b9066938b6f148f073bcf4876fef86:f5b81d8fcf81f8ba8c58e94d9650dd66c7ecafb86d633baf0d534e609e144085cdbbbe18b791bc448ecb9ac7cc37cfc32bba95e185a37c6b3d8596eb7979d1ad'),
  ('demo-buyer-2-acct-id',        'demo-buyer-2-auth-id',        'credential', 'demo-buyer-2-auth-id',
   'e3b9066938b6f148f073bcf4876fef86:f5b81d8fcf81f8ba8c58e94d9650dd66c7ecafb86d633baf0d534e609e144085cdbbbe18b791bc448ecb9ac7cc37cfc32bba95e185a37c6b3d8596eb7979d1ad'),
  ('demo-buyer-3-acct-id',        'demo-buyer-3-auth-id',        'credential', 'demo-buyer-3-auth-id',
   'e3b9066938b6f148f073bcf4876fef86:f5b81d8fcf81f8ba8c58e94d9650dd66c7ecafb86d633baf0d534e609e144085cdbbbe18b791bc448ecb9ac7cc37cfc32bba95e185a37c6b3d8596eb7979d1ad'),
  ('demo-professional-acct-id',   'demo-professional-auth-id',   'credential', 'demo-professional-auth-id',
   'd291b0508487dcbe8be7730e46f85b5d:bb18de652ee169381ded0e01e1b4e03a7221ba0c005f44fe9cb119cdc273e14275da1c0cc5f579679b88a342e27ed5083daeb14b1ff7846fe74847ecfb60c829'),
  ('demo-professional-2-acct-id', 'demo-professional-2-auth-id', 'credential', 'demo-professional-2-auth-id',
   'd291b0508487dcbe8be7730e46f85b5d:bb18de652ee169381ded0e01e1b4e03a7221ba0c005f44fe9cb119cdc273e14275da1c0cc5f579679b88a342e27ed5083daeb14b1ff7846fe74847ecfb60c829'),
  ('demo-professional-3-acct-id', 'demo-professional-3-auth-id', 'credential', 'demo-professional-3-auth-id',
   'd291b0508487dcbe8be7730e46f85b5d:bb18de652ee169381ded0e01e1b4e03a7221ba0c005f44fe9cb119cdc273e14275da1c0cc5f579679b88a342e27ed5083daeb14b1ff7846fe74847ecfb60c829'),
  ('demo-broker-acct-id',         'demo-broker-auth-id',         'credential', 'demo-broker-auth-id',
   '73045e936f961c5e440772793e7033e1:96c81e5a656ea12176b47f4e67dec4d4aa350d37152e37fa5f1eca3db01edaa69313ad3a31096ad27d1072272787143866c1e956773ab19de118fcb3374f07b4'),
  ('demo-broker-2-acct-id',       'demo-broker-2-auth-id',       'credential', 'demo-broker-2-auth-id',
   '73045e936f961c5e440772793e7033e1:96c81e5a656ea12176b47f4e67dec4d4aa350d37152e37fa5f1eca3db01edaa69313ad3a31096ad27d1072272787143866c1e956773ab19de118fcb3374f07b4'),
  ('demo-broker-3-acct-id',       'demo-broker-3-auth-id',       'credential', 'demo-broker-3-auth-id',
   '73045e936f961c5e440772793e7033e1:96c81e5a656ea12176b47f4e67dec4d4aa350d37152e37fa5f1eca3db01edaa69313ad3a31096ad27d1072272787143866c1e956773ab19de118fcb3374f07b4')
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 3. アプリケーション users
-- =====================================================================
INSERT INTO users (id, auth_id, role, email, name, phone, address) VALUES
  ('a0000000-0000-4000-8000-00000000d001', 'demo-admin-auth-id',          'admin',        'demo-admin@ouver.jp',          '田中 太郎',   '03-0000-0000', '東京都港区虎ノ門1-1-1'),
  ('a0000000-0000-4000-8000-00000000d006', 'demo-admin-2-auth-id',        'admin',        'demo-admin-2@ouver.jp',        '田中 次郎',   '03-0000-0001', '東京都港区虎ノ門1-1-2'),
  ('a0000000-0000-4000-8000-00000000d007', 'demo-admin-3-auth-id',        'admin',        'demo-admin-3@ouver.jp',        '佐久間 由美', '03-0000-0002', '東京都港区虎ノ門1-1-3'),
  ('a0000000-0000-4000-8000-00000000d002', 'demo-seller-auth-id',         'seller',       'demo-seller@ouver.jp',         '中村 一郎',   '03-1111-1111', '東京都練馬区豊玉北5-1-1'),
  ('a0000000-0000-4000-8000-00000000d008', 'demo-seller-2-auth-id',       'seller',       'demo-seller-2@ouver.jp',       '中村 二郎',   '03-1111-1112', '神奈川県横浜市青葉区美しが丘4-5-6'),
  ('a0000000-0000-4000-8000-00000000d009', 'demo-seller-3-auth-id',       'seller',       'demo-seller-3@ouver.jp',       '石井 愛子',   '03-1111-1113', '埼玉県さいたま市南区大谷場1-2-3'),
  ('a0000000-0000-4000-8000-00000000d003', 'demo-buyer-auth-id',          'buyer',        'demo-buyer@ouver.jp',          '山本 健一',   '03-2222-2222', '東京都千代田区丸の内1-2-3'),
  ('a0000000-0000-4000-8000-00000000d010', 'demo-buyer-2-auth-id',        'buyer',        'demo-buyer-2@ouver.jp',        '山本 健二',   '03-2222-2223', '東京都港区六本木3-4-5'),
  ('a0000000-0000-4000-8000-00000000d011', 'demo-buyer-3-auth-id',        'buyer',        'demo-buyer-3@ouver.jp',        '神野 美咲',   '03-2222-2224', '千葉県船橋市本町1-3-2'),
  ('a0000000-0000-4000-8000-00000000d004', 'demo-professional-auth-id',   'professional', 'demo-professional@ouver.jp',   '山田 太郎',   '03-3333-3333', '東京都千代田区丸の内1-1-1'),
  ('a0000000-0000-4000-8000-00000000d012', 'demo-professional-2-auth-id', 'professional', 'demo-professional-2@ouver.jp', '山田 次郎',   '03-3333-3334', '東京都渋谷区神宮前3-2-1'),
  ('a0000000-0000-4000-8000-00000000d013', 'demo-professional-3-auth-id', 'professional', 'demo-professional-3@ouver.jp', '宮田 あすか', '03-3333-3335', '大阪府大阪市北区曽根崎2-1-1'),
  ('a0000000-0000-4000-8000-00000000d005', 'demo-broker-auth-id',         'broker',       'demo-broker@ouver.jp',         '松本 大輝',   '03-4444-4444', '東京都中央区日本橋1-1-1'),
  ('a0000000-0000-4000-8000-00000000d014', 'demo-broker-2-auth-id',       'broker',       'demo-broker-2@ouver.jp',       '松本 二輝',   '03-4444-4445', '東京都千代田区大手町1-1-1'),
  ('a0000000-0000-4000-8000-00000000d015', 'demo-broker-3-auth-id',       'broker',       'demo-broker-3@ouver.jp',       '豊島 健吾',   '03-4444-4446', '神奈川県横浜市西区みなとみらい3-3-1')
ON CONFLICT (email) DO NOTHING;

-- =====================================================================
-- 4. 売主プロフィール
-- =====================================================================
INSERT INTO seller_profiles (user_id, referral_code)
SELECT id, 'DEMO-SELLER' FROM users WHERE email = 'demo-seller@ouver.jp'
ON CONFLICT DO NOTHING;

INSERT INTO seller_profiles (user_id, referral_code)
SELECT id, 'DEMO-SELLER-2' FROM users WHERE email = 'demo-seller-2@ouver.jp'
ON CONFLICT DO NOTHING;

INSERT INTO seller_profiles (user_id, referral_code)
SELECT id, NULL FROM users WHERE email = 'demo-seller-3@ouver.jp'
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 5. 買い手プロフィール
-- =====================================================================
INSERT INTO buyer_profiles (user_id, buyer_type, company_name)
SELECT id, 'individual', NULL FROM users WHERE email = 'demo-buyer@ouver.jp'
ON CONFLICT DO NOTHING;

INSERT INTO buyer_profiles (user_id, buyer_type, company_name)
SELECT id, 'investor', 'デモインベスト株式会社' FROM users WHERE email = 'demo-buyer-2@ouver.jp'
ON CONFLICT DO NOTHING;

INSERT INTO buyer_profiles (user_id, buyer_type, company_name)
SELECT id, 'real_estate_company', 'デモ不動産買取株式会社' FROM users WHERE email = 'demo-buyer-3@ouver.jp'
ON CONFLICT DO NOTHING;

-- =====================================================================
-- 6. 士業プロフィール
-- =====================================================================
INSERT INTO professionals (
  user_id, qualification_type, registration_number, verification_status,
  employment_type, office_name, office_address, office_phone,
  referral_code, payment_recipient, payment_recipient_name,
  bank_name, bank_branch, bank_account_type, bank_account_number
)
SELECT
  id, 'tax_accountant', 'DEMO-REG-0001', 'manually_verified',
  'sole_proprietor', 'デモ税理士事務所', '東京都千代田区丸の内1-1-1', '03-3333-3333',
  'DEMO-PRO-001', 'self', '山田 太郎',
  'みずほ銀行', '東京営業部', '普通', '1234567'
FROM users WHERE email = 'demo-professional@ouver.jp'
ON CONFLICT (referral_code) DO NOTHING;

INSERT INTO professionals (
  user_id, qualification_type, registration_number, verification_status,
  employment_type, office_name, office_address, office_phone,
  referral_code, payment_recipient, payment_recipient_name,
  bank_name, bank_branch, bank_account_type, bank_account_number
)
SELECT
  id, 'judicial_scrivener', 'DEMO-REG-0002', 'manually_verified',
  'representative', 'デモ司法書士法人', '東京都渋谷区神宮前3-2-1', '03-3333-3334',
  'DEMO-PRO-002', 'office', 'デモ司法書士法人',
  '三菱UFJ銀行', '渋谷支店', '普通', '2345678'
FROM users WHERE email = 'demo-professional-2@ouver.jp'
ON CONFLICT (referral_code) DO NOTHING;

INSERT INTO professionals (
  user_id, qualification_type, registration_number, verification_status,
  employment_type, office_name, office_address, office_phone,
  referral_code, payment_recipient, payment_recipient_name,
  bank_name, bank_branch, bank_account_type, bank_account_number
)
SELECT
  id, 'lawyer', 'DEMO-REG-0003', 'manually_verified',
  'sole_proprietor', 'デモ法律事務所', '大阪府大阪市北区曽根崎2-1-1', '03-3333-3335',
  'DEMO-PRO-003', 'self', '宮田 あすか',
  '三井住友銀行', '梅田支店', '普通', '3456789'
FROM users WHERE email = 'demo-professional-3@ouver.jp'
ON CONFLICT (referral_code) DO NOTHING;

-- =====================================================================
-- 7. 業者プロフィール
-- =====================================================================
INSERT INTO brokers (
  user_id, company_name, representative_name, address, license_number,
  contact_person_name, bank_name, bank_branch, bank_account_type, bank_account_number
)
SELECT
  id, 'デモ不動産株式会社', '松本 大輝', '東京都中央区日本橋1-1-1', '東京都知事(1)第99999号',
  '松本 大輝', 'みずほ銀行', '東京営業部', '普通', '7654321'
FROM users WHERE email = 'demo-broker@ouver.jp'
ON CONFLICT DO NOTHING;

INSERT INTO brokers (
  user_id, company_name, representative_name, address, license_number,
  contact_person_name, bank_name, bank_branch, bank_account_type, bank_account_number
)
SELECT
  id, 'デモ都心ハウジング株式会社', '松本 二輝', '東京都千代田区大手町1-1-1', '東京都知事(1)第88888号',
  '松本 二輝', 'みずほ銀行', '大手町支店', '普通', '8765432'
FROM users WHERE email = 'demo-broker-2@ouver.jp'
ON CONFLICT DO NOTHING;

INSERT INTO brokers (
  user_id, company_name, representative_name, address, license_number,
  contact_person_name, bank_name, bank_branch, bank_account_type, bank_account_number
)
SELECT
  id, 'デモベイサイドリアルティー株式会社', '豊島 健吾', '神奈川県横浜市西区みなとみらい3-3-1', '神奈川県知事(1)第77777号',
  '豊島 健吾', '横浜銀行', 'みなとみらい支店', '普通', '9876543'
FROM users WHERE email = 'demo-broker-3@ouver.jp'
ON CONFLICT DO NOTHING;

COMMIT;

-- =====================================================================
-- 確認用
-- =====================================================================
-- SELECT u.email, u.role, au.email_verified, (aa.password IS NOT NULL) AS has_password
-- FROM users u
-- LEFT JOIN auth_user au ON au.id = u.auth_id
-- LEFT JOIN auth_account aa ON aa.user_id = au.id AND aa.provider_id = 'credential'
-- WHERE u.email LIKE 'demo-%@ouver.jp'
-- ORDER BY u.role;

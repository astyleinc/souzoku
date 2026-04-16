import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { genericOAuth } from 'better-auth/plugins'
import type { BetterAuthOptions } from 'better-auth'
import { getDb } from '../db/client'
import { authUser, authSession, authAccount, authVerification } from '../db/schema/auth'
import { users } from '../db/schema/users'
import { logger } from './logger'

// Apple Sign-Inのクライアントシークレット生成
const generateAppleClientSecret = async (): Promise<string> => {
  const { SignJWT, importPKCS8 } = await import('jose')

  const teamId = process.env.APPLE_TEAM_ID
  const clientId = process.env.APPLE_CLIENT_ID
  const keyId = process.env.APPLE_KEY_ID
  const privateKey = process.env.APPLE_PRIVATE_KEY

  if (!teamId || !clientId || !keyId || !privateKey) {
    throw new Error('Apple Sign-In環境変数が不足しています')
  }

  const key = await importPKCS8(privateKey.replace(/\\n/g, '\n'), 'ES256')

  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: keyId })
    .setIssuer(teamId)
    .setIssuedAt()
    .setExpirationTime('180d')
    .setAudience('https://appleid.apple.com')
    .setSubject(clientId)
    .sign(key)

  return jwt
}

const getAuthOptions = (): BetterAuthOptions => {
  const db = getDb()

  return {
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        user: authUser,
        session: authSession,
        account: authAccount,
        verification: authVerification,
      },
    }),
    baseURL: process.env.BETTER_AUTH_URL ?? (process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8787'),
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL]
      : process.env.NODE_ENV === 'production'
        ? []
        : ['http://localhost:3000'],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      },
      apple: {
        clientId: process.env.APPLE_CLIENT_ID ?? '',
        clientSecret: process.env.APPLE_CLIENT_SECRET ?? '',
      },
    },
    plugins: [
      genericOAuth({
        config: [
          {
            providerId: 'line',
            discoveryUrl: 'https://access.line.me/.well-known/openid-configuration',
            clientId: process.env.LINE_CLIENT_ID ?? '',
            clientSecret: process.env.LINE_CLIENT_SECRET ?? '',
            scopes: ['profile', 'openid', 'email'],
          },
        ],
      }),
    ],
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            // BetterAuthユーザー作成後にアプリケーションusersレコードを自動作成
            try {
              const role = (user.role as string) || 'buyer'
              await db.insert(users).values({
                authId: user.id,
                email: user.email,
                name: user.name,
                role: role as 'seller' | 'buyer' | 'professional' | 'broker' | 'admin',
              })
              logger.info('ユーザーレコード作成', { authId: user.id, email: user.email, role })
            } catch (err) {
              logger.error('ユーザーレコード作成失敗', { authId: user.id, error: err })
            }
          },
        },
      },
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'buyer',
        },
        phone: {
          type: 'string',
          required: false,
        },
      },
    },
  }
}

type AuthInstance = ReturnType<typeof betterAuth>

let authInstance: AuthInstance | undefined

export const getAuth = (): AuthInstance => {
  if (!authInstance) {
    authInstance = betterAuth(getAuthOptions())
  }
  return authInstance
}

export { generateAppleClientSecret }

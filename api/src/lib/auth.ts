import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { genericOAuth } from 'better-auth/plugins'
import type { BetterAuthOptions } from 'better-auth'
import { getDb } from '../db/client'

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
    database: drizzleAdapter(db, { provider: 'pg' }),
    baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:8787',
    secret: process.env.BETTER_AUTH_SECRET,
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

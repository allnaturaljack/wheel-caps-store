import { loadEnv, defineConfig, MedusaError } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const isProduction = process.env.NODE_ENV === 'production'
const isBuild = process.argv.includes('build')

// Refuse to serve production traffic on missing or starter secrets.
if (isProduction && !isBuild) {
  for (const name of ['JWT_SECRET', 'COOKIE_SECRET']) {
    const value = process.env[name]
    if (!value || value === 'supersecret' || value.length < 32) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `${name} must be set to a random value of at least 32 characters in production.`
      )
    }
  }
}

// Each integration below is switched on by its environment variables, so
// local development runs on Medusa's in-memory and local-disk defaults.
const redisUrl = process.env.REDIS_URL
const redisModules = redisUrl
  ? [
      {
        resolve: '@medusajs/medusa/event-bus-redis',
        options: { redisUrl },
      },
      {
        resolve: '@medusajs/medusa/workflow-engine-redis',
        options: { redis: { redisUrl } },
      },
      {
        resolve: '@medusajs/medusa/cache-redis',
        options: { redisUrl },
      },
      {
        resolve: '@medusajs/medusa/locking',
        options: {
          providers: [
            {
              resolve: '@medusajs/medusa/locking-redis',
              id: 'locking-redis',
              is_default: true,
              options: { redisUrl },
            },
          ],
        },
      },
    ]
  : []

const stripeModules = process.env.STRIPE_API_KEY
  ? [
      {
        resolve: '@medusajs/medusa/payment',
        options: {
          providers: [
            {
              resolve: '@medusajs/medusa/payment-stripe',
              id: 'stripe',
              options: {
                apiKey: process.env.STRIPE_API_KEY,
                webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                // Orders are printed on demand, so charge at checkout rather
                // than authorizing and capturing by hand in the admin.
                capture: true,
              },
            },
          ],
        },
      },
    ]
  : []

const fileModules = process.env.S3_BUCKET
  ? [
      {
        resolve: '@medusajs/medusa/file',
        options: {
          providers: [
            {
              resolve: '@medusajs/medusa/file-s3',
              id: 's3',
              options: {
                file_url: process.env.S3_FILE_URL,
                access_key_id: process.env.S3_ACCESS_KEY_ID,
                secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                region: process.env.S3_REGION,
                bucket: process.env.S3_BUCKET,
                endpoint: process.env.S3_ENDPOINT,
                prefix: process.env.S3_PREFIX,
              },
            },
          ],
        },
      },
    ]
  : []

// Without a Resend key, emails are logged to the console instead of sent.
const hasResend = Boolean(process.env.RESEND_API_KEY)
const notificationModules = [
  {
    resolve: '@medusajs/medusa/notification',
    options: {
      providers: [
        {
          resolve: '@medusajs/medusa/notification-local',
          id: 'local',
          options: {
            name: 'Local Notification Provider',
            channels: hasResend ? ['feed'] : ['feed', 'email'],
          },
        },
        ...(hasResend
          ? [
              {
                resolve: './src/modules/resend',
                id: 'resend',
                options: {
                  channels: ['email'],
                  api_key: process.env.RESEND_API_KEY,
                  from: process.env.RESEND_FROM_EMAIL,
                  reply_to: process.env.RESEND_REPLY_TO_EMAIL,
                },
              },
            ]
          : []),
      ],
    },
  },
]

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl,
    workerMode: process.env.MEDUSA_WORKER_MODE as
      | 'shared'
      | 'worker'
      | 'server'
      | undefined,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === 'true',
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  modules: [
    { resolve: './src/modules/fitment-request' },
    ...redisModules,
    ...stripeModules,
    ...fileModules,
    ...notificationModules,
  ],
})

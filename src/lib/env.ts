import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().min(1),
  NEXT_PUBLIC_NFT_CONTRACT_ADDRESS: z.string().startsWith('0x'),
  NFT_PRIVATE_KEY: z.string().min(1),
  NEXT_PUBLIC_RPC_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
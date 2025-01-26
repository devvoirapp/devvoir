import { Prisma } from '@prisma/client'

// Define the User model type including Lemon Squeezy fields
declare global {
  namespace PrismaJson {
    type UserType = Prisma.UserGetPayload<{
      include: {
        accounts: true;
        sessions: true;
      }
    }> & {
      lemonSqueezyCustomerId?: string | null;
      lemonSqueezySubscriptionId?: string | null;
    }
  }
}

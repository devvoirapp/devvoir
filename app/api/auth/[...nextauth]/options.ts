import prisma from '@/app/lib/prisma';
import { getNextMonthResetDate } from '@/utils/getNextMonthResetDate';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AuthOptions, DefaultSession, DefaultUser, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GithubProvider, { GithubProfile } from 'next-auth/providers/github';

interface CustomToken extends JWT {
    access_token?: string;
    login?: string;
    name?: string;
    email?: string;
    image?: string;
}

// Extend the built-in session types
declare module 'next-auth' {
    interface Session {
        access_token?: string;
        user: {
            id: string;
            login?: string;
            name?: string;
            email?: string;
            image?: string;
            createdAt?: string;
            lemonSqueezyCustomerId?: string;
        } & Omit<DefaultSession["user"], "id">
    }

    interface User extends Omit<DefaultUser, "id"> {
        id: string;
        login?: string;
        name?: string;
        email?: string;
        image?: string;
        createdAt?: string;
        lemonSqueezyCustomerId?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        access_token?: string;
        id: string;
        login?: string;
        name?: string;
        email?: string;
        image?: string;
        createdAt?: string;
        lemonSqueezyCustomerId?: string;
    }
}

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            authorization: {
                params: {
                    scope: 'read:org read:user repo user:email'
                }
            },
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    login: profile.login,
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, profile }) {
            try {
                if (profile && user) {
                    user.login = (profile as GithubProfile).login;
                    user.name = (profile as GithubProfile).name || (profile as GithubProfile).login;
                }
                return true;
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return false;
            }
        },
        async jwt({ token, account, user }) {
            if (account) {
                token.access_token = account.access_token;
            }
            if (user) {
                token.id = user.id;
                token.login = user.login;
                token.name = user.name;
                token.email = user.email;
                token.image = user.image;
                token.createdAt = user.createdAt;
                token.lemonSqueezyCustomerId = user.lemonSqueezyCustomerId;

                // Create user settings if they don't exist
                try {
                    const existingSettings = await prisma.userSettings.findUnique({
                        where: { userId: user.id }
                    });

                    if (!existingSettings) {
                        await prisma.userSettings.create({
                            data: {
                                userId: user.id,
                                monthlyResetDate: getNextMonthResetDate(),
                                additionalReportsPurchased: 0,
                                createdAt: new Date(),
                                lastReportDate: null,
                                monthlyReportCount: 0,
                                monthlyReportLimit: 20,
                                totalAvailableReports: 20,
                                reportCount: 0,
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error creating user settings:', error);
                }
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: CustomToken }) {
            console.log({token})
            if (token && session.user) {
                session.access_token = token.access_token;
                session.user.login = token.login || '';
                // session.user.lemonSqueezyCustomerId = token.lemonSqueezyCustomerId;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture || '';
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};

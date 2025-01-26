import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// type UserSettings = {
//     id: string;
//     userId: string;
//     reportCount: number;
//     lastReportDate: Date;
//     monthlyReportCount: number;
//     monthlyResetDate: Date | null;
//     totalAvailableReports: number;
//     additionalReportsPurchased: number;
//     usedPurchasedReports: number;
//     monthlyReportLimit: number;
//     createdAt: Date;
//     updatedAt: Date;
// };

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Get user and their settings
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { settings: true }
        });

        const userSettings = user?.settings;
        
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If settings don't exist, return defaults
        if (!user.settings) {
            return NextResponse.json({
                reportCount: userSettings?.reportCount,
                monthlyReportCount: userSettings?.monthlyReportCount,
                monthlyReportLimit: userSettings?.monthlyReportLimit,
                additionalReportsPurchased: userSettings?.additionalReportsPurchased,
                totalAvailableReports: userSettings?.totalAvailableReports,
                lastReportDate: userSettings?.lastReportDate,
                monthlyResetDate: userSettings?.monthlyResetDate,
            });
        }

        return NextResponse.json({
            reportCount: user.settings.reportCount,
            monthlyReportCount: user.settings.monthlyReportCount,
            monthlyReportLimit: user.settings.monthlyReportLimit,
            additionalReportsPurchased: user.settings.additionalReportsPurchased,
            totalAvailableReports: user?.settings?.totalAvailableReports,
            lastReportDate: user.settings.lastReportDate,
            monthlyResetDate: user.settings.monthlyResetDate,
            usedPurchasedReports: user.settings.usedPurchasedReports,
        });
    } catch (error) {
        console.error('Error fetching user settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user settings' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { additionalGenerations } = await request.json();

        // Validate input
        if (typeof additionalGenerations !== 'number' || additionalGenerations < 0) {
            return NextResponse.json(
                { error: 'Invalid generation count' },
                { status: 400 }
            );
        }

        // Update user settings with new generations
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                settings: {
                        update: {
                            additionalReportsPurchased: {
                                increment: additionalGenerations
                            }
                        }
                }
            },
            include: { settings: true }
        });

        return NextResponse.json({
            message: 'Generations updated successfully',
            additionalReportsPurchased: updatedUser.settings?.additionalReportsPurchased || 0
        });
    } catch (error) {
        console.error('Error updating user generations:', error);
        return NextResponse.json(
            { error: 'Failed to update generations' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

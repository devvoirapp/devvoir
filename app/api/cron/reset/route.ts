import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getNextMonthResetDate } from '@/utils/getNextMonthResetDate';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        // Verify the request is from Vercel Cron
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Get all users with their monthlyResetDate and report counts
        const users = await prisma.userSettings.findMany({
            select: {
                id: true,
                monthlyResetDate: true,
                monthlyReportCount: true,
                usedPurchasedReports: true
            }
        });

        const now = new Date();
        const currentDay = now.getDate();

        for (const user of users) {
            if (!user.monthlyResetDate) continue;

            const resetDate = new Date(user.monthlyResetDate);
            
            // Check if current time matches reset time
            if (currentDay === resetDate.getDate()) {
                const monthlyResetDate = getNextMonthResetDate();
                
                await prisma.userSettings.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        monthlyReportCount: 0,  // Only reset monthly count
                        monthlyResetDate,       // Set next reset date
                        // Preserve usedPurchasedReports as is
                    }
                });

                console.log(`Reset monthly generations for user ${user.id} at ${now.toISOString()}`);
                console.log(`Current purchased generations used: ${user.usedPurchasedReports}`);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in reset cron job:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

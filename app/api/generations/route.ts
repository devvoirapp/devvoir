import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
    try {
        // Get PR number from search params
        const { searchParams } = new URL(request.url);
        const selectedPR = searchParams.get('prNumber');

        if (!selectedPR) {
            return NextResponse.json({ error: 'PR number is required' }, { status: 400 });
        }

        // Get the session to retrieve the user ID
        const token = await getToken({ req: request });

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const email = token.email;

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        const generations = await prisma.report.findMany({
            where: {
                prNumber: parseInt(selectedPR),
                userId: user?.id
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                prNumber: true,
                createdAt: true,
                summary: true
            },
        });

        return NextResponse.json({ generations });

    } catch (error) {
        console.error('Error fetching generations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch generations' },
            { status: 500 }
        );
    }
}
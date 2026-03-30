import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { owner, repo, startDate, endDate, branch } = body;

        if (!owner || !repo) {
            return NextResponse.json({ error: 'Owner and repo are required' }, { status: 400 });
        }

        const url = new URL(`https://api.github.com/repos/${owner}/${repo}/pulls`);
        url.searchParams.set('state', 'all');
        url.searchParams.set('sort', 'created');
        url.searchParams.set('direction', 'desc');
        url.searchParams.set('per_page', '100');
        if (branch) url.searchParams.set('base', branch);

        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch pull requests');
        }

        let pulls = await response.json();

        if (startDate) {
            const start = new Date(startDate);
            pulls = pulls.filter((pr: { created_at: string }) => new Date(pr.created_at) >= start);
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            pulls = pulls.filter((pr: { created_at: string }) => new Date(pr.created_at) <= end);
        }

        return NextResponse.json(pulls, { status: 200 });

    } catch (error) {
        console.error('Error fetching pull requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pull requests' },
            { status: 500 }
        );
    }
}

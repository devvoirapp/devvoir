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
        const { owner, repo } = body;

        if (!owner || !repo) {
            return NextResponse.json({ error: 'Owner and repo are required' }, { status: 400 });
        }

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&sort=created&direction=desc&per_page=100`, {
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch pull requests');
        }

        const pulls = await response.json();

        console.log({pulls});

        return NextResponse.json(pulls, { status: 200 });

    } catch (error) {
        console.error('Error fetching pull requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pull requests' },
            { status: 500 }
        );
    }
}

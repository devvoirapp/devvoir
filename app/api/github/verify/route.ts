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
        const { username } = body;

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        const response = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
        });

        if (!response.ok) {
            console.log({responseStatus: response.status})
            if (response.status === 404) {
                return NextResponse.json({ error: 'GitHub account not found' }, { status: 404 });
            }
            throw new Error('Failed to verify GitHub account');
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.log({error})
        return NextResponse.json({ error: 'Failed to verify GitHub account' }, { status: 500 });
    }
}

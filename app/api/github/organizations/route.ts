import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/app/lib/prisma';
import { Account } from '@/app/report-generator/page';

interface GitHubRepo {
    owner: {
        id: string;
        login: string;
        avatar_url: string;
        type: string;
    };
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        console.log('Session:', session);

        if (!session?.access_token) {
            return NextResponse.json({ error: 'No access token found' }, { status: 401 });
        }

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the account from the database to check scopes
        const dbAccount = await prisma.account.findFirst({
            where: {
                userId: session.user.id,
                provider: 'github',
            },
        });

        console.log('Database Account:', {
            provider: dbAccount?.provider,
            scope: dbAccount?.scope,
            tokenType: dbAccount?.token_type,
        });

        const headers = {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${session.access_token}`,
            'X-GitHub-Api-Version': '2022-11-28',
        };

        // First, get the authenticated user's information
        const userResponse = await fetch('https://api.github.com/user', {
            headers
        });

        const userData = await userResponse.json();
        console.log('GitHub User Data:', {
            login: userData.login,
            id: userData.id,
            type: userData.type,
        });

        let allAccounts: Account[] = [];

        // 1. Add the authenticated user's account
        allAccounts.push({
            id: userData.id,
            login: userData.login,
            avatar_url: userData.avatar_url,
            type: 'User',
            name: userData.name || userData.login
        });

        // 2. Get organizations the user is a member of
        const orgResponse = await fetch('https://api.github.com/user/orgs', { headers });
        if (orgResponse.ok) {
            const orgs = await orgResponse.json();
            const orgsWithDetails = orgs.map((org: Account) => ({
                ...org,
                type: 'Organization',
                name: org.login
            }));
            allAccounts = [...allAccounts, ...orgsWithDetails];
        }

        // 3. Get repositories where user is a collaborator to find other accounts
        const reposResponse = await fetch('https://api.github.com/user/repos?per_page=100&affiliation=collaborator,organization_member', { headers });
        if (reposResponse.ok) {
            const repos = await reposResponse.json();
            
            // Extract unique owners from repositories
            const uniqueOwners = new Map();
            repos.forEach((repo: GitHubRepo) => {
                const owner = repo.owner;
                if (!uniqueOwners.has(owner.id) && owner.id !== userData.id) {
                    uniqueOwners.set(owner.id, {
                        id: owner.id,
                        login: owner.login,
                        avatar_url: owner.avatar_url,
                        type: owner.type,
                        name: owner.login
                    });
                }
            });

            allAccounts = [...allAccounts, ...Array.from(uniqueOwners.values())];
        }

        // Remove duplicates and sort by name
        const uniqueAccounts = Array.from(new Map(allAccounts.map(acc => [acc.id, acc])).values())
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        return NextResponse.json(uniqueAccounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }
}

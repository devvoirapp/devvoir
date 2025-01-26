import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

interface GitHubUser {
    login: string;
}

interface GitHubRepoPermissions {
    admin?: boolean;
    push?: boolean;
    pull?: boolean;
}

export interface GitHubRepo {
    name: string;
    owner: GitHubUser;
    permissions?: GitHubRepoPermissions;
    updated_at: string;
}

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { username } = body;

        if (!username || typeof username !== 'string') {
            return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
        }

        // Get authenticated user info
        const authUserResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        if (!authUserResponse.ok) {
            throw new Error('Failed to fetch authenticated user');
        }

        const authUser = (await authUserResponse.json()) as GitHubUser;
        const isAuthenticatedUser = authUser.login.toLowerCase() === username.toLowerCase();

        // First check if this is an organization
        const checkOrgResponse = await fetch(`https://api.github.com/orgs/${username}`, {
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        const isOrganization = checkOrgResponse.ok;
        let repos: GitHubRepo[] = [];

        if (isOrganization) {
            // For organizations, get repos where user is a member
            const orgReposResponse = await fetch(`https://api.github.com/orgs/${username}/repos?sort=updated&per_page=100`, {
                headers: {
                    'Authorization': `Bearer ${token.access_token}`,
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            if (!orgReposResponse.ok) {
                throw new Error('Failed to fetch organization repositories');
            }

            repos = await orgReposResponse.json() as GitHubRepo[];
        } else if (isAuthenticatedUser) {
            // For authenticated user, get all their repositories
            const userReposResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner', {
                headers: {
                    'Authorization': `Bearer ${token.access_token}`,
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            if (!userReposResponse.ok) {
                throw new Error('Failed to fetch user repositories');
            }

            repos = await userReposResponse.json() as GitHubRepo[];
        } else {
            // For other users, get repos where authenticated user is a collaborator
            const userReposResponse = await fetch(`https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=collaborator`, {
                headers: {
                    'Authorization': `Bearer ${token.access_token}`,
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            if (!userReposResponse.ok) {
                throw new Error('Failed to fetch user repositories');
            }

            const allRepos = await userReposResponse.json() as GitHubRepo[];
            // Filter to only show repos owned by the selected user where we're a collaborator
            repos = allRepos.filter((repo) => repo.owner.login.toLowerCase() === username.toLowerCase());
        }

        // Filter repos where user has access and sort by update date
        const accessibleRepos = repos
            .filter((repo) => 
                repo.permissions?.admin || 
                repo.permissions?.push || 
                repo.permissions?.pull
            )
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

        console.log('Accessible repos:', accessibleRepos.map((r) => ({ name: r.name, owner: r.owner.login })));
        return NextResponse.json(accessibleRepos);
    } catch (error) {
        console.error('Error in repositories route:', error);
        return NextResponse.json(
            { error: 'Failed to fetch repositories' },
            { status: 500 }
        );
    }
}

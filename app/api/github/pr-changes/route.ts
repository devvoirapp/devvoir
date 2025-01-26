import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

interface GitHubFile {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
}

function calculateFileImportance(file: GitHubFile): number {
    // Base importance on total lines changed
    let importance = file.additions + file.deletions;

    // Add weight for number of chunks changed (if patch exists)
    if (file.patch) {
        const chunkCount = (file.patch.match(/@@/g) || []).length / 2; // Each chunk has two @@ markers
        importance += chunkCount * 10; // Weight chunks more heavily
    }

    // Prioritize source code files over others
    const extension = file.filename.split('.').pop()?.toLowerCase();
    const sourceCodeExtensions = new Set(['ts', 'tsx', 'js', 'jsx', 'py', 'java', 'cpp', 'cs']);
    if (extension && sourceCodeExtensions.has(extension)) {
        importance *= 1.5; // 50% boost for source code files
    }

    // Deprioritize certain types of files
    const lowPriorityFiles = ['package-lock.json', 'yarn.lock', '.gitignore'];
    if (lowPriorityFiles.some(name => file.filename.endsWith(name))) {
        importance *= 0.5; // 50% reduction for low priority files
    }

    return importance;
}

export async function POST(request: NextRequest) {
    try {
        const token = await getToken({ req: request });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { owner, repo, prNumber } = await request.json();

        if (!owner || !repo || !prNumber) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`, {
            headers: {
                'Authorization': `Bearer ${token.access_token}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch PR changes');
        }

        const files = await response.json() as GitHubFile[];
        
        // Sort files by importance and take top 10
        const sortedFiles = files
            .map(file => ({
                ...file,
                importance: calculateFileImportance(file)
            }))
            .sort((a, b) => b.importance - a.importance)
            .slice(0, 10)
            .map(({ ...file }) => file); // Remove importance from final output

        return NextResponse.json(sortedFiles, { status: 200 });
        
    } catch (error) {
        console.error('Error fetching PR changes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch PR changes' },
            { status: 500 }
        );
    }
}

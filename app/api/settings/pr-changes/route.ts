import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// In-memory storage for demo purposes
// In a real app, this would be stored in a database
let prChangesEnabled = true;

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        return NextResponse.json({ enabled: prChangesEnabled });
    } catch (error) {
        console.log({error})
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { enabled } = await request.json();
        if (typeof enabled !== 'boolean') {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        // Update the setting
        prChangesEnabled = enabled;

        return NextResponse.json({ enabled: prChangesEnabled });
    } catch (error) {
        console.log({error})
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}

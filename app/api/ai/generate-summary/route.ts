import {NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {getServerSession} from 'next-auth';
import {authOptions} from '@/app/api/auth/[...nextauth]/options';
import MistralClient from '@mistralai/mistralai';
import {reportSystemPrompt} from '@/app/prompts/report-system-prompt';

const prisma = new PrismaClient();

// Add logging for environment variable
if (!process.env.MISTRAL_API_KEY) {
    console.error('MISTRAL_API_KEY is not set in environment variables');
}

const mistral = new MistralClient(process.env.MISTRAL_API_KEY || '');

// Helper function to get next month's reset date by adding days based on current month
function getNextMonthResetDate(): Date {
    const now = new Date();
    // Get the number of days in current month
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    // Create new date by adding the days
    const resetDate = new Date(now);
    resetDate.setDate(now.getDate() + daysInMonth);
    return resetDate;
}

// Helper function to manage user settings
async function manageUserSettings(userId: string, email: string) {
    const now = new Date();
    
    // First, try to get existing user settings
    const user = await prisma.user.findUnique({
        where: { email },
        include: { settings: true }
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Initialize settings if they don't exist
    if (!user.settings) {
        return {
            settings: await prisma.userSettings.create({
                data: {
                    userId,
                    reportCount: 1,
                    lastReportDate: now,
                    monthlyReportCount: 1,
                    monthlyResetDate: getNextMonthResetDate(),
                    additionalReportsPurchased: 0,
                    usedPurchasedReports: 0
                }
            }),
            limitReached: false,
            resetDate: null,
            usedPurchasedGeneration: false
        };
    }

    const settings = user.settings;
    const hasMonthlyGenerationsLeft = settings.monthlyReportCount < 20; // Default monthly limit
    const hasPurchasedGenerationsLeft = settings.usedPurchasedReports < settings.additionalReportsPurchased;

    // If monthly generations are available, use those first
    if (hasMonthlyGenerationsLeft) {
        const updatedSettings = await prisma.userSettings.update({
            where: { userId },
            data: {
                reportCount: { increment: 1 },
                lastReportDate: now,
                monthlyReportCount: { increment: 1 }
            }
        });

        return {
            settings: updatedSettings,
            limitReached: false,
            resetDate: null,
            usedPurchasedGeneration: false
        };
    }

    // If no monthly generations left, try to use purchased generations
    if (hasPurchasedGenerationsLeft) {
        const updatedSettings = await prisma.userSettings.update({
            where: { userId },
            data: {
                reportCount: { increment: 1 },
                lastReportDate: now,
                usedPurchasedReports: { increment: 1 }
            }
        });

        return {
            settings: updatedSettings,
            limitReached: false,
            resetDate: null,
            usedPurchasedGeneration: true
        };
    }

    // No generations available
    return {
        settings: settings,
        limitReached: true,
        resetDate: settings.monthlyResetDate ?? getNextMonthResetDate(),
        usedPurchasedGeneration: false
    };
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        // Get the user session
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Validate Mistral API key
        if (!process.env.MISTRAL_API_KEY) {
            throw new Error('Mistral API key is not configured');
        }

        const body = await request.json();

        if (!body || typeof body !== 'object' || !body.prChanges) {
            return NextResponse.json(
                { error: 'Invalid request body: prChanges is required' },
                { status: 400 }
            );
        }

        const { prChanges } = body;

        if (!prChanges.files || !Array.isArray(prChanges.files)) {
            return NextResponse.json(
                { error: 'Invalid request format: prChanges.files must be an array' },
                { status: 400 }
            );
        }

        // Format PR changes into a more concise format
        const formattedChanges = {
            prNumber: prChanges.prNumber,
            files: prChanges.files.map(file => ({
                patch: file.patch,
                status: file.status,
                additions: file.additions,
                deletions: file.deletions
            }))
        };

        // pixtral-12b-2409

        const result = await mistral.chat({
            model: "mistral-small-latest",
            messages: [
                { role: "system", content: reportSystemPrompt },
                { role: "user", content: `Please analyze these code changes and generate a structured report:\n${JSON.stringify(formattedChanges, null, 2)}` }
            ],
            temperature: 0.2,
            topP: 0.8,
            maxTokens: 1024,
        });
        
        const processedResponse = result.choices[0].message.content
            .split('\n')
            .map(line => {
                if (!line.trim() || line.trim().startsWith('#')) return '';
                
                const statusMatch = line.match(/^[-\s]*(Added|Modified|Removed)/i);
                if (statusMatch) {
                    const status = statusMatch[1].toLowerCase();
                    const content = line.slice(statusMatch[0].length).trim();
                    const emoji = status === 'added' ? '➕' : status === 'modified' ? '📝' : '🗑️';
                    return `- **${statusMatch[1]}** ${emoji} ${content}`;
                }
                return line;
            })
            .filter(line => line)
            .join('\n');

            const formatFeatureCard = (title: string, number: string, status: string, description: string, labels: string[]) => {
                const labelText = labels.map(label => `\`${label}\``).join(' ');
                return `# ✨ ${title}

**Status:** ${status}
**PR:** #${number}
${labelText ? `**Labels:** ${labelText}\n` : ''}

${description}`;
            };

        // Generate feature card if title contains "Feature:"
        let formattedContent: string;
        if (prChanges.title && prChanges.title.toLowerCase().includes('feat')) {
            const titleParts = prChanges.title.split(':');
            const featureTitle = titleParts[1]?.trim() || titleParts[0];
            const featureNumber = prChanges.prNumber?.toString() || '';
            const status = prChanges.state || 'In Review';
            const description = prChanges.description || 'No description provided.';
            const labels = prChanges.labels?.map(label => label.name) || [];
            
            formattedContent = formatFeatureCard(featureTitle, featureNumber, status, description, labels);
        } else {
            // Original PR formatting logic
            const prMetadata: string[] = [];

            // Title with PR number
            if (prChanges.title) {
                const formatReportHeader = (title: string, state: string, prNumber: string) => {
                    const stateEmoji = state === 'open' ? '🟢' : '🟣';
                    return `### ${title}

${stateEmoji} ${state.toUpperCase()} | PR #${prNumber}
`;
                };

                prMetadata.push(formatReportHeader(
                    prChanges.title,
                    prChanges.state,
                    prChanges.prNumber.toString()
                ));
            }

            // Meta information
            const metaItems: string[] = [];

            // Add creation date
            if (prChanges.createdAt) {
                const createdDate = new Date(prChanges.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                metaItems.push(`📅 Created: ${createdDate}`);
            }

            // Add labels if present
            if (prChanges.labels && prChanges.labels.length > 0) {
                const labels = prChanges.labels.map(label => `\`${label.name}\``);
                metaItems.push(`🏷️ ${labels.join(' ')}`);
            }

            // Add meta section if we have items
            if (metaItems.length > 0) {
                prMetadata.push(metaItems.join(' • '));
            }

            // Add description if present
            if (prChanges.description) {
                prMetadata.push(`\n> ${prChanges.description.replace(/\n/g, '\n> ')}\n`);
            }

            prMetadata.push('\n---\n');

            formattedContent = prMetadata.join('\n');
        }

        const finalResponse = `${formattedContent}\n\n### Changes Overview\n\n${processedResponse}`;

        // Get the user and their settings
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { settings: true }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Handle user settings
        const { settings, limitReached, resetDate, usedPurchasedGeneration } = await manageUserSettings(user.id, session.user.email);
        
        if (limitReached && resetDate) {
            return NextResponse.json(
                {
                    error: 'Monthly limit reached',
                    message: `You have reached your monthly limit of 20 summaries. Your limit will reset on ${resetDate.toISOString().split('T')[0]}.`
                },
                { status: 429 }
            );
        }

        // Save the report to the database
        const report = await prisma.report.create({
            data: {
                prNumber: prChanges.prNumber,
                summary: finalResponse,
                userId: user.id
            }
        });

        return NextResponse.json({
            summary: finalResponse,
            reportId: report.id,
            usage: {
                totalReports: settings.reportCount,
                monthlyReports: settings.monthlyReportCount,
                additionalPurchasedReports: settings.additionalReportsPurchased,
                usedPurchasedReports: settings.usedPurchasedReports
            },
            usedPurchasedGeneration: usedPurchasedGeneration
        });
    } catch (error) {
        console.error('Error generating summary:', error.message);

        // Handle specific error cases
        if ((error as { code?: string })?.code === 'context_length_exceeded') {
            return NextResponse.json(
                {
                    error: 'The changes are too large to analyze at once. Try selecting fewer files or PRs.',
                    summary: '### Analysis Limited\nThe selected changes exceed the AI model\'s capacity to analyze. Consider:\n\n' +
                        '- Approving fewer PRs at once\n' +
                        '- Filtering to specific files of interest\n' +
                        '- Breaking down the review into smaller chunks'
                },
                { status: 413 }
            );
        }

        // Handle Mistral API key configuration error
        if (error instanceof Error && error.message === 'Mistral API key is not configured') {
            return NextResponse.json(
                { error: 'Mistral API is not properly configured' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to generate summary' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export interface FileChange {
    filename: string;
    status: 'added' | 'modified' | 'removed';
    additions: number;
    deletions: number;
    patch?: string;
}

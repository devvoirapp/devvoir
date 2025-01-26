import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    nextauth_url: process.env.NEXTAUTH_URL,
    github_id_exists: !!process.env.GITHUB_ID,
    github_secret_exists: !!process.env.GITHUB_SECRET,
    nextauth_secret_exists: !!process.env.NEXTAUTH_SECRET,
  });
}

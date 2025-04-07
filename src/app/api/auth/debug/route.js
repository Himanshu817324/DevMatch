import { NextResponse } from 'next/server';
import { authOptions } from '../../../../../lib/auth';

export async function GET() {
  // Get configuration info (without exposing secrets)
  const diagnostics = {
    nextAuthUrl: process.env.NEXTAUTH_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID ?
      `${process.env.GOOGLE_CLIENT_ID.substring(0, 8)}...` : 'Not set',
    googleClientConfigured: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    authOptionsProviders: Object.keys(authOptions.providers).map(key =>
      authOptions.providers[key]?.id || 'unknown'
    ),
    environment: process.env.NODE_ENV,
  };

  return NextResponse.json({ diagnostics });
} 
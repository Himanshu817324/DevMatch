import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authOptions } from '../../../../../lib/auth';

// Export the NextAuth handler with full configuration
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from './mongodb';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🧪 Authorize function started');

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          throw new Error('Email and password required');
        }

        await connectToDatabase();
        console.log('✅ Connected to MongoDB');

        const user = await User.findOne({ email: credentials.email }).select('+password').lean();
        console.log('🧑‍💻 User fetched:', user?.email);

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        console.log('🔐 Password match:', isPasswordMatch);

        if (!isPasswordMatch) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }

    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Log sign-in attempt
      console.log("Sign-in attempt:", {
        provider: account?.provider,
        email: user?.email
      });
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        console.log("JWT callback:", {
          provider: account?.provider,
          accountId: account?.providerAccountId,
        });

        await connectToDatabase();

        let dbUser;
        // Check if user exists in our database
        dbUser = await User.findOne({ email: user.email });

        // If signing in with OAuth and user doesn't exist in our DB, create them
        if (!dbUser && (account.provider === 'google' || account.provider === 'github')) {
          console.log("Creating new user from OAuth:", {
            name: user.name || user.login,
            email: user.email,
          });

          dbUser = await User.create({
            name: user.name || user.login,
            email: user.email,
            image: user.picture || user.avatar_url,
            accountType: 'oauth',
            oauthProvider: account.provider,
          });
        }

        // Add the MongoDB user id to the token
        if (dbUser) {
          token.uid = dbUser._id.toString();
        }

        return token;
      }

      return token;
    },
    async session({ session, token }) {
      // Add user id to session
      if (token?.uid) {
        session.user.id = token.uid;
      }

      return session;
    }
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export default authOptions; 
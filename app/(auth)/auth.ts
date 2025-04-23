import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { IUser } from '@/types/models';
import { loginUser } from '@/lib/server-api-client';

import { authConfig } from './auth.config';
import { DUMMY_PASSWORD } from '@/lib/constants';

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        try {
          // Use the loginUser function from our API client
          const response = await loginUser(email, password);

          if (response && response.user) {
            return response.user as any;
          }

          return null;
        } catch (error) {
          // If login fails, do a dummy compare to prevent timing attacks
          await compare(password, DUMMY_PASSWORD);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});

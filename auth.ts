import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Spotify from "next-auth/providers/spotify";
import { db } from "./db";
import { accounts, users } from "./db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  session: {
    strategy: "jwt",
  },
  providers: [Google, Spotify],
  callbacks: {
    async signIn({ user, account, profile, email }) {
      return true; // Allow sign-in
    },
    async jwt({ token, user, account, profile, session }) {
      return token;
    },
    async session({ session, token, user, newSession }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Spotify from "next-auth/providers/spotify";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [Google, Spotify],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const existing = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        })
        .from(users)
        .where(eq(users.email, user.email!))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(users).values({
          name: user.name ?? "",
          email: user.email!,
          image: user.image ?? "",
        });
      } else {
        const existingUser = existing[0];

        await db
          .update(users)
          .set({
            name: user.name ?? existingUser.name,
            image: user.image ?? existingUser.image,
            updatedAt: new Date(),
          })
          .where(eq(users.email, user.email!));
      }
      return true; // Allow sign-in
    },
    async jwt({ token, user, account, profile, session }) {
      if (account && profile) {
        token.provider = account.provider?.toUpperCase() as
          | "SPOTIFY"
          | "GOOGLE"
          | undefined;

        switch (account.provider.toUpperCase()) {
          case "SPOTIFY":
            token.spotify_userid = profile.id;
            token.spotify_followers = profile.followers?.total;
            break;
          case "GOOGLE":
            break;
        }
      }
      return token;
    },
    async session({ session, token, user, newSession }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      if (token.provider) {
        session.user.provider = token.provider;

        switch (token.provider) {
          case "SPOTIFY":
            session.user.spotify_userid = token.spotify_userid;
            session.user.followers = token.spotify_followers;
            session.user.spotify_profile = `https://open.spotify.com/user/${token.spotify_userid}`;
            break;
          case "GOOGLE":
            break;
        }
      }

      return session;
    },
  },
});

// token => session

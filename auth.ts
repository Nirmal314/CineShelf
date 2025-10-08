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
    async signIn({ user }) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email!))
        .limit(1);

      let userId: string;

      if (!existingUser) {
        const inserted = await db
          .insert(users)
          .values({
            name: user.name ?? "",
            email: user.email!,
            image: user.image ?? "",
          })
          .returning({ id: users.id });

        userId = inserted[0].id;
      } else {
        userId = existingUser.id;
        await db
          .update(users)
          .set({
            name: user.name ?? existingUser.name,
            image: user.image ?? existingUser.image,
            updatedAt: new Date(),
          })
          .where(eq(users.email, user.email!));
      }

      user.id = userId;

      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user?.id) {
        token.id = user.id;
      }

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

    async session({ session, token }) {
      if (token.id) session.user.id = token.id;

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

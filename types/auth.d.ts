import { Session, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    spotify_userid?: string | null;
    provider?: "SPOTIFY" | "GOOGLE";
    spotify_followers?: number | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      provider?: string | null;

      // Spotify
      spotify_userid?: string | null;
      followers?: number | null;
      spotify_profile?: string | null;
    } & DefaultSession["user"];
  }

  interface Profile {
    display_name?: string;
    id?: string | undefined;
    email?: string;
    images?: { url: string }[];
    country?: string;
    external_urls?: { spotify?: string };
    followers?: { href?: string | null; total: number | null };
  }
}

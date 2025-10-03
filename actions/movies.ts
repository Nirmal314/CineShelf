"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { movies, userMovies } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";
import { SearchedMovie } from "@/types";
import { and, asc, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type SearchActionState = {
  data: SearchedMovie[] | null;
  error: Error | null;
};

export async function searchMovies(
  _: any,
  formData: FormData
): Promise<SearchActionState> {
  try {
    const title = formData.get("movie") as string | null;

    if (!title) return { data: null, error: new Error("Missing title") };

    const movieResponse = await tryCatch(
      fetch(
        `https://api.imdbapi.dev/search/titles?query=${encodeURIComponent(
          title
        )}`
      )
    );

    if (movieResponse.error || !movieResponse.data)
      return {
        data: null,
        error: movieResponse.error ?? new Error("Failed to fetch"),
      };

    const data = await movieResponse.data.json();

    const titles = data.titles;
    if (!titles) return { data: [], error: null };

    return { data: titles as SearchedMovie[], error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

export const addMovie = async (movie: {
  id: string;
  title: string;
  poster?: string;
  rank?: number;
}) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const promise = db.transaction(async (tx) => {
    // movies table
    await tx
      .insert(movies)
      .values({
        id: movie.id,
        title: movie.title,
        poster: movie.poster ?? null,
      })
      .onConflictDoNothing();

    // users - movies junction table
    await tx
      .insert(userMovies)
      .values({
        userId: session.user.id,
        movieId: movie.id,
        rank: movie.rank ?? -1,
      })
      .onConflictDoNothing();
  });

  const result = await tryCatch(promise);

  if (result.error) return false;

  revalidatePath("/");

  return true;
};

export const getUserMovies = async () => {
  const session = await auth();
  if (!session?.user?.id) return [];

  const promise = db
    .select({
      id: movies.id,
      title: movies.title,
      poster: movies.poster,
      rank: userMovies.rank,
    })
    .from(userMovies)
    .innerJoin(movies, eq(movies.id, userMovies.movieId))
    .where(eq(userMovies.userId, session.user.id))
    .orderBy(asc(userMovies.rank));

  const result = await tryCatch(promise);

  if (result.error) return [];

  return result.data;
};

export const deleteMovies = async (movieIds: string[]) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  if (movieIds.length === 0) return false;

  const conditions = movieIds.map((id) => eq(userMovies.movieId, id));

  const promise = db
    .delete(userMovies)
    .where(and(or(...conditions), eq(userMovies.userId, session.user.id)));

  const result = await tryCatch(promise);

  if (result.error) return false;

  revalidatePath("/");

  return true;
};

export const updateMovieRank = async (movieId: string, rank: number) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const result = await tryCatch(
    db
      .update(userMovies)
      .set({ rank })
      .where(
        and(
          eq(userMovies.userId, session.user.id),
          eq(userMovies.movieId, movieId)
        )
      )
  );

  if (result.error) return false;

  revalidatePath("/");

  return true;
};

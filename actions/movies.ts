"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { movies, userMovies } from "@/db/schema";
import { tryCatch } from "@/lib/try-catch";
import { SearchedMovie } from "@/types";
import { and, eq, isNull, or } from "drizzle-orm";
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

  const userId = session.user.id;

  const promise = db.transaction(async (tx) => {
    // note down the movie
    await tx
      .insert(movies)
      .values({
        id: movie.id,
        title: movie.title,
        poster: movie.poster ?? null,
      })
      .onConflictDoNothing();

    // find tail
    const tail = await tx.query.userMovies.findFirst({
      where: and(eq(userMovies.userId, userId), isNull(userMovies.nextMovieId)),
    });

    if (tail) {
      // new movie at tail
      await tx
        .update(userMovies)
        .set({ nextMovieId: movie.id })
        .where(
          and(
            eq(userMovies.userId, userId),
            eq(userMovies.movieId, tail.movieId)
          )
        );

      await tx.insert(userMovies).values({
        userId,
        movieId: movie.id,
        prevMovieId: tail.movieId,
        nextMovieId: null,
      });
    } else {
      // new movie as head
      await db.insert(userMovies).values({
        userId,
        movieId: movie.id,
        prevMovieId: null,
        nextMovieId: null,
      });
    }
  });

  const result = await tryCatch(promise);

  if (result.error) return false;

  revalidatePath("/");

  return true;
};

export const getUserMovies = async () => {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userId = session.user.id;

  const movies = await db.query.userMovies.findMany({
    where: eq(userMovies.userId, userId),
    with: { movie: true },
  });

  if (movies.length <= 0) return [];

  const map = new Map(movies.map((m) => [m.movieId, m]));
  let head = movies.find((m) => !m.prevMovieId) ?? null;

  const ordered = [];

  while (head) {
    ordered.push(head.movie);

    head = head.nextMovieId ? map.get(head.nextMovieId) ?? null : null;
  }

  return ordered;
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

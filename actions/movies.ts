"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { movies } from "@/db/schema";
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
}) => {
  const session = await auth();

  if (!session?.user?.id) throw new Error("Not authenticated");

  const promise = db
    .insert(movies)
    .values({
      userId: session.user.id,
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster ?? null,
    })
    .onConflictDoNothing();

  const result = await tryCatch(promise);

  if (result.error) return false;

  revalidatePath("/");

  return true;
};

export const getUserMovies = async () => {
  const session = await auth();
  if (!session?.user?.id) return [];

  const promise = db
    .select()
    .from(movies)
    .where(eq(movies.userId, session.user.id))
    .orderBy(asc(movies.title)); // TODO: Order by user ranking

  const result = await tryCatch(promise);

  if (result.error) return [];

  return result.data;
};

export const deleteMovies = async (movieIds: string[]) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  if (movieIds.length === 0) return false;

  const conditions = movieIds.map((id) => eq(movies.movieId, id));

  const promise = db
    .delete(movies)
    .where(and(or(...conditions), eq(movies.userId, session.user.id)));

  const result = await tryCatch(promise);

  if (result.error) return false;

  revalidatePath("/");

  return true;
};

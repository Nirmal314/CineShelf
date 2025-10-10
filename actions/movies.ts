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

export const removeMovie = async (movieId: string) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const userId = session.user.id;

  await db.transaction(async (tx) => {
    const movieToDelete = await tx.query.userMovies.findFirst({
      where: and(
        eq(userMovies.userId, userId),
        eq(userMovies.movieId, movieId)
      ),
    });

    if (!movieToDelete) return;

    if (movieToDelete.prevMovieId) {
      await tx
        .update(userMovies)
        .set({ nextMovieId: movieToDelete.nextMovieId })
        .where(
          and(
            eq(userMovies.userId, userId),
            eq(userMovies.movieId, movieToDelete.prevMovieId)
          )
        );
    }
    if (movieToDelete.nextMovieId) {
      await tx
        .update(userMovies)
        .set({ prevMovieId: movieToDelete.prevMovieId })
        .where(
          and(
            eq(userMovies.userId, userId),
            eq(userMovies.movieId, movieToDelete.nextMovieId)
          )
        );
    }

    await tx
      .delete(userMovies)
      .where(
        and(eq(userMovies.userId, userId), eq(userMovies.movieId, movieId))
      );
  });

  revalidatePath("/");
};

export const swapMovies = async (oldMovieId: string, newMovieId: string) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  if (oldMovieId === newMovieId) throw new Error("Can't swap same movies");

  const userId = session.user.id;

  const txPromise = db.transaction(async (tx) => {
    const [a, b] = await Promise.all([
      tx.query.userMovies.findFirst({
        where: and(
          eq(userMovies.userId, userId),
          eq(userMovies.movieId, oldMovieId)
        ),
      }),
      tx.query.userMovies.findFirst({
        where: and(
          eq(userMovies.userId, userId),
          eq(userMovies.movieId, newMovieId)
        ),
      }),
    ]);

    if (!a || !b) throw new Error("Movie(s) not found");

    if (a.movieId === b.movieId) throw new Error("Can't swap same movies");

    const aPrev = a.prevMovieId;
    const aNext = a.nextMovieId;
    const bPrev = b.prevMovieId;
    const bNext = b.nextMovieId;

    const aBeforeB = aNext === b.movieId;
    const bBeforeA = bNext === a.movieId;

    if (aBeforeB || bBeforeA) {
      const first = aBeforeB ? a : b;
      const second = aBeforeB ? b : a;

      if (first.prevMovieId) {
        await tx
          .update(userMovies)
          .set({ nextMovieId: second.movieId })
          .where(
            and(
              eq(userMovies.userId, userId),
              eq(userMovies.movieId, first.prevMovieId)
            )
          );
      }

      if (second.nextMovieId) {
        await tx
          .update(userMovies)
          .set({ prevMovieId: first.movieId })
          .where(
            and(
              eq(userMovies.userId, userId),
              eq(userMovies.movieId, second.nextMovieId)
            )
          );
      }

      await tx
        .update(userMovies)
        .set({ prevMovieId: second.movieId, nextMovieId: second.nextMovieId })
        .where(
          and(
            eq(userMovies.userId, userId),
            eq(userMovies.movieId, first.movieId)
          )
        );

      await tx
        .update(userMovies)
        .set({ prevMovieId: first.prevMovieId, nextMovieId: first.movieId })
        .where(
          and(
            eq(userMovies.userId, userId),
            eq(userMovies.movieId, second.movieId)
          )
        );

      return true;
    }

    await tx
      .update(userMovies)
      .set({ prevMovieId: bPrev, nextMovieId: bNext })
      .where(
        and(eq(userMovies.userId, userId), eq(userMovies.movieId, a.movieId))
      );

    await tx
      .update(userMovies)
      .set({ prevMovieId: aPrev, nextMovieId: aNext })
      .where(
        and(eq(userMovies.userId, userId), eq(userMovies.movieId, b.movieId))
      );

    if (aPrev) {
      await tx
        .update(userMovies)
        .set({ nextMovieId: b.movieId })
        .where(
          and(eq(userMovies.userId, userId), eq(userMovies.movieId, aPrev))
        );
    }

    if (aNext) {
      await tx
        .update(userMovies)
        .set({ prevMovieId: b.movieId })
        .where(
          and(eq(userMovies.userId, userId), eq(userMovies.movieId, aNext))
        );
    }

    if (bPrev) {
      await tx
        .update(userMovies)
        .set({ nextMovieId: a.movieId })
        .where(
          and(eq(userMovies.userId, userId), eq(userMovies.movieId, bPrev))
        );
    }

    if (bNext) {
      await tx
        .update(userMovies)
        .set({ prevMovieId: a.movieId })
        .where(
          and(eq(userMovies.userId, userId), eq(userMovies.movieId, bNext))
        );
    }

    return true;
  });

  const result = await tryCatch(txPromise);

  if (result.error)
    throw new Error(result.error.message || "Unsuccessful swap!");

  return true;

  // revalidatePath("/");
};

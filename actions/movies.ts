"use server";

import { tryCatch } from "@/lib/try-catch";
import { SearchedMovie } from "@/types";

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

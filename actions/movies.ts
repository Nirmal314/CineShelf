"use server";

import { tryCatch } from "@/lib/try-catch";

export const searchMovies = async (title: string) => {
  if (!title) return null;

  const res = await tryCatch(
    fetch(
      `https://api.imdbapi.dev/search/titles?query=${encodeURIComponent(title)}`
    )
  );

  if (res.error) return null;

  const response = await res.data.json();

  if (!response.titles) return null;

  return response.titles;
};

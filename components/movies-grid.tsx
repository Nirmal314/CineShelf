import { getUserMovies } from "@/actions/movies";
import UserMovies from "./swapy/user-movies";

export default async function MoviesGrid() {
  const movies = await getUserMovies();

  return <UserMovies initialMovies={movies} />;
}

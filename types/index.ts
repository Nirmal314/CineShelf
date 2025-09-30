export type Rating = {
  source: string;
  value: string;
};

export type Movie = {
  title: string;
  plot: string;
  released: Date;
  //   rated: string;
  durationInMinutes: number;
  genre: string;
  director: string;
  //   writer: string;
  //   actors: string[];
  //   language: string;
  //   country: string;
  //   awards: string;
  poster: string;
  ratings: Rating[];
  //   metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  type: string;
  //   dvd: string;
  //   boxOffice: string;
  //   production: string;
  //   website: string;
  //   response: string;
};

export type SearchedMovie = {
  id: string;
  type: string;
  primaryTitle: string;
  originalTitle: string;
  primaryImage: {
    url: string;
    height: number;
    width: number;
  };
  startYear: number;
  rating: {
    aggregateRating: number;
    voteCount: number;
  };
};

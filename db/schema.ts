import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const movies = pgTable("movies", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  poster: text("poster"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userMovies = pgTable(
  "user_movies",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),

    // Doubly linked list pointers
    prevMovieId: text("prev_movie_id").references(() => movies.id, {
      onDelete: "set null",
    }),
    nextMovieId: text("next_movie_id").references(() => movies.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.movieId] }),
    index("idx_user_movies_user").on(t.userId),
    index("idx_user_movies_prev").on(t.userId, t.prevMovieId),
    index("idx_user_movies_next").on(t.userId, t.nextMovieId),
  ]
);

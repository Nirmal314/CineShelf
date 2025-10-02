CREATE TABLE "movie" (
	"userId" text NOT NULL,
	"movieId" text NOT NULL,
	"title" text NOT NULL,
	"poster" text,
	CONSTRAINT "movie_userId_movieId_pk" PRIMARY KEY("userId","movieId")
);
--> statement-breakpoint
ALTER TABLE "movie" ADD CONSTRAINT "movie_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
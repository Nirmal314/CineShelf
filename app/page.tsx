import { auth } from "@/auth";
import { GoogleSignIn, SpotifySignIn, UserProfile } from "@/components/auth-buttons";
import { getFloatingItems } from "@/components/floating-items";

const Index = async () => {
  const session = await auth()

  if (!session)
    return (
      <>
        <div className="relative">
          {getFloatingItems(13).map((el) => el)}

          <div className="relative z-10 flex min-h-screen items-center justify-center px-6 md:px-8">
            <div className="w-full">

              <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
                <p className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-4 tracking-tight leading-snug">
                  Welcome to <span className="italic">Cine<span className="text-primary">Shelf</span></span>
                </p>
                <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto tracking-wide">
                  Your personal digital shelf for movies and music.
                </p>
              </div>

              <div className="text-center max-w-2xl mx-auto mb-12">
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed tracking-wide">
                  Save, rank, and organize your favorite films and their soundtracks. Build your own digital shelf of cinematic memories.
                </p>
              </div>

              <div className="space-y-4 text-center">
                <p className="text-muted-foreground text-base md:text-lg mb-6 tracking-wide">
                  Start exploring with your account.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <GoogleSignIn />
                  <SpotifySignIn />
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="absolute bottom-5 w-full">
          <p className="text-sm text-muted-foreground text-center tracking-wide">
            Made with love and passion.
          </p>
        </div>
      </>
    );

  return (
    <>
      <div className="relative">
        {getFloatingItems(13).map((el) => el)}

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 md:px-8">
          <div className="flex flex-col justify-center items-center max-w-2xl mx-auto mb-12 sm:mb-16 animate-fade-in text-center">
            <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-foreground mb-4 tracking-tight leading-snug">
              Welcome to{" "}
              <span className="italic">
                Cine<span className="text-primary">Shelf</span>
              </span>
            </p>

            <UserProfile image={session.user.image} name={session.user.name} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 w-full px-2">
        <p className="text-xs sm:text-sm text-muted-foreground text-center tracking-wide">
          Made with love and passion.
        </p>
      </div>
    </>
  )

};

export default Index;

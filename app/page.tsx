import { auth } from "@/auth";
import Home from "./pages/home";
import Movies from "./pages/movies";

const Index = async () => {
  const session = await auth()

  if (!session)
    return <Home />

  return <Movies session={session} />
};

export default Index;

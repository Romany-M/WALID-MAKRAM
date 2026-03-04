import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://wnlfimqifwcjmyrajnaq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndubGZpbXFpZndjam15cmFqbmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1ODk0NDksImV4cCI6MjA4ODE2NTQ0OX0.ZDx4Yvs3LcJ7me2zSbRHc-gH7RQXABGuuZmOF05gBBw"
);
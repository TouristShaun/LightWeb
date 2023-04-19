import type { Session, User } from "@supabase/supabase-js"

interface UserData {
  user?: User
  session?: Session
}

type AppState = "signed-in" | "signed-out"

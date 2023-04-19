import Logo from "~components/Logo"

import "../style.css"

import { useStorage } from "@plasmohq/storage/hook"

import SignIn from "~components/SignIn"
import type { AppState, UserData } from "~type"

const Options = () => {
  const [appState, setAppState] = useStorage<AppState>("light-app-state")

  const [userData, setUserData] = useStorage<UserData>("light-user")

  const onSignOut = () => {
    setUserData({})
    setAppState("signed-out")
  }

  return (
    <section className="w-screen h-screen text-white bg-black flex flex-col gap-[50px] items-center justify-center">
      {appState === "signed-out" ? (
        <>
          <Logo variant="dark" width={60} />
          <SignIn />
        </>
      ) : (
        <section className="flex flex-col gap-[40px] w-[400px]">
          <Logo variant="dark" width={40} className="opacity-50" />
          <div className="flex items-center justify-between">
            <p className="opacity-50">Email</p>
            <p>{userData?.user?.email}</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="w-full p-2.5 rounded-lg bg-red-600 transition hover:bg-red-600/80 text-white font-medium">
            Sign out
          </button>
          <p className="text-center opacity-50">0.1</p>
        </section>
      )}
    </section>
  )
}

export default Options

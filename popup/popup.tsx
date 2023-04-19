import Logo from "~components/Logo"

import "../style.css"

import { useStorage } from "@plasmohq/storage/hook"

import type { AppState } from "~type"

function Popup() {
  const [appState] = useStorage<AppState>("light-app-state")

  return (
    <div className="flex flex-col px-[15px] py-[20px] gap-[20px] h-fit w-[400px] bg-black text-white border-[1px] border-white/10">
      <div className="flex items-center justify-between">
        <Logo variant="dark" width={30} className="opacity-50" />
        {appState === "signed-out" ? (
          <div className="flex gap-[10px] items-center">
            <div className="relative flex items-center justify-center">
              <span className="w-[10px] h-[10px] bg-red-600 absolute rounded-full opacity-30" />
              <span className="w-[5px] h-[5px] bg-red-500 absolute animate-pulse z-1 rounded-full" />
            </div>
            <span className="text-red-600">Authentication is required</span>
          </div>
        ) : (
          <div className="flex gap-[10px] items-center">
            <div className="relative flex items-center justify-center">
              <span className="w-[10px] h-[10px] bg-green-600 absolute rounded-full opacity-30" />
              <span className="w-[5px] h-[5px] bg-green-500 absolute animate-pulse z-1 rounded-full" />
            </div>
            <span className="text-green-600">Active</span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() =>
          chrome.tabs.create({
            url: `${window.location.origin}/options.html`
          })
        }
        className="w-full px-2.5 py-2 rounded-lg bg-white transition hover:bg-white/90 text-black font-medium">
        {appState === "signed-out" ? "Sign In" : "Settings"}
      </button>
    </div>
  )
}

export default Popup

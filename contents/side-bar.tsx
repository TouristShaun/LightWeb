import cssText from "data-text:~/contents/style.css"
import { AnimatePresence, motion } from "framer-motion"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"
import { useDebounce } from "tiny-use-debounce"

import { useStorage } from "@plasmohq/storage/hook"

import "./style.css"

import Logo from "~components/Logo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const SideBar = () => {
  const [sideBarVisibility, setSideBarVisibility] = useStorage(
    "light-side-bar-visibility",
    (v) => (v === undefined ? false : v)
  )

  const [localPromptText, setLocalPromptText] = useStorage(
    "light-prompt-bar-text",
    (v) => (v === undefined ? "" : v)
  )

  const [promptText, setPromptText] = useState<string>("")
  const [showSideBar, setShowSideBar] = useState(false)

  const sideBarRef = useRef<HTMLDivElement>(null)

  // Close side bar when clicked outside
  /*   useEffect(() => {
    const onHandleClickOutside = (event: MouseEvent) => {
      if (
        sideBarRef.current &&
        !sideBarRef.current.contains(event.target as Node)
      ) {
        setShowSideBar((prev) => !prev)
      }
    }

    document.addEventListener("mousedown", onHandleClickOutside)
    return () => {
      document.removeEventListener("mousedown", onHandleClickOutside)
    }
  }, [sideBarRef]) */

  // Load local prompt text to state
  useEffect(() => {
    if (localPromptText) {
      setPromptText(localPromptText)
    }
  }, [localPromptText])

  // Save prompt bar visibility state to local
  useEffect(() => {
    setSideBarVisibility(showSideBar)
  }, [showSideBar])

  // Load local prompt bar visibility to state
  useEffect(() => {
    setShowSideBar(sideBarVisibility)
  }, [sideBarVisibility])

  return (
    <AnimatePresence>
      {showSideBar ? (
        <motion.section
          ref={sideBarRef}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-[300px] h-screen fixed right-0 bg-black/80 backdrop-blur-md drop-shadow-md shadow-xl rounded-lg border-white m-auto border-[1.5px] border-white/[0.13]">
          <section className="flex items-center justify-between w-full p-[15px] border-t-[1.5px] border-white/[0.13] bg-white/5 rounded-t-lg">
            <div className="h-fit w-fit opacity-30">
              <Logo variant="dark" width={50} />
            </div>
            <button onClick={() => setShowSideBar((prev) => !prev)}>x</button>
          </section>
          <section className="flex flex-col gap-[10px] p-[15px] bg-transparent h-full">
            <p>{promptText}</p>
          </section>
        </motion.section>
      ) : null}
    </AnimatePresence>
  )
}

export default SideBar

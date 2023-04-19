import cssText from "data-text:~/style.css"
import { AnimatePresence, motion } from "framer-motion"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"
import { useDebounce } from "tiny-use-debounce"

import { useStorage } from "@plasmohq/storage/hook"

import Logo from "~components/Logo"
import PromptInput from "~components/PromptInput"
import type { AppState } from "~type"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PromptBar = () => {
  const [localPromptText, setLocalPromptText] = useStorage(
    "light-prompt-bar-text",
    (v) => (v === undefined ? "" : v)
  )

  const [promptBarVisibility, setPromptBarVisibility] = useStorage(
    "light-prompt-bar-visibility",
    (v) => (v === undefined ? false : v)
  )

  const [sideBarVisibility, setSideBarVisibility] = useStorage(
    "light-side-bar-visibility",
    (v) => (v === undefined ? false : v)
  )

  const [appState, setAppState] = useStorage<AppState>("light-app-state")

  const [arrStr, setArrStr] = useStorage("light-arr-str", (v) =>
    v === undefined ? [] : v
  )

  const [promptText, setPromptText] = useState<string>("")
  const [showPromptBar, setShowPromptBar] = useState(false)

  const promptBarInputRef = useRef<HTMLInputElement>(null)
  const promptBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onHandleKeyDown = (e: KeyboardEvent) => {
      // Open prompt bar with keyboard shortcut (ctrl + l)
      if (e.ctrlKey && e.key === "l") {
        setShowPromptBar(true)
        if (sideBarVisibility) {
          setSideBarVisibility(false)
        }
      }
      // Close prompt bar with escape key
      if (e.key === "Escape") {
        setShowPromptBar(false)
      }
    }

    if (appState === "signed-in") {
      document.addEventListener("keydown", onHandleKeyDown)
    }

    return () => {
      if (appState === "signed-in") {
        document.removeEventListener("keydown", onHandleKeyDown)
      }
    }
  }, [showPromptBar, appState])

  // Close prompt bar when clicked outside
  useEffect(() => {
    const onHandleClickOutside = (event: MouseEvent) => {
      if (
        promptBarRef.current &&
        !promptBarRef.current.contains(event.target as Node)
      ) {
        setShowPromptBar((prev) => !prev)
        event.stopPropagation()
      }
    }

    if (appState === "signed-in") {
      document.addEventListener("mousedown", onHandleClickOutside)
    }
    return () => {
      if (appState === "signed-in") {
        document.removeEventListener("mousedown", onHandleClickOutside)
      }
    }
  }, [promptBarRef, appState])

  // Focus prompt bar when it is shown
  useEffect(() => {
    if (showPromptBar) {
      promptBarInputRef.current?.focus()
    }
  }, [showPromptBar])

  // Save prompt text to local
  useEffect(() => {
    onChangePromptBar(promptText)
  }, [promptText])

  // Load local prompt text to state
  useEffect(() => {
    if (localPromptText) {
      setPromptText(localPromptText)
    }
  }, [localPromptText])

  // Save prompt bar visibility state to local
  useEffect(() => {
    setPromptBarVisibility(showPromptBar)
  }, [showPromptBar])

  // Load local prompt bar visibility to state
  useEffect(() => {
    setShowPromptBar(promptBarVisibility)
  }, [promptBarVisibility])

  // Debounce saving prompt text to local
  const onChangePromptBar = useDebounce((value: string) => {
    setLocalPromptText(value)
  }, 1000)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (promptText) {
      // Clear local storage
      if (promptText.includes("clear")) {
        setArrStr([])
        setPromptText("")
        return
      } else {
        setArrStr([...arrStr, promptText])
        if (!sideBarVisibility) {
          setSideBarVisibility(true)
          setShowPromptBar(false)
          setPromptText("")
        }
      }
    }
  }

  return (
    <AnimatePresence>
      {showPromptBar ? (
        <motion.section
          initial={{ opacity: 0, y: 30, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 0, x: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          id="light-prompt-bar"
          ref={promptBarRef}
          className="w-[500px] h-fit fixed left-0 right-0 bg-black/70 backdrop-blur-md drop-shadow-md shadow-xl rounded-lg m-auto border-[1.5px] border-white/[0.13]">
          <PromptInput
            onSubmit={onSubmit}
            ref={promptBarInputRef}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />
          <section className="flex items-center justify-between w-full p-[15px] border-t-[1.5px] border-white/[0.13] bg-white/5 rounded-b-lg">
            <div className="h-fit w-fit opacity-30">
              <Logo variant="dark" width={30} />
            </div>
          </section>
        </motion.section>
      ) : null}
    </AnimatePresence>
  )
}

export default PromptBar

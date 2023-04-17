import cssText from "data-text:~/contents/style.css"
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

  const [promptText, setPromptText] = useState<string>("")
  const [showPromptBar, setShowPromptBar] = useState(false)

  const promptBarInputRef = useRef<HTMLInputElement>(null)
  const promptBarRef = useRef<HTMLDivElement>(null)

  // Trigger prompt bar with keyboard shortcut (ctrl + cmd + k)
  useEffect(() => {
    const onHandleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "l") {
        setShowPromptBar((prev) => !prev)
        if (sideBarVisibility) {
          setSideBarVisibility(false)
        }
      }
    }

    document.addEventListener("keydown", onHandleKeyDown)

    return () => {
      document.removeEventListener("keydown", onHandleKeyDown)
    }
  }, [])

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

    document.addEventListener("mousedown", onHandleClickOutside)
    return () => {
      document.removeEventListener("mousedown", onHandleClickOutside)
    }
  }, [promptBarRef])

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

  const onChangePromptBar = useDebounce((value: string) => {
    setLocalPromptText(value)
  }, 1000)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (promptText) {
      setLocalPromptText(promptText)
      if (!sideBarVisibility) {
        setSideBarVisibility(true)
        setShowPromptBar(false)
      }
    }
    setPromptText("")
  }

  return showPromptBar ? (
    <section
      id="light-prompt-bar"
      ref={promptBarRef}
      className="w-[500px] h-fit fixed left-0 right-0 bg-black/70 backdrop-blur-md drop-shadow-md shadow-xl rounded-lg border-white m-auto border-[1.5px] border-white/[0.13]">
      <form onSubmit={onSubmit}>
        <input
          ref={promptBarInputRef}
          type="text"
          value={promptText}
          placeholder="How may I help you?"
          className="p-[15px] w-full bg-transparent text-white outline-none placeholder:text-white/30"
          onChange={(e) => setPromptText(e.target.value)}
        />
      </form>
      <section className="flex items-center justify-between w-full p-[15px] border-t-[1.5px] border-white/[0.13] bg-white/5 rounded-b-lg">
        <div className="h-fit w-fit opacity-30">
          <Logo variant="dark" width={30} />
        </div>
      </section>
    </section>
  ) : null
}

export default PromptBar

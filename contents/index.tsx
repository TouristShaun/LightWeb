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

const Promptbar = () => {
  const [activePrompt, setActivePrompt] = useStorage(
    "light-active-prompt-text",
    (v) => (v === undefined ? "" : v)
  )
  const [show, setShow] = useState(true)

  const promptBarRef = useRef<HTMLInputElement>(null)
  const promptBarRef = useRef<HTMLDivElement>(null)

  // Trigger prompt bar with keyboard shortcut (ctrl + cmd + k)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey && e.ctrlKey) {
        setShow((prev) => !prev)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const onHandleClickOutside = (event: MouseEvent) => {
      if (
        promptBarRef.current &&
        !promptBarRef.current.contains(event.target as Node)
      ) {
        setShow((prev) => !prev)
      }
    }

    document.addEventListener("mousedown", onHandleClickOutside)
    return () => {
      document.removeEventListener("mousedown", onHandleClickOutside)
    }
  }, [promptBarRef])

  // Focus prompt bar when it is shown
  useEffect(() => {
    if (show) {
      promptBarRef.current?.focus()
    }
  }, [show])

  const onChangePromptBar = useDebounce((value: string) => {
    setActivePrompt(value)
  }, 1000)

  return show ? (
    <section
      ref={promptBarRef}
      className="w-[500px] h-fit fixed left-0 right-0 bg-black/70 backdrop-blur-md drop-shadow-md shadow-xl rounded-lg border-white m-auto border-[1.5px] border-white/[0.13]">
      <input
        ref={promptBarRef}
        type="text"
        value={activePrompt}
        placeholder="How can i help you?"
        className="p-[15px] w-full bg-transparent text-white outline-none placeholder:text-white/30"
        onChange={(e) => onChangePromptBar(e.target.value)}
      />
      <section className="flex items-center justify-between w-full p-[15px] border-t-[1.5px] border-white/[0.13]">
        <div className="h-fit w-fit opacity-30">
          <Logo variant="dark" width={30} />
        </div>
      </section>
    </section>
  ) : null
}

export default Promptbar

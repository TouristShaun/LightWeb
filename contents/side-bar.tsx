import cssText from "data-text:~/style.css"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronUp, Trash, X } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"
import { useDebounce } from "tiny-use-debounce"

import { useStorage } from "@plasmohq/storage/hook"

import Logo from "~components/Logo"
import PromptInput from "~components/PromptInput"

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

  const [arrStr, setArrStr] = useStorage("light-arr-str", (v) =>
    v === undefined ? [] : v
  )

  const [promptText, setPromptText] = useState<string>("")
  const [showSideBar, setShowSideBar] = useState<boolean>(false)
  const [isConversationOpen, setIsConversationOpen] = useState<boolean>(true)

  const sideBarRef = useRef<HTMLDivElement>(null)
  const promptBarInputRef = useRef<HTMLInputElement>(null)

  // Focus prompt bar when it is shown
  useEffect(() => {
    if (showSideBar || isConversationOpen) {
      promptBarInputRef.current?.focus()
    }
  }, [showSideBar])

  // Save prompt bar visibility state to local
  useEffect(() => {
    setSideBarVisibility(showSideBar)
  }, [showSideBar])

  // Load local prompt bar visibility to state
  useEffect(() => {
    if (sideBarVisibility) {
      setIsConversationOpen(sideBarVisibility)
    }
    setShowSideBar(sideBarVisibility)
  }, [sideBarVisibility])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (promptText) {
      setArrStr([...arrStr, promptText])
      setPromptText("")
      setIsConversationOpen(true)
    }
  }

  return (
    <AnimatePresence>
      {showSideBar ? (
        <motion.section
          ref={sideBarRef}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-[300px] max-h-[500px] text-white fixed right-[10px] top-[10px] bg-black/80 backdrop-blur-md drop-shadow-md shadow-xl rounded-lg border-white m-auto border-[1.5px] border-white/[0.13]">
          <section className="flex items-center justify-between w-full p-[15px] border-t-[1.5px] border-white/[0.13] bg-white/5 rounded-t-lg">
            <div className="h-fit w-fit opacity-30">
              <Logo variant="dark" width={50} />
            </div>
            <div className="flex items-center gap-[10px]">
              <button onClick={() => setIsConversationOpen((prev) => !prev)}>
                {isConversationOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              <button onClick={() => setShowSideBar(false)}>
                <X size={16} />
              </button>
            </div>
          </section>
          <AnimatePresence>
            {isConversationOpen && (
              <motion.section
                initial={{
                  height: 0,
                  opacity: 0,
                  overflowY: "hidden"
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  overflowY: "auto",
                  transition: {
                    overflowY: { delay: 0.3 }
                  }
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  overflowY: "hidden"
                }}
                className="flex flex-col bg-black/20">
                <div className="flex flex-col gap-[10px] p-[15px] mb-[15px] h-[375px]">
                  {arrStr.map((item, id) => (
                    <motion.p
                      initial={
                        isConversationOpen ? { opacity: 0, y: 30, x: 0 } : false
                      }
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      key={id}>
                      {item}
                    </motion.p>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
          <PromptInput
            onSubmit={onSubmit}
            ref={promptBarInputRef}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />
        </motion.section>
      ) : null}
    </AnimatePresence>
  )
}

export default SideBar

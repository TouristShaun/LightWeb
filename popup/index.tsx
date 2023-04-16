import Logo from "~components/Logo"

import "./style.css"

import { useEffect, useState } from "react"
import { useDebounce } from "tiny-use-debounce"

import { useStorage } from "@plasmohq/storage/hook"

function IndexPopup() {
  const [apiKey, setApiKey] = useState<string>("")

  const [localApiKey, setLocalApiKey] = useStorage("light-api-key", (v) =>
    v === undefined ? "" : v
  )

  useEffect(() => {
    if (apiKey) {
      onChangeAPIKey(apiKey)
    }
  }, [apiKey])

  useEffect(() => {
    if (localApiKey) {
      setApiKey(localApiKey)
    }
  }, [])

  const onChangeAPIKey = useDebounce((value: string) => {
    setLocalApiKey(value)
  }, 1000)

  return (
    <div className="flex flex-col p-[15px] gap-[20px] h-fit w-[400px] bg-black text-white border-[1px] border-white/10">
      <div className="flex items-center justify-between opacity-50">
        <Logo variant="dark" width={30} />
      </div>
      <div className="flex gap-[10px] w-full items-center">
        <p className="w-[50px] opacity-50">API</p>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full bg-black text-white border-[1px] border-white/10 h-[24px] outline-none rounded-md px-[5px]"
        />
      </div>
    </div>
  )
}

export default IndexPopup

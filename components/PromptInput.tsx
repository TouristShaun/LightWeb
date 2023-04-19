import React from "react"

interface PromptInputProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>
  ref: React.MutableRefObject<HTMLInputElement>
  value: string
  placeholder?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

const PromptInput = React.forwardRef<HTMLInputElement, PromptInputProps>(
  (props, ref) => {
    return (
      <form onSubmit={props.onSubmit}>
        <input
          ref={ref}
          type="text"
          value={props.value}
          placeholder={props.placeholder ?? "How may I help you?"}
          className="p-[15px] w-full bg-transparent text-white outline-none placeholder:text-white/30 border-t-[1.5px] border-white/[0.13]"
          onChange={props.onChange}
        />
      </form>
    )
  }
)

export default PromptInput

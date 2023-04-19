import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import type { SubmitHandler } from "react-hook-form"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useStorage } from "@plasmohq/storage/hook"

import { supabase } from "~libs/supabase"
import type { AppState, UserData } from "~type"

import LoadingDots from "./LoadingDots"

const signInValidationSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email"
  }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" })
})

type SignInValidationSchema = z.infer<typeof signInValidationSchema>

const SignIn = () => {
  const [userData, setUserData] = useStorage<UserData>("light-user", (v) =>
    v === undefined ? {} : v
  )

  const [appState, setAppState] = useStorage<AppState>(
    "light-app-state",
    (v) => v ?? "signed-out"
  )

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)

  const userSignedIn = userData?.user?.id

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInValidationSchema>({
    resolver: zodResolver(signInValidationSchema)
  })

  const onSignIn: SubmitHandler<SignInValidationSchema> = async (formData) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
      if (error) {
        console.log("Error with auth: " + error.message)
      }
      if (data) {
        setUserData(data)
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const onDoneSignIn = () => {
    setAppState("signed-in")
    window.close()
  }

  return (
    <>
      <AnimatePresence>
        <form
          className="flex flex-col w-[400px]"
          onSubmit={userSignedIn ? undefined : handleSubmit(onSignIn)}>
          {userSignedIn ? (
            <div className="flex flex-col gap-[10px] text-center mb-[40px]">
              <p className="text-center text-[18px] font-medium">
                Welcome to Light!
              </p>
              <p className="opacity-50 text-[16px]">
                Start using Light by press ⌃ + L combo in any URL pages after
                you close this window
              </p>
            </div>
          ) : (
            <>
              <div className="mb-[20px]">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="text"
                  className="bg-white/5 border border-white/10 text-white placeholder:text-white/50 text-sm rounded-lg focus:ring-purple-500 focus:purple-blue-500 block w-full p-2.5  "
                  placeholder="lio@lightapi.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="mb-[40px]">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-[12px]"
                    onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="bg-white/5 border border-white/10 text-white placeholder:text-white/50 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pr-10 p-2.5"
                    placeholder="Password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
          <button
            type={userSignedIn ? "button" : "submit"}
            onClick={() => (userSignedIn ? onDoneSignIn() : undefined)}
            className="w-full p-2.5 rounded-lg bg-white transition hover:bg-white/90 text-black font-medium">
            {userSignedIn ? (
              "Close This Window"
            ) : isLoading ? (
              <LoadingDots className="bg-black/50" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </AnimatePresence>
      {!userSignedIn && (
        <a
          href="https://beta.lightapi.com/sign-up"
          target="_blank"
          className="transition opacity-50 hover:opacity-100 -mt-[20px]">
          Create an Account
        </a>
      )}
    </>
  )
}

export default SignIn

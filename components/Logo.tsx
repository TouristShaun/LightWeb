import black_logo from "data-base64:~assets/black.svg"
import light_logo from "data-base64:~assets/light.svg"

interface LogoProps {
  variant: "dark" | "light"
  width?: number
  height?: number
}

const Logo = (props: LogoProps) => {
  const { variant, width = 50, height = 100 } = props
  return (
    <img
      src={variant === "light" ? black_logo : light_logo}
      alt="Light AI"
      width={width}
      height={height}
    />
  )
}

export default Logo

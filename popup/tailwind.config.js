// /** @type {import('tailwindcss').Config} */
import { colors } from "../colors.tailwind"

module.exports = {
  content: ["./popup/*.{ts,tsx}"], // your popup files
  theme: {
    extend: {
      colors
    }
  }
}

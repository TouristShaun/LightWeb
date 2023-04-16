// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./popup/*.{ts,tsx}"], // your popup files
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#191a23"
        },
        grey: "#85869a",
        dark: "#2c0e44",
        light: "#f5f3fa",
        black: "#171520",
        white: "#fbfaff"
      }
    }
  }
}

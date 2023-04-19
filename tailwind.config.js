// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./options/*.{ts,tsx}",
    "./contents/*.{ts,tsx}",
    "./popup/*.{ts,tsx}",
    "./components/*.{ts,tsx}"
  ], // your content-script files
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

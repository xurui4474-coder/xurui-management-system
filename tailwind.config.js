/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F2E8",
        paper: "#FFFDF8",
        line: "#E7E1D5",
        ink: "#242424",
        muted: "#6B7280",
        sage: "#8FA58E",
        steel: "#60758A",
        clay: "#B8755F",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(36, 36, 36, 0.06)",
      },
    },
  },
  plugins: [],
};

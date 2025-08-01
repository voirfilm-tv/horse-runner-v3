
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  safelist: [
    "aspect-square",
    "grid-cols-15",
    "grid-rows-15",
    "max-w-[600px]",
    "ring-lime-500",
    "bg-green-700",
    "bg-emerald-200",
    "bg-lime-50",
    "rounded-2xl",
    "shadow-2xl",
    "border-green-800",
    "border-green-800/20",
    "text-green-700",
    "text-sm",
    "font-bold"
  ],
  plugins: [],
}

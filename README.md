npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# "./src/**/*.{js,jsx,ts,tsx}", // Thêm các đường dẫn tương ứng với các file mà bạn sử dụng Tailwind
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Thêm các đường dẫn tương ứng với các file mà bạn sử dụng Tailwind
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
# Bo vao file index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
# cai tailwind css intelisense

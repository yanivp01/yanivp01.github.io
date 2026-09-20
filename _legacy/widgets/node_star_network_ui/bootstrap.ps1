mkdir webapp
cd webapp
npx -y create-vite@latest . --template react
npm install
npm install -D tailwindcss postcss autoprefixer
npx -y tailwindcss init -p

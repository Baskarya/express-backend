# Gunakan image Node.js versi terbaru sebagai base image
FROM node:latest

# Set kerja direktori di dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json (jika ada) ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin kode aplikasi ke dalam container
COPY . .

# Expose port yang digunakan oleh aplikasi
EXPOSE 8080

# Perintah untuk menjalankan aplikasi saat container dijalankan
CMD ["node", "app.js"]
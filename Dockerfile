    # Gunakan image Bun sebagai base
    FROM oven/bun:latest

    # Set working directory
    WORKDIR /app

    # Salin file package.json dan bun.lockb
    COPY package.json bun.lockb ./

    # Install dependencies
    RUN bun install

    # Salin semua file ke container
    COPY . .

    # Expose port yang digunakan aplikasi
    EXPOSE 3000

    # Jalankan aplikasi
    CMD ["bun", "run", "src/index.ts"]
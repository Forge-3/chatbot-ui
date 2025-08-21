FROM node:18-alpine

WORKDIR /app

# Instalacja niezbędnych pakietów
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    build-base

# Ustawienie zmiennych środowiskowych
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1
ENV HUSKY=0

# Kopiowanie plików package.json i package-lock.json
COPY package*.json ./

# Instalacja wszystkich zależności (bez husky)
RUN npm install --ignore-scripts

# Kopiowanie reszty plików aplikacji
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

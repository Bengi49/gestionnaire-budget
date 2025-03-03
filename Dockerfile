# Stage de build
FROM node:20.11.1-alpine3.19 AS builder

WORKDIR /build
COPY package*.json ./
COPY vite.config.js ./

# Installation des dépendances de build
RUN npm install

# Copie des sources
COPY . .

# Construction
RUN npm run build

# Stage de production
FROM node:20.11.1-alpine3.19

WORKDIR /app

# Copie des fichiers de production
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/vite.config.js ./

# Installation des dépendances de production
RUN npm install --production

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host"]

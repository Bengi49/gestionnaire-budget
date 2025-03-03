# Image de base Node.js avec une version spécifique
FROM node:20.11.1-alpine3.19

# Définition des variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app

# Mise à jour de npm et installation des dépendances
COPY package*.json ./
COPY vite.config.js ./
RUN npm install -g npm@latest && \
    npm install --production --no-optional && \
    npm audit fix && \
    npm install -g vite

# Copie des sources
COPY . .

# Construction
RUN npm run build

# Exposition du port
EXPOSE 3000

# Démarrage
CMD ["npm", "run", "preview", "--", "--host"]

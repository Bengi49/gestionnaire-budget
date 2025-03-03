# Image de base Node.js avec une version spécifique
FROM node:20.11.1-alpine3.19

# Définition des variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Création et définition du répertoire de travail
WORKDIR /usr/src/app

# Copie des fichiers de configuration
COPY package*.json ./
COPY vite.config.js ./

# Installation des dépendances
RUN npm install --omit=dev

# Copie des sources
COPY src/ ./src/
COPY public/ ./public/

# Construction
RUN npm run build

# Exposition du port
EXPOSE 3000

# Démarrage
CMD ["npm", "start"]

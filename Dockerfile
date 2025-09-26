FROM node:20-alpine as development

WORKDIR /app

# Copiar package files
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 8080

# Comando para desenvolvimento (hot-reload)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
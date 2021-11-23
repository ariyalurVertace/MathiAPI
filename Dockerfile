# Install dependencies
FROM node:14.11.0-slim AS builder
#install toolchain required for native packages
RUN apt update
RUN apt install build-essential make gcc g++ automake autoconf python -y

# Install dependencies
FROM builder AS install
# Install libvps needed for sharp npm
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Lint
FROM node:14.11.0-slim AS lint
WORKDIR /app
COPY --from=install /app/node_modules/ ./node_modules
COPY --from=install /app/package*.json ./
COPY .eslintrc.json .gitignore .prettierrc .eslintignore ./
COPY prisma/ ./prisma
COPY generator/ ./generator
COPY src/ ./src
RUN npm run lint

# Prune non prod dependencies
FROM lint AS build

RUN npm prune --production

# Create final single layer image
FROM install as run 
COPY --from=build /app/ ./
COPY .env .
RUN npx prisma generate
CMD [ "node", "./src/server.js" ]
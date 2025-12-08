FROM node:18-alpine

WORKDIR /app


COPY package*.json ./


RUN npm install --omit=dev --legacy-peer-deps

COPY .next ./.next
COPY public ./public
COPY next.config.ts ./
COPY tsconfig.json ./

EXPOSE 3000

CMD ["npm", "start"]
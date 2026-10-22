FROM node:22-bookworm-slim

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --ignore-scripts && npm rebuild sharp
COPY src ./src

ENV NODE_ENV=production
CMD ["npm", "start"]

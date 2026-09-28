# --- Build the Angular client ---
FROM node:22-alpine AS client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npx ng build

# --- Build the Node/Socket.IO server ---
FROM node:22-alpine AS server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build && npm prune --omit=dev

# --- Runtime image: one process serves the SPA + WebSockets ---
FROM node:22-alpine
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --from=server /app/server/package.json ./
COPY --from=server /app/server/node_modules ./node_modules
COPY --from=server /app/server/dist ./dist
COPY --from=client /app/client/dist/client/browser ./public
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]

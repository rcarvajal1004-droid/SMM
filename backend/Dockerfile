# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
# msnodesqlv8 es opcional: en Linux se omite y se usa el driver tedious (puro JS)
RUN npm install --omit=dev

# ---- Runtime stage ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install mssql-tools for migrations
RUN apk add --no-cache curl gnupg && \
    curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg && \
    echo "https://packages.microsoft.com/config/alpine/3.20/prod" | tee /etc/apk/repositories.d/microsoft.list && \
    apk add --no-cache --repository=https://packages.microsoft.com/config/alpine/3.20/prod mssql-tools18 unixodbc && \
    ln -sf /opt/mssql-tools18/bin/sqlcmd /usr/local/bin/sqlcmd

COPY --from=build /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./
COPY database/migrations ./migrations
COPY scripts/run-migrations.sh /usr/local/bin/run-migrations.sh
RUN chmod +x /usr/local/bin/run-migrations.sh

EXPOSE 3000

# Run migrations then start server
CMD ["/bin/sh", "-c", "run-migrations.sh && node src/index.js"]
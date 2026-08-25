#!/bin/bash
set -e

echo "Waiting for SQL Server to be ready..."
until /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "SELECT 1" &> /dev/null; do
  sleep 2
done

echo "SQL Server is ready. Running migrations..."

for f in /docker-entrypoint-initdb.d/*.sql; do
  if [ -f "$f" ]; then
    echo "Running migration: $f"
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -i "$f"
  fi
done

echo "Migrations completed."
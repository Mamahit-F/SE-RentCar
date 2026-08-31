@echo off
set "PG_BIN=D:\pgsql\pgsql\bin"
set "PG_DATA=D:\pgsql\pgsql\data"
set PGPASSWORD=postgres

if not exist "%PG_DATA%\PG_VERSION" (
    echo [1/3] Initializing PostgreSQL cluster...
    "%PG_BIN%\initdb.exe" -D "%PG_DATA%" -U postgres -A trust -E UTF8
)

echo [2/3] Starting PostgreSQL server on port 5432...
"%PG_BIN%\pg_ctl.exe" start -D "%PG_DATA%" -l "%PG_DATA%\server.log"
timeout /t 3 >nul

echo [3/3] Creating rental_partnership database...
"%PG_BIN%\psql.exe" -U postgres -c "CREATE DATABASE rental_partnership ENCODING 'UTF8';"
"%PG_BIN%\psql.exe" -U postgres -c "\l"
echo ==========================================
echo PostgreSQL IS ONLINE AND READY!
echo ==========================================

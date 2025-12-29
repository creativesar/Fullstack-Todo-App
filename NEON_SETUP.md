# Neon PostgreSQL Setup Guide

## Step 1: Create Neon Account
1. Go to https://neon.tech
2. Sign up with email or GitHub
3. Verify your email

## Step 2: Create Project
1. Click "New Project"
2. Project name: `hackathon-todo`
3. Region: Select closest to your location
4. PostgreSQL version: 16 (latest)
5. Click "Create Project"

## Step 3: Create Database
1. In the project dashboard, note the default database name (usually `neondb`)
2. Or create a new database: `todo_db`

## Step 4: Get Connection String
1. In Neon dashboard, click "Connection Details"
2. Copy the connection string (starts with `postgresql://`)
3. Example format:
   ```
   postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

## Step 5: Run Schema Creation
1. In Neon dashboard, click "SQL Editor"
2. Copy and paste the contents of `backend/schema.sql`
3. Click "Run" to execute the SQL
4. Verify tables created:
   - `users` table (2-4 columns)
   - `tasks` table (7 columns)
   - 2 indexes on tasks table

## Step 6: Test Connection
1. Copy your connection string
2. Add to `backend/.env` (see T005 for details)
3. Test connection:
   ```bash
   cd backend
   python -c "import asyncpg; import asyncio; asyncio.run(asyncpg.connect('your-connection-string'))"
   ```

## Connection String Format
```
DATABASE_URL=postgresql://username:password@host/dbname?sslmode=require
```

**Important:**
- Keep connection string secret (never commit to Git)
- Use the same connection string in backend/.env
- Neon free tier includes 512MB storage and 0.25 compute units
- Connection pooling is built-in (serverless)

## Troubleshooting

### Connection Refused
- Check if IP allowlist is enabled in Neon (should be disabled for development)
- Verify connection string is correct
- Ensure `?sslmode=require` is in the connection string

### Table Creation Failed
- Verify SQL syntax
- Check if tables already exist
- Ensure you're connected to the correct database

### SQLModel Connection Issues
- Connection string must use `postgresql+asyncpg://` prefix in code
- The db.py module handles this conversion automatically

## Next Steps
After database setup is complete:
1. Save connection string to backend/.env
2. Mark T004 as complete in tasks.md
3. Proceed to T005: Configure Environment Variables

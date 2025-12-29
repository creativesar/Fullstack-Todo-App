"""
Database Setup Script
Executes schema.sql on Neon PostgreSQL
"""
import asyncio
import asyncpg
import sys


async def setup_database(connection_string: str):
    """Execute schema.sql on the database"""
    # Read schema file
    with open('schema.sql', 'r') as f:
        schema_sql = f.read()

    # Connect to database
    print(f"Connecting to database...")
    conn = await asyncpg.connect(connection_string)

    try:
        # Execute schema
        print("Executing schema...")
        await conn.execute(schema_sql)
        print("[SUCCESS] Schema executed successfully!")

        # Verify tables created
        tables = await conn.fetch(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
        )
        print("\n[SUCCESS] Tables created:")
        for row in tables:
            print(f"  - {row['table_name']}")

        # Verify indexes
        indexes = await conn.fetch(
            "SELECT indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY indexname"
        )
        print("\n[SUCCESS] Indexes created:")
        for row in indexes:
            print(f"  - {row['indexname']}")

    except Exception as e:
        print(f"[ERROR] {e}")
        sys.exit(1)
    finally:
        await conn.close()
        print("\n[SUCCESS] Connection closed")


if __name__ == "__main__":
    connection_string = "postgresql://neondb_owner:npg_bnUiEAxH23Sm@ep-cold-mountain-ahrkqbkl-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
    asyncio.run(setup_database(connection_string))

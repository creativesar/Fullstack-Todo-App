"""
Database Verification Script
Checks if schema is correctly set up
"""
import asyncio
import asyncpg


async def verify_database(connection_string: str):
    """Verify database schema"""
    print("Connecting to database...")
    conn = await asyncpg.connect(connection_string)

    try:
        # Check tables
        tables = await conn.fetch(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
        )
        print("\n[TABLES]")
        for row in tables:
            print(f"  - {row['table_name']}")

        # Check indexes
        indexes = await conn.fetch(
            "SELECT indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY indexname"
        )
        print("\n[INDEXES]")
        for row in indexes:
            print(f"  - {row['indexname']}")

        # Check tasks table schema
        columns = await conn.fetch(
            """
            SELECT column_name, data_type, is_nullable, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'tasks'
            ORDER BY ordinal_position
            """
        )
        print("\n[TASKS TABLE SCHEMA]")
        for row in columns:
            nullable = "NULL" if row['is_nullable'] == 'YES' else "NOT NULL"
            max_len = f" ({row['character_maximum_length']})" if row['character_maximum_length'] else ""
            print(f"  - {row['column_name']}: {row['data_type']}{max_len} {nullable}")

        print("\n[SUCCESS] Database schema verified!")

    except Exception as e:
        print(f"\n[ERROR] {e}")
    finally:
        await conn.close()


if __name__ == "__main__":
    connection_string = "postgresql://neondb_owner:npg_bnUiEAxH23Sm@ep-cold-mountain-ahrkqbkl-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
    asyncio.run(verify_database(connection_string))

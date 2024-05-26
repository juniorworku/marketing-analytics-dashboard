import psycopg2
from psycopg2 import sql
import pandas as pd

# Database connection parameters
local_db_params = {
    "dbname": "local_db",
    "user": "local_user",
    "password": "local_password",
    "host": "localhost",
    "port": "5432"
}

remote_db_params = {
    "dbname": "new_database",
    "user": "new_username",
    "password": "new_password",
    "host": "localhost",
    "port": "5432"
}

# Connect to local database
local_conn = psycopg2.connect(**local_db_params)
local_cursor = local_conn.cursor()

# Connect to remote database
remote_conn = psycopg2.connect(**remote_db_params)
remote_cursor = remote_conn.cursor()

# Fetch table names
local_cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
tables = local_cursor.fetchall()

for table in tables:
    table_name = table[0]

    # Fetch data from local table
    local_cursor.execute(sql.SQL("SELECT * FROM {}").format(sql.Identifier(table_name)))
    data = local_cursor.fetchall()

    # Fetch column names
    col_names = [desc[0] for desc in local_cursor.description]

    # Create table in remote database
    remote_cursor.execute(sql.SQL("DROP TABLE IF EXISTS {}").format(sql.Identifier(table_name)))
    create_table_query = sql.SQL("CREATE TABLE {} ({})").format(
        sql.Identifier(table_name),
        sql.SQL(', ').join(sql.Identifier(col) for col in col_names)
    )
    remote_cursor.execute(create_table_query)

    # Insert data into remote table
    insert_query = sql.SQL("INSERT INTO {} ({}) VALUES ({})").format(
        sql.Identifier(table_name),
        sql.SQL(', ').join(sql.Identifier(col) for col in col_names),
        sql.SQL(', ').join(sql.Placeholder() * len(col_names))
    )
    remote_cursor.executemany(insert_query, data)

    # Commit changes to remote database
    remote_conn.commit()

# Close connections
local_cursor.close()
local_conn.close()
remote_cursor.close()
remote_conn.close()

print("Database migration completed successfully.")

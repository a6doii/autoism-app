"""
Migrates the local SQLite database to Railway PostgreSQL.
Run once: python migrate_to_postgres.py
"""
import os
import sys
import sqlite3
import psycopg2
from psycopg2 import sql

SQLITE_PATH = os.path.join(os.path.dirname(__file__), 'Autism', 'database.db')
PG_URL = os.environ.get('DATABASE_URL', '')

if not PG_URL:
    print("ERROR: Set DATABASE_URL environment variable first.")
    sys.exit(1)

if PG_URL.startswith('postgres://'):
    PG_URL = PG_URL.replace('postgres://', 'postgresql://', 1)

print(f"Connecting to PostgreSQL...")
pg = psycopg2.connect(PG_URL)
pg.autocommit = False
cur = pg.cursor()

print("Creating tables...")
cur.execute("""
CREATE TABLE IF NOT EXISTS "user" (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    firstname   VARCHAR(100),
    lastname    VARCHAR(100),
    dob         VARCHAR(20),
    sex         VARCHAR(20),
    is_admin    BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP,
    profile_image VARCHAR(255)
);
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS "case" (
    id                  SERIAL PRIMARY KEY,
    child_name          VARCHAR(150),
    child_dob           VARCHAR(20),
    brief               TEXT,
    created_at          TIMESTAMP,
    last_result_summary VARCHAR(255),
    owner_id            INTEGER REFERENCES "user"(id) ON DELETE CASCADE
);
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS test_result (
    id               SERIAL PRIMARY KEY,
    case_id          INTEGER REFERENCES "case"(id) ON DELETE CASCADE,
    created_at       TIMESTAMP,
    spark_score      INTEGER,
    image_score      FLOAT,
    combined_risk    FLOAT,
    prediction_label VARCHAR(100),
    notes            TEXT,
    answers_json     TEXT,
    report_text      TEXT
);
""")

cur.execute("""
CREATE TABLE IF NOT EXISTS game_score (
    id         SERIAL PRIMARY KEY,
    case_id    INTEGER REFERENCES "case"(id) ON DELETE CASCADE,
    game       VARCHAR(50),
    level      VARCHAR(50),
    score      INTEGER,
    max_score  INTEGER,
    updated_at TIMESTAMP
);
""")
pg.commit()
print("Tables created.")

# ── Copy data from SQLite ──────────────────────────────────────────────────────
sq = sqlite3.connect(SQLITE_PATH)
sq.row_factory = sqlite3.Row

BOOL_COLS = {'is_admin'}

def coerce(col, val):
    if col in BOOL_COLS:
        return bool(val) if val is not None else False
    return val

def migrate_table(table, columns):
    rows = sq.execute(f'SELECT * FROM "{table}"').fetchall()
    if not rows:
        print(f"  {table}: no rows")
        return
    col_str = ', '.join(f'"{c}"' for c in columns)
    placeholders = ', '.join('%s' for _ in columns)
    query = f'INSERT INTO "{table}" ({col_str}) VALUES ({placeholders}) ON CONFLICT DO NOTHING'
    count = 0
    for row in rows:
        vals = tuple(coerce(c, row[c]) for c in columns)
        cur.execute(query, vals)
        count += 1
    print(f"  {table}: {count} rows imported")

print("\nCopying data...")
migrate_table('user', ['id','email','password','firstname','lastname','dob','sex','is_admin','created_at','profile_image'])
migrate_table('case', ['id','child_name','child_dob','brief','created_at','last_result_summary','owner_id'])
migrate_table('test_result', ['id','case_id','created_at','spark_score','image_score','combined_risk','prediction_label','notes','answers_json','report_text'])
migrate_table('game_score', ['id','case_id','game','level','score','max_score','updated_at'])
pg.commit()

# ── Reset sequences so new inserts don't collide with imported IDs ──────────
print("\nResetting sequences...")
for table in ['user', 'case', 'test_result', 'game_score']:
    cur.execute(f"""
        SELECT setval(
            pg_get_serial_sequence('"{table}"', 'id'),
            COALESCE((SELECT MAX(id) FROM "{table}"), 0) + 1,
            false
        )
    """)
pg.commit()
print("Sequences reset.")

sq.close()
cur.close()
pg.close()
print("\nMigration complete. PostgreSQL is ready.")

"""
Exports the current SQLite database to a postgres-compatible seed SQL file.
Run locally: python export_sqlite.py
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'Autism', 'database.db')
OUT_PATH = os.path.join(os.path.dirname(__file__), 'seed_data.sql')

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row

def escape(val):
    if val is None:
        return 'NULL'
    if isinstance(val, (int, float)):
        return str(val)
    return "'" + str(val).replace("'", "''") + "'"

with open(OUT_PATH, 'w', encoding='utf-8') as f:
    f.write('-- Auto-Ism seed data exported from SQLite\n\n')
    for table in ['user', 'case', 'test_result', 'game_score']:
        try:
            rows = conn.execute(f'SELECT * FROM "{table}"').fetchall()
        except Exception:
            continue
        if not rows:
            f.write(f'-- Table {table}: no rows\n\n')
            continue
        cols = rows[0].keys()
        col_list = ', '.join(f'"{c}"' for c in cols)
        f.write(f'-- {table} ({len(rows)} rows)\n')
        for row in rows:
            vals = ', '.join(escape(row[c]) for c in cols)
            f.write(f'INSERT INTO "{table}" ({col_list}) VALUES ({vals});\n')
        f.write('\n')

conn.close()
print(f"Exported to {OUT_PATH}")

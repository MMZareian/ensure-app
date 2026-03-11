"""
Rebuild database with authentication and company management

New structure:
- Companies (multiple companies)
- Managers (users who can log in, linked to companies)
- Projects (linked to companies)
- Scenarios (linked to projects)
- Workers (linked to scenarios)
- Hazard responses (worker performance data)
"""

import sqlite3
import shutil
from pathlib import Path
from datetime import datetime

# Paths
ORIGINAL_DB = Path(__file__).parent.parent.parent / "ensure_mock_dataset_pack" / "sqlite" / "ensure_mock.sqlite"
NEW_DB = Path(__file__).parent / "ensure_mock.sqlite"

# Backup old database
if NEW_DB.exists():
    backup_path = NEW_DB.parent / f"ensure_mock_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sqlite"
    shutil.copy(NEW_DB, backup_path)
    print(f"[OK] Backed up existing database to {backup_path.name}")

# Copy original database
shutil.copy(ORIGINAL_DB, NEW_DB)
print(f"[OK] Copied original database from {ORIGINAL_DB}")

# Connect to database
conn = sqlite3.connect(NEW_DB)
cursor = conn.cursor()

print("\nCreating new tables...")

# 1. Create companies table
cursor.execute("""
CREATE TABLE IF NOT EXISTS companies (
    company_id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    industry TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
""")

# 2. Create managers table (for authentication)
cursor.execute("""
CREATE TABLE IF NOT EXISTS managers (
    manager_id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'manager',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_login TEXT,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
)
""")

# 3. Add company_id to projects table
cursor.execute("PRAGMA table_info(projects)")
columns = [col[1] for col in cursor.fetchall()]

if 'company_id' not in columns:
    cursor.execute("""
    ALTER TABLE projects ADD COLUMN company_id TEXT
    """)
    print("[OK] Added company_id to projects table")

print("\nInserting company data...")

# Insert companies
companies = [
    ('c1', 'Apex Construction Ltd', 'Construction'),
    ('c2', 'TechBuild Solutions', 'Construction'),
    ('c3', 'SafeWorks Industrial', 'Manufacturing'),
]

cursor.executemany("""
INSERT OR REPLACE INTO companies (company_id, company_name, industry)
VALUES (?, ?, ?)
""", companies)

print(f"[OK] Inserted {len(companies)} companies")

print("\nCreating manager accounts...")

# Insert managers with simple passwords (in production, these should be hashed!)
# Password format: plaintext for now (will add hashing in backend)
managers = [
    # Company 1: Apex Construction Ltd
    ('m1', 'c1', 'sarah.johnson', 'password123', 'Sarah Johnson', 'sarah.j@apexconstruction.com', 'admin'),
    ('m2', 'c1', 'mike.chen', 'password123', 'Mike Chen', 'mike.c@apexconstruction.com', 'manager'),

    # Company 2: TechBuild Solutions
    ('m3', 'c2', 'emma.davis', 'password123', 'Emma Davis', 'emma.d@techbuild.com', 'admin'),
    ('m4', 'c2', 'james.wilson', 'password123', 'James Wilson', 'james.w@techbuild.com', 'manager'),

    # Company 3: SafeWorks Industrial
    ('m5', 'c3', 'lisa.martinez', 'password123', 'Lisa Martinez', 'lisa.m@safeworks.com', 'admin'),
]

cursor.executemany("""
INSERT OR REPLACE INTO managers (manager_id, company_id, username, password, full_name, email, role)
VALUES (?, ?, ?, ?, ?, ?, ?)
""", managers)

print(f"[OK] Inserted {len(managers)} manager accounts")

print("\nLinking projects to companies...")

# Link existing projects to companies
project_company_mapping = {
    'p1': 'c1',  # Project A → Apex Construction
    'p2': 'c1',  # Project B → Apex Construction
    'p3': 'c2',  # Project C → TechBuild Solutions
    'p4': 'c2',  # Project D → TechBuild Solutions
    'p5': 'c3',  # Project E → SafeWorks Industrial
}

for project_id, company_id in project_company_mapping.items():
    cursor.execute("""
    UPDATE projects SET company_id = ? WHERE id = ?
    """, (company_id, project_id))

print(f"[OK] Linked {len(project_company_mapping)} projects to companies")

# Commit changes
conn.commit()

print("\nDatabase Summary:")
print("=" * 50)

# Count companies
cursor.execute("SELECT COUNT(*) FROM companies")
print(f"Companies: {cursor.fetchone()[0]}")

# Count managers
cursor.execute("SELECT COUNT(*) FROM managers")
print(f"Managers: {cursor.fetchone()[0]}")

# Count projects
cursor.execute("SELECT COUNT(*) FROM projects")
print(f"Projects: {cursor.fetchone()[0]}")

# Show company-project breakdown
cursor.execute("""
SELECT
    c.company_name,
    COUNT(p.id) as project_count
FROM companies c
LEFT JOIN projects p ON p.company_id = c.company_id
GROUP BY c.company_id, c.company_name
""")

print("\nProjects per Company:")
for row in cursor.fetchall():
    print(f"  - {row[0]}: {row[1]} projects")

print("\nManager Login Credentials (for testing):")
print("=" * 50)
cursor.execute("""
SELECT
    m.username,
    m.password,
    m.full_name,
    c.company_name,
    m.role
FROM managers m
JOIN companies c ON c.company_id = m.company_id
ORDER BY c.company_name, m.username
""")

print(f"{'Username':<20} {'Password':<15} {'Name':<20} {'Company':<25} {'Role':<10}")
print("-" * 95)
for row in cursor.fetchall():
    print(f"{row[0]:<20} {row[1]:<15} {row[2]:<20} {row[3]:<25} {row[4]:<10}")

conn.close()

print("\n[OK] Database rebuilt successfully!")
print(f"Location: {NEW_DB}")
print("\nNext steps:")
print("1. Update backend to add authentication endpoints")
print("2. Create login page in frontend")
print("3. Filter scenarios by company for logged-in manager")

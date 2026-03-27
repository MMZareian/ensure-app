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
import random
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
    company_id TEXT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'manager',
    title TEXT,
    app_access TEXT DEFAULT '["1"]',
    subscription_tier TEXT DEFAULT 'free',
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
    ('c4', 'University of Calgary', 'Education'),
]

cursor.executemany("""
INSERT OR REPLACE INTO companies (company_id, company_name, industry)
VALUES (?, ?, ?)
""", companies)

print(f"[OK] Inserted {len(companies)} companies")

print("\nCreating manager accounts...")

# Insert managers with simple passwords (in production, these should be hashed!)
# Password format: plaintext for now (will add hashing in backend)
# Format: (manager_id, company_id, username, password, full_name, email, role, title, app_access, subscription_tier)
managers = [
    # Company 1: Apex Construction Ltd
    ('m1', 'c1', 'sarah.johnson', 'password123', 'Sarah Johnson', 'sarah.j@apexconstruction.com', 'admin', 'Safety Manager', '["1"]', 'free'),
    ('m2', 'c1', 'mike.chen', 'password123', 'Mike Chen', 'mike.c@apexconstruction.com', 'manager', 'Project Coordinator', '["1"]', 'free'),

    # Company 2: TechBuild Solutions
    ('m3', 'c2', 'emma.davis', 'password123', 'Emma Davis', 'emma.d@techbuild.com', 'admin', 'Safety Director', '["1"]', 'free'),
    ('m4', 'c2', 'james.wilson', 'password123', 'James Wilson', 'james.w@techbuild.com', 'manager', 'Safety Coordinator', '["1"]', 'free'),

    # Company 3: SafeWorks Industrial
    ('m5', 'c3', 'lisa.martinez', 'password123', 'Lisa Martinez', 'lisa.m@safeworks.com', 'admin', 'HSE Manager', '["1"]', 'free'),

    # Company 4: University of Calgary - Premium Manager
    ('m6', 'c4', 'Estacio.Pereira', 'UCalgary', 'Estacio Pereira', 'estacio.pereira@ucalgary.ca', 'admin', 'University Project Supervisor', '["1"]', 'premium'),

    # System Admin (No company, full access to all applications) - Premium
    ('m0', None, 'Mahdi.Zareian', 'UCalgary', 'Mahdi Zareian', 'mahdi.zareian@system.admin', 'super_admin', 'System Administrator', '["1","2","3","4","5","6"]', 'premium'),
]

cursor.executemany("""
INSERT OR REPLACE INTO managers (manager_id, company_id, username, password, full_name, email, role, title, app_access, subscription_tier)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    'p6': 'c4',  # University Project → University of Calgary
}

for project_id, company_id in project_company_mapping.items():
    cursor.execute("""
    UPDATE projects SET company_id = ? WHERE id = ?
    """, (company_id, project_id))

print(f"[OK] Linked {len(project_company_mapping)} projects to companies")

print("\nGenerating unique worker IDs for existing projects (p1-p5)...")

# Create pool of unique worker IDs (100 total unique workers for construction/industrial projects)
# Format: WRK_XXXXXX (6-digit random number)
worker_id_pool = []
worker_skills = {}  # Track skill level for each worker
used_worker_ids = set()

for i in range(100):
    while True:
        worker_id = f"WRK_{random.randint(100000, 999999)}"
        if worker_id not in used_worker_ids:
            used_worker_ids.add(worker_id)
            worker_id_pool.append(worker_id)
            # Assign consistent skill level for this worker (0.5 to 0.95)
            worker_skills[worker_id] = 0.5 + (random.random() * 0.45)
            break

# Get all scenarios for projects p1-p5
cursor.execute("""
SELECT scenario_id, project_id FROM scenarios
WHERE project_id IN ('p1', 'p2', 'p3', 'p4', 'p5')
ORDER BY project_id, scenario_id
""")
existing_scenarios = cursor.fetchall()

# Delete old workers and hazard responses for p1-p5 (we'll regenerate with unique IDs)
cursor.execute("DELETE FROM workers WHERE project_id IN ('p1', 'p2', 'p3', 'p4', 'p5')")
cursor.execute("DELETE FROM hazard_responses WHERE project_id IN ('p1', 'p2', 'p3', 'p4', 'p5')")
print(f"[OK] Cleared old worker data for projects p1-p5")

# Track which workers have been used (for cross-scenario tracking)
used_workers_by_project = {}  # project_id -> list of worker_ids

# Generate workers for each scenario
total_worker_assignments = 0
for scenario_id, project_id in existing_scenarios:
    # Determine worker count for this scenario (10-20 workers per scenario)
    worker_count = random.randint(10, 20)

    # Initialize project tracking if needed
    if project_id not in used_workers_by_project:
        used_workers_by_project[project_id] = []

    selected_workers = []

    # Reuse 30-50% of workers from previous scenarios in same project
    if len(used_workers_by_project[project_id]) > 0:
        reuse_count = random.randint(int(worker_count * 0.3), int(worker_count * 0.5))
        reuse_count = min(reuse_count, len(used_workers_by_project[project_id]))
        selected_workers.extend(random.sample(used_workers_by_project[project_id], reuse_count))

    # Fill remaining slots with new workers from pool
    remaining_count = worker_count - len(selected_workers)
    available_workers = [wid for wid in worker_id_pool if wid not in selected_workers]
    selected_workers.extend(random.sample(available_workers, min(remaining_count, len(available_workers))))

    # Track these workers for the project
    for worker_id in selected_workers:
        if worker_id not in used_workers_by_project[project_id]:
            used_workers_by_project[project_id].append(worker_id)

    # Shuffle to randomize order
    random.shuffle(selected_workers)

    # Generate workers and hazard responses
    for worker_id in selected_workers:
        total_worker_assignments += 1

        # Insert worker
        cursor.execute("""
        INSERT OR REPLACE INTO workers (worker_id, project_id, worker_name, role, experience_band)
        VALUES (?, ?, ?, ?, ?)
        """, (worker_id, project_id, worker_id, 'Worker', random.choice(['Beginner', 'Intermediate', 'Advanced'])))

        # Get all energy types
        cursor.execute("SELECT id FROM energy_types ORDER BY id")
        energy_type_ids = [row[0] for row in cursor.fetchall()]

        # Use consistent skill level for this worker
        worker_skill = worker_skills[worker_id]

        # Check if worker has worked on other scenarios (skill improvement)
        cursor.execute("""
        SELECT COUNT(DISTINCT scenario_id) FROM hazard_responses
        WHERE worker_id = ? AND project_id = ?
        """, (worker_id, project_id))

        previous_scenarios = cursor.fetchone()[0]
        skill_improvement = min(previous_scenarios * 0.03, 0.12)  # Max 12% improvement
        adjusted_skill = min(worker_skill + skill_improvement, 0.98)

        # Generate hazard responses
        for energy_id in energy_type_ids:
            # Randomize responses based on worker skill level
            identified = random.random() < (0.5 + adjusted_skill * 0.5)  # 50-98% identification

            if identified:
                # If identified, check high energy classification
                marked_high = random.random() < (0.5 + adjusted_skill * 0.5)
                correct_high = random.random() < (0.5 + adjusted_skill * 0.5)

                # Check direct control classification
                marked_control = random.random() < (0.5 + adjusted_skill * 0.5)
                correct_control = random.random() < (0.5 + adjusted_skill * 0.5)
            else:
                # Not identified - no classifications
                marked_high = False
                correct_high = False
                marked_control = False
                correct_control = False

            cursor.execute("""
            INSERT OR REPLACE INTO hazard_responses
            (scenario_id, project_id, worker_id, worker_name, energy_id, identified_correctly,
             marked_high_energy, correct_high_energy, marked_direct_control, correct_direct_control)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                scenario_id,
                project_id,
                worker_id,
                worker_id,  # Use worker_id as display name
                energy_id,
                1 if identified else 0,
                1 if marked_high else 0,
                1 if correct_high else 0,
                1 if marked_control else 0,
                1 if correct_control else 0
            ))

# Count unique workers
cursor.execute("""
SELECT COUNT(DISTINCT worker_id) FROM workers
WHERE project_id IN ('p1', 'p2', 'p3', 'p4', 'p5') AND worker_id LIKE 'WRK_%'
""")
unique_workers = cursor.fetchone()[0]

print(f"[OK] Regenerated {len(existing_scenarios)} scenarios with unique worker IDs")
print(f"[OK] Generated {total_worker_assignments} total worker assignments ({unique_workers} unique workers)")
print(f"[OK] Workers appear in multiple scenarios to demonstrate progress tracking")

print("\nCreating University of Calgary project and scenarios...")

# Add Project 6 - University Safety Training
cursor.execute("""
INSERT OR REPLACE INTO projects (id, name, region, company_id)
VALUES ('p6', 'University Safety Training Labs', 'Calgary, Alberta', 'c4')
""")
print("[OK] Created project p6: University Safety Training Labs")

# Generate 6 scenarios with varying student counts
import random
import json

scenarios_data = [
    ('g21', 'p6', 'ENF 25', '2025-01-15', 12),   # 12 students
    ('g22', 'p6', 'ENE 22', '2025-01-22', 18),   # 18 students
    ('g23', 'p6', 'ENF 14', '2025-02-05', 15),   # 15 students
    ('g24', 'p6', 'ENF 030', '2025-02-19', 10),  # 10 students
    ('g25', 'p6', 'ENF 006', '2025-03-03', 20),  # 20 students
    ('g26', 'p6', 'ENE 329', '2025-03-17', 14),  # 14 students
]

# Create pool of unique student IDs (50 total unique students for University)
# Format: STU_XXXXXX (6-digit random number)
student_id_pool = []
student_skills = {}  # Track skill level for each student
used_ids = set()

for i in range(50):
    while True:
        student_id = f"STU_{random.randint(100000, 999999)}"
        if student_id not in used_ids:
            used_ids.add(student_id)
            student_id_pool.append(student_id)
            # Assign consistent skill level for this student (0.4 to 0.95)
            student_skills[student_id] = 0.4 + (random.random() * 0.55)
            break

# Generate scenarios
total_student_enrollments = 0
for scenario_idx, (scenario_id, project_id, scenario_name, date, student_count) in enumerate(scenarios_data):
    cursor.execute("""
    INSERT OR REPLACE INTO scenarios (scenario_id, project_id, scenario_name, scenario_date, scenario_order, expected_worker_count)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (scenario_id, project_id, scenario_name, date, scenario_idx, student_count))

    # Select students for this scenario
    # 70% chance to reuse students from previous scenarios
    # 30% chance to introduce new students
    selected_students = []

    # If not first scenario, potentially reuse some students
    if scenario_idx > 0 and len(student_id_pool) > student_count:
        # Reuse 20-40% of students from earlier courses
        reuse_count = random.randint(int(student_count * 0.2), int(student_count * 0.4))
        reuse_count = min(reuse_count, scenario_idx * 3)  # Limit based on how many scenarios we've done

        # Get some already-used students
        cursor.execute("""
        SELECT DISTINCT worker_id FROM workers
        WHERE project_id = ? AND worker_id LIKE 'STU_%'
        ORDER BY RANDOM() LIMIT ?
        """, (project_id, reuse_count))

        reused = [row[0] for row in cursor.fetchall()]
        selected_students.extend(reused)

    # Fill remaining slots with new students from pool
    remaining_count = student_count - len(selected_students)
    available_new = [sid for sid in student_id_pool if sid not in selected_students]
    selected_students.extend(random.sample(available_new, min(remaining_count, len(available_new))))

    # If we still need more, just sample from the entire pool
    while len(selected_students) < student_count:
        student_id = random.choice(student_id_pool)
        if student_id not in selected_students:
            selected_students.append(student_id)

    # Shuffle to randomize order
    random.shuffle(selected_students)

    # Generate workers (students) for this scenario
    for student_id in selected_students:
        total_student_enrollments += 1

        cursor.execute("""
        INSERT OR REPLACE INTO workers (worker_id, project_id, worker_name, role, experience_band)
        VALUES (?, ?, ?, ?, ?)
        """, (student_id, project_id, student_id, 'Student', 'Beginner'))

        # Get all energy types
        cursor.execute("SELECT id FROM energy_types ORDER BY id")
        energy_type_ids = [row[0] for row in cursor.fetchall()]

        # Use consistent skill level for this student
        student_skill = student_skills[student_id]

        # If student has taken courses before, slightly improve their skill
        cursor.execute("""
        SELECT COUNT(DISTINCT scenario_id) FROM hazard_responses
        WHERE worker_id = ? AND project_id = ?
        """, (student_id, project_id))

        previous_courses = cursor.fetchone()[0]
        skill_improvement = min(previous_courses * 0.05, 0.15)  # Max 15% improvement
        adjusted_skill = min(student_skill + skill_improvement, 0.95)

        for energy_id in energy_type_ids:
            # Randomize responses based on student skill level
            identified = random.random() < (0.5 + adjusted_skill * 0.5)  # 50-95% identification

            if identified:
                # If identified, check high energy classification
                marked_high = random.random() < (0.4 + adjusted_skill * 0.6)  # 40-100% mark as high
                correct_high = random.random() < (0.5 + adjusted_skill * 0.5)  # 50-95% correct

                # Check direct control classification
                marked_control = random.random() < (0.4 + adjusted_skill * 0.6)
                correct_control = random.random() < (0.5 + adjusted_skill * 0.5)
            else:
                # Not identified - no classifications
                marked_high = False
                correct_high = False
                marked_control = False
                correct_control = False

            cursor.execute("""
            INSERT OR REPLACE INTO hazard_responses
            (scenario_id, project_id, worker_id, worker_name, energy_id, identified_correctly,
             marked_high_energy, correct_high_energy, marked_direct_control, correct_direct_control)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                scenario_id,
                project_id,
                student_id,
                student_id,  # Use student_id as display name
                energy_id,
                1 if identified else 0,
                1 if marked_high else 0,
                1 if correct_high else 0,
                1 if marked_control else 0,
                1 if correct_control else 0
            ))

# Count unique students
cursor.execute("""
SELECT COUNT(DISTINCT worker_id) FROM workers
WHERE project_id = 'p6' AND worker_id LIKE 'STU_%'
""")
unique_students = cursor.fetchone()[0]

print(f"[OK] Created {len(scenarios_data)} scenarios with varied student counts")
print(f"[OK] Generated {total_student_enrollments} total student enrollments ({unique_students} unique students)")
print(f"[OK] Some students appear in multiple courses to demonstrate progress tracking")

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
    COALESCE(c.company_name, 'System Admin'),
    m.title,
    m.role,
    m.subscription_tier,
    m.app_access
FROM managers m
LEFT JOIN companies c ON c.company_id = m.company_id
ORDER BY m.role DESC, m.subscription_tier DESC, c.company_name, m.username
""")

print(f"{'Username':<20} {'Password':<12} {'Name':<20} {'Company':<28} {'Title':<30} {'Tier':<10}")
print("-" * 130)
for row in cursor.fetchall():
    tier_badge = "PREMIUM" if row[6] == 'premium' else "FREE"
    print(f"{row[0]:<20} {row[1]:<12} {row[2]:<20} {row[3]:<28} {row[4] or 'N/A':<30} {tier_badge:<10}")

conn.close()

print("\n[OK] Database rebuilt successfully!")
print(f"Location: {NEW_DB}")
print("\nNext steps:")
print("1. Update backend to add authentication endpoints")
print("2. Create login page in frontend")
print("3. Filter scenarios by company for logged-in manager")

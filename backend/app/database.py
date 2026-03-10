"""
Database connection and utilities
"""
import sqlite3
from pathlib import Path
from typing import List, Dict, Any


class Database:
    """
    Simple SQLite database wrapper.

    This class handles connecting to the SQLite database and executing queries.
    In production, this will be replaced with PostgreSQL on DigitalOcean.
    """

    def __init__(self, db_path: str):
        """
        Initialize database connection.

        Args:
            db_path: Path to the SQLite database file
        """
        self.db_path = db_path

    def _get_connection(self) -> sqlite3.Connection:
        """
        Create a new database connection.

        Returns:
            SQLite connection object
        """
        conn = sqlite3.connect(self.db_path)
        # This makes results come back as dictionaries instead of tuples
        conn.row_factory = sqlite3.Row
        return conn

    def execute_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """
        Execute a SELECT query and return results as list of dictionaries.

        Args:
            query: SQL query string
            params: Query parameters (for safe SQL injection prevention)

        Returns:
            List of rows as dictionaries

        Example:
            results = db.execute_query("SELECT * FROM projects WHERE id = ?", ("p1",))
        """
        conn = self._get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            # Convert Row objects to dictionaries
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
        finally:
            conn.close()

    def execute_one(self, query: str, params: tuple = ()) -> Dict[str, Any] | None:
        """
        Execute a query and return only the first result.

        Args:
            query: SQL query string
            params: Query parameters

        Returns:
            Single row as dictionary, or None if no results
        """
        results = self.execute_query(query, params)
        return results[0] if results else None


# Database instance (singleton pattern)
# This will be initialized when the FastAPI app starts
db_instance = None


def get_database() -> Database:
    """
    Get the database instance.

    Returns:
        Database instance
    """
    global db_instance
    if db_instance is None:
        # Path to database: ensure-app/data/ensure_mock.sqlite
        db_path = Path(__file__).parent.parent.parent / "data" / "ensure_mock.sqlite"
        db_instance = Database(str(db_path))
    return db_instance

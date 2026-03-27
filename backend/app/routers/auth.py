"""
Authentication endpoints for manager login
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..database import get_database

router = APIRouter(prefix="/api/auth", tags=["authentication"])


class LoginRequest(BaseModel):
    """Login request payload"""
    username: str
    password: str


class LoginResponse(BaseModel):
    """Login response with user info"""
    success: bool
    manager_id: str
    username: str
    full_name: str
    email: Optional[str]
    company_id: Optional[str]
    company_name: str
    role: str
    title: Optional[str]
    token: str  # Simple token for now (manager_id)
    app_access: str  # JSON string array of accessible app IDs
    subscription_tier: str  # 'free' or 'premium'


class UserInfo(BaseModel):
    """Current user information"""
    manager_id: str
    username: str
    full_name: str
    email: Optional[str]
    company_id: Optional[str]
    company_name: str
    role: str
    title: Optional[str]
    app_access: str  # JSON string array of accessible app IDs
    subscription_tier: str  # 'free' or 'premium'


@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """
    Authenticate manager and return user info

    Args:
        credentials: Username and password

    Returns:
        LoginResponse with user information and token

    Raises:
        HTTPException: If credentials are invalid
    """
    db = get_database()

    # Query to verify credentials and get user + company info
    query = """
    SELECT
        m.manager_id,
        m.username,
        m.password,
        m.full_name,
        m.email,
        m.company_id,
        COALESCE(c.company_name, 'System Admin') as company_name,
        m.role,
        m.title,
        m.app_access,
        m.subscription_tier
    FROM managers m
    LEFT JOIN companies c ON c.company_id = m.company_id
    WHERE m.username = ?
    """

    result = db.execute_query_one(query, (credentials.username,))

    if not result:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Verify password (plaintext for now - TODO: use hashing in production)
    if result['password'] != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Update last login time
    update_query = """
    UPDATE managers
    SET last_login = ?
    WHERE manager_id = ?
    """
    db.execute_update(update_query, (datetime.now().isoformat(), result['manager_id']))

    # Return user info with token (using manager_id as simple token)
    return LoginResponse(
        success=True,
        manager_id=result['manager_id'],
        username=result['username'],
        full_name=result['full_name'],
        email=result.get('email'),
        company_id=result.get('company_id'),
        company_name=result['company_name'],
        role=result['role'],
        title=result.get('title'),
        token=result['manager_id'],  # Simple token for now
        app_access=result.get('app_access', '["1"]'),  # Default to app 1
        subscription_tier=result.get('subscription_tier', 'free')
    )


@router.post("/logout")
async def logout():
    """
    Logout endpoint (client-side will clear token)

    Returns:
        Success message
    """
    return {"success": True, "message": "Logged out successfully"}


@router.get("/me", response_model=UserInfo)
async def get_current_user(token: str):
    """
    Get current user info by token

    Args:
        token: Authentication token (manager_id)

    Returns:
        UserInfo with current user details

    Raises:
        HTTPException: If token is invalid
    """
    db = get_database()

    query = """
    SELECT
        m.manager_id,
        m.username,
        m.full_name,
        m.email,
        m.company_id,
        COALESCE(c.company_name, 'System Admin') as company_name,
        m.role,
        m.title,
        m.app_access,
        m.subscription_tier
    FROM managers m
    LEFT JOIN companies c ON c.company_id = m.company_id
    WHERE m.manager_id = ?
    """

    result = db.execute_query_one(query, (token,))

    if not result:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return UserInfo(**result)

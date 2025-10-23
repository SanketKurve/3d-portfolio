from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from datetime import datetime, timedelta

from models import (
    Project, ProjectCreate, ProjectUpdate,
    Skill, SkillCreate, SkillUpdate,
    Certificate, CertificateCreate, CertificateUpdate,
    Message, MessageCreate,
    AdminLogin, Token
)
from auth import (
    verify_password, create_access_token, 
    get_current_admin, get_password_hash
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Portfolio API", version="1.0.0")

# Create routers
api_router = APIRouter(prefix="/api")
admin_router = APIRouter(prefix="/api/admin", tags=["Admin"])

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ==================== PUBLIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Portfolio API is running", "version": "1.0.0"}

# Projects - Public
@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    """Get all visible projects"""
    projects = await db.projects.find({"visible": True}, {"_id": 0}).to_list(100)
    return projects

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    """Get single project by ID"""
    project = await db.projects.find_one({"id": project_id, "visible": True}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# Skills - Public
@api_router.get("/skills", response_model=List[Skill])
async def get_skills():
    """Get all visible skills"""
    skills = await db.skills.find({"visible": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return skills

# Certificates - Public
@api_router.get("/certificates", response_model=List[Certificate])
async def get_certificates():
    """Get all visible certificates"""
    certificates = await db.certificates.find({"visible": True}, {"_id": 0}).sort("priority", 1).to_list(100)
    return certificates

# Contact Form - Public
@api_router.post("/contact", response_model=Message)
async def submit_contact(message_data: MessageCreate, request: Request):
    """Submit contact form"""
    message = Message(
        **message_data.model_dump(),
        status="unread",
        ip=request.client.host if request.client else None,
        userAgent=request.headers.get("user-agent")
    )
    
    doc = message.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    
    await db.messages.insert_one(doc)
    logger.info(f"New message received from {message.email}")
    
    return message


# ==================== ADMIN AUTH ROUTES ====================

@admin_router.post("/auth/login", response_model=Token)
async def admin_login(credentials: AdminLogin):
    """Admin login endpoint"""
    admin = await db.admin_users.find_one({"username": credentials.username}, {"_id": 0})
    
    if not admin or not verify_password(credentials.password, admin["passwordHash"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password"
        )
    
    # Update last login
    await db.admin_users.update_one(
        {"id": admin["id"]},
        {"$set": {"lastLogin": datetime.utcnow().isoformat()}}
    )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": admin["username"], "role": admin["role"]}
    )
    
    return Token(
        access_token=access_token,
        username=admin["username"],
        role=admin["role"]
    )

@admin_router.get("/auth/verify")
async def verify_admin(current_user: dict = Depends(get_current_admin)):
    """Verify admin token"""
    return {"valid": True, "user": current_user}


# ==================== ADMIN PROJECTS ROUTES ====================

@admin_router.get("/projects", response_model=List[Project])
async def admin_get_projects(current_user: dict = Depends(get_current_admin)):
    """Get all projects (including hidden)"""
    projects = await db.projects.find({}, {"_id": 0}).sort("createdAt", -1).to_list(100)
    return projects

@admin_router.post("/projects", response_model=Project)
async def admin_create_project(
    project_data: ProjectCreate,
    current_user: dict = Depends(get_current_admin)
):
    """Create new project"""
    project = Project(**project_data.model_dump())
    
    doc = project.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    doc['updatedAt'] = doc['updatedAt'].isoformat()
    
    await db.projects.insert_one(doc)
    logger.info(f"Project created: {project.title} by {current_user['username']}")
    
    return project

@admin_router.put("/projects/{project_id}", response_model=Project)
async def admin_update_project(
    project_id: str,
    project_data: ProjectUpdate,
    current_user: dict = Depends(get_current_admin)
):
    """Update existing project"""
    existing = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = {k: v for k, v in project_data.model_dump().items() if v is not None}
    update_data['updatedAt'] = datetime.utcnow().isoformat()
    
    await db.projects.update_one({"id": project_id}, {"$set": update_data})
    
    updated = await db.projects.find_one({"id": project_id}, {"_id": 0})
    logger.info(f"Project updated: {project_id} by {current_user['username']}")
    
    return Project(**updated)

@admin_router.delete("/projects/{project_id}")
async def admin_delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_admin)
):
    """Delete project"""
    result = await db.projects.delete_one({"id": project_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    logger.info(f"Project deleted: {project_id} by {current_user['username']}")
    return {"message": "Project deleted successfully"}


# ==================== ADMIN SKILLS ROUTES ====================

@admin_router.get("/skills", response_model=List[Skill])
async def admin_get_skills(current_user: dict = Depends(get_current_admin)):
    """Get all skills (including hidden)"""
    skills = await db.skills.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return skills

@admin_router.post("/skills", response_model=Skill)
async def admin_create_skill(
    skill_data: SkillCreate,
    current_user: dict = Depends(get_current_admin)
):
    """Create new skill"""
    skill = Skill(**skill_data.model_dump())
    
    doc = skill.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    
    await db.skills.insert_one(doc)
    logger.info(f"Skill created: {skill.name} by {current_user['username']}")
    
    return skill

@admin_router.put("/skills/{skill_id}", response_model=Skill)
async def admin_update_skill(
    skill_id: str,
    skill_data: SkillUpdate,
    current_user: dict = Depends(get_current_admin)
):
    """Update existing skill"""
    existing = await db.skills.find_one({"id": skill_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    update_data = {k: v for k, v in skill_data.model_dump().items() if v is not None}
    
    await db.skills.update_one({"id": skill_id}, {"$set": update_data})
    
    updated = await db.skills.find_one({"id": skill_id}, {"_id": 0})
    logger.info(f"Skill updated: {skill_id} by {current_user['username']}")
    
    return Skill(**updated)

@admin_router.delete("/skills/{skill_id}")
async def admin_delete_skill(
    skill_id: str,
    current_user: dict = Depends(get_current_admin)
):
    """Delete skill"""
    result = await db.skills.delete_one({"id": skill_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    logger.info(f"Skill deleted: {skill_id} by {current_user['username']}")
    return {"message": "Skill deleted successfully"}


# ==================== ADMIN CERTIFICATES ROUTES ====================

@admin_router.get("/certificates", response_model=List[Certificate])
async def admin_get_certificates(current_user: dict = Depends(get_current_admin)):
    """Get all certificates (including hidden)"""
    certificates = await db.certificates.find({}, {"_id": 0}).sort("priority", 1).to_list(100)
    return certificates

@admin_router.post("/certificates", response_model=Certificate)
async def admin_create_certificate(
    cert_data: CertificateCreate,
    current_user: dict = Depends(get_current_admin)
):
    """Create new certificate"""
    certificate = Certificate(**cert_data.model_dump())
    
    doc = certificate.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    
    await db.certificates.insert_one(doc)
    logger.info(f"Certificate created: {certificate.name} by {current_user['username']}")
    
    return certificate

@admin_router.put("/certificates/{cert_id}", response_model=Certificate)
async def admin_update_certificate(
    cert_id: str,
    cert_data: CertificateUpdate,
    current_user: dict = Depends(get_current_admin)
):
    """Update existing certificate"""
    existing = await db.certificates.find_one({"id": cert_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    update_data = {k: v for k, v in cert_data.model_dump().items() if v is not None}
    
    await db.certificates.update_one({"id": cert_id}, {"$set": update_data})
    
    updated = await db.certificates.find_one({"id": cert_id}, {"_id": 0})
    logger.info(f"Certificate updated: {cert_id} by {current_user['username']}")
    
    return Certificate(**updated)

@admin_router.delete("/certificates/{cert_id}")
async def admin_delete_certificate(
    cert_id: str,
    current_user: dict = Depends(get_current_admin)
):
    """Delete certificate"""
    result = await db.certificates.delete_one({"id": cert_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    logger.info(f"Certificate deleted: {cert_id} by {current_user['username']}")
    return {"message": "Certificate deleted successfully"}


# ==================== ADMIN MESSAGES ROUTES ====================

@admin_router.get("/messages", response_model=List[Message])
async def admin_get_messages(current_user: dict = Depends(get_current_admin)):
    """Get all contact messages"""
    messages = await db.messages.find({}, {"_id": 0}).sort("createdAt", -1).to_list(100)
    return messages

@admin_router.put("/messages/{message_id}/status")
async def admin_update_message_status(
    message_id: str,
    status: str,
    current_user: dict = Depends(get_current_admin)
):
    """Update message status (read/unread/archived)"""
    result = await db.messages.update_one(
        {"id": message_id},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    logger.info(f"Message {message_id} status updated to {status} by {current_user['username']}")
    return {"message": "Status updated successfully"}

@admin_router.delete("/messages/{message_id}")
async def admin_delete_message(
    message_id: str,
    current_user: dict = Depends(get_current_admin)
):
    """Delete message"""
    result = await db.messages.delete_one({"id": message_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    logger.info(f"Message deleted: {message_id} by {current_user['username']}")
    return {"message": "Message deleted successfully"}


# ==================== ADMIN DASHBOARD STATS ====================

@admin_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_admin)):
    """Get dashboard statistics"""
    total_projects = await db.projects.count_documents({})
    total_skills = await db.skills.count_documents({})
    total_certificates = await db.certificates.count_documents({})
    unread_messages = await db.messages.count_documents({"status": "unread"})
    total_messages = await db.messages.count_documents({})
    
    return {
        "totalProjects": total_projects,
        "totalSkills": total_skills,
        "totalCertificates": total_certificates,
        "unreadMessages": unread_messages,
        "totalMessages": total_messages
    }


# Include routers
app.include_router(api_router)
app.include_router(admin_router)

# CORS middleware - More permissive for debugging
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Temporarily allow all origins for debugging
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    max_age=86400,  # Cache preflight for 24 hours
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

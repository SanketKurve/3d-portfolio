from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Project Model
class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    tagline: str
    description: str
    longDescription: Optional[str] = None
    tech: List[str] = []
    features: List[str] = []
    demoUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    imageUrl: Optional[str] = None
    videoUrl: Optional[str] = None
    year: int
    category: str = "web"
    status: str = "completed"
    featured: bool = False
    visible: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    title: str
    tagline: str
    description: str
    longDescription: Optional[str] = None
    tech: List[str] = []
    features: List[str] = []
    demoUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    imageUrl: Optional[str] = None
    videoUrl: Optional[str] = None
    year: int
    category: str = "web"
    status: str = "completed"
    featured: bool = False
    visible: bool = True

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    longDescription: Optional[str] = None
    tech: Optional[List[str]] = None
    features: Optional[List[str]] = None
    demoUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    imageUrl: Optional[str] = None
    videoUrl: Optional[str] = None
    year: Optional[int] = None
    category: Optional[str] = None
    status: Optional[str] = None
    featured: Optional[bool] = None
    visible: Optional[bool] = None

# Skill Model
class Skill(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    level: int = 50
    icon: Optional[str] = None
    yearsOfExperience: Optional[float] = None
    projects: List[str] = []
    order: int = 0
    visible: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class SkillCreate(BaseModel):
    name: str
    category: str
    level: int = 50
    icon: Optional[str] = None
    yearsOfExperience: Optional[float] = None
    projects: List[str] = []
    order: int = 0
    visible: bool = True

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    level: Optional[int] = None
    icon: Optional[str] = None
    yearsOfExperience: Optional[float] = None
    projects: Optional[List[str]] = None
    order: Optional[int] = None
    visible: Optional[bool] = None

# Certificate Model
class Certificate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    issuer: str
    date: str
    description: Optional[str] = None
    credentialId: Optional[str] = None
    verifyUrl: Optional[str] = None
    imageUrl: Optional[str] = None
    status: str = "active"
    category: Optional[str] = None
    priority: int = 0
    visible: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class CertificateCreate(BaseModel):
    name: str
    issuer: str
    date: str
    description: Optional[str] = None
    credentialId: Optional[str] = None
    verifyUrl: Optional[str] = None
    imageUrl: Optional[str] = None
    status: str = "active"
    category: Optional[str] = None
    priority: int = 0
    visible: bool = True

class CertificateUpdate(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None
    credentialId: Optional[str] = None
    verifyUrl: Optional[str] = None
    imageUrl: Optional[str] = None
    status: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[int] = None
    visible: Optional[bool] = None

# Contact Message Model
class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    status: str = "unread"
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    ip: Optional[str] = None
    userAgent: Optional[str] = None

class MessageCreate(BaseModel):
    name: str
    email: str
    subject: Optional[str] = None
    message: str

# Admin User Model
class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    passwordHash: str
    role: str = "admin"
    lastLogin: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    role: str

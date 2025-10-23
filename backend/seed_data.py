from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv
from pathlib import Path
from auth import get_password_hash
from datetime import datetime
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_database():
    print("🌱 Seeding database...")
    
    # Clear existing data
    await db.projects.delete_many({"id": {"$exists": True}})
    await db.skills.delete_many({"id": {"$exists": True}})
    await db.certificates.delete_many({"id": {"$exists": True}})
    await db.admin_users.delete_many({"id": {"$exists": True}})
    
    # Seed Admin User
    admin_user = {
        "id": str(uuid.uuid4()),
        "username": "SanketKurve",
        "email": "sanketkurve.2005@gmail.com",
        "passwordHash": get_password_hash("sanket2005"),
        "role": "admin",
        "lastLogin": None,
        "createdAt": datetime.utcnow().isoformat()
    }
    await db.admin_users.insert_one(admin_user)
    print("✅ Admin user created")
    
    # Seed Projects
    projects = [
        {
            "id": str(uuid.uuid4()),
            "title": "Hajeeri",
            "tagline": "AI-Powered Attendance System",
            "description": "Smart attendance tracking using facial recognition and AI",
            "longDescription": "Hajeeri is an advanced AI-powered attendance management system that uses facial recognition technology to automate attendance tracking. Built with Django backend and React frontend, it provides real-time analytics, automated reports, and seamless integration with existing systems.",
            "tech": ["Python", "AI/ML", "Django", "React", "MongoDB", "OpenCV"],
            "features": [
                "Face recognition for automated attendance",
                "Real-time attendance tracking",
                "Comprehensive analytics dashboard",
                "Automated report generation",
                "Multi-user support",
                "Export to Excel/PDF"
            ],
            "demoUrl": "",
            "githubUrl": "https://github.com/SanketKurve",
            "imageUrl": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            "videoUrl": "",
            "year": 2024,
            "category": "AI/ML",
            "status": "completed",
            "featured": True,
            "visible": True,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Gradient",
            "tagline": "AI-Powered Student Expense Tracker",
            "description": "Smart expense management for students with AI-driven insights",
            "longDescription": "Gradient is an intelligent expense tracking application designed specifically for students. It uses AI to categorize expenses, provide budget recommendations, and send timely bill reminders. The app features a clean React frontend with Node.js backend and MongoDB for data persistence.",
            "tech": ["React", "Node.js", "Express", "MongoDB", "AI/ML", "Chart.js"],
            "features": [
                "Automatic expense categorization using AI",
                "Smart budget suggestions",
                "Visual analytics and charts",
                "Bill payment reminders",
                "Monthly expense reports",
                "Multi-currency support"
            ],
            "demoUrl": "",
            "githubUrl": "https://github.com/SanketKurve",
            "imageUrl": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
            "videoUrl": "",
            "year": 2024,
            "category": "Web App",
            "status": "completed",
            "featured": True,
            "visible": True,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat()
        }
    ]
    await db.projects.insert_many(projects)
    print(f"✅ {len(projects)} projects seeded")
    
    # Seed Skills
    skills = [
        {"id": str(uuid.uuid4()), "name": "C", "category": "Programming", "level": 80, "icon": "⚡", "yearsOfExperience": 3, "projects": [], "order": 1, "visible": True, "createdAt": datetime.utcnow().isoformat()},
        {"id": str(uuid.uuid4()), "name": "Java", "category": "Programming", "level": 85, "icon": "☕", "yearsOfExperience": 3, "projects": [], "order": 2, "visible": True, "createdAt": datetime.utcnow().isoformat()},
        {"id": str(uuid.uuid4()), "name": "Python", "category": "Programming", "level": 90, "icon": "🐍", "yearsOfExperience": 4, "projects": ["Hajeeri"], "order": 3, "visible": True, "createdAt": datetime.utcnow().isoformat()},
        {"id": str(uuid.uuid4()), "name": "React", "category": "Frontend", "level": 85, "icon": "⚛️", "yearsOfExperience": 2, "projects": ["Hajeeri", "Gradient"], "order": 4, "visible": True, "createdAt": datetime.utcnow().isoformat()},
        {"id": str(uuid.uuid4()), "name": "Node.js", "category": "Backend", "level": 80, "icon": "🟢", "yearsOfExperience": 2, "projects": ["Gradient"], "order": 5, "visible": True, "createdAt": datetime.utcnow().isoformat()},
        {"id": str(uuid.uuid4()), "name": "Express.js", "category": "Backend", "level": 80, "icon": "🚂", "yearsOfExperience": 2, "projects": ["Gradient"], "order": 6, "visible": True, "createdAt": datetime.utcnow().isoformat()},
        {"id": str(uuid.uuid4()), "name": "Django", "category": "Backend", "level": 75, "icon": "🎸", "yearsOfExperience": 2, "projects": ["Hajeeri"], "order": 7, "visible": True, "createdAt": datetime.utcnow().isoformat()},
        {"id": str(uuid.uuid4()), "name": "MongoDB", "category": "Database", "level": 75, "icon": "🍃", "yearsOfExperience": 2, "projects": ["Hajeeri", "Gradient"], "order": 8, "visible": True, "createdAt": datetime.utcnow().isoformat()}
    ]
    await db.skills.insert_many(skills)
    print(f"✅ {len(skills)} skills seeded")
    
    # Seed Certificates (placeholders)
    certificates = [
        {
            "id": str(uuid.uuid4()),
            "name": "Python for Data Science",
            "issuer": "Coursera",
            "date": "2024",
            "description": "Completed comprehensive Python course for data science applications",
            "credentialId": "CERT-123456",
            "verifyUrl": "",
            "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600",
            "status": "active",
            "category": "Programming",
            "priority": 1,
            "visible": True,
            "createdAt": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Full Stack Web Development",
            "issuer": "Udemy",
            "date": "2023",
            "description": "Mastered MERN stack development",
            "credentialId": "CERT-789012",
            "verifyUrl": "",
            "imageUrl": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
            "status": "active",
            "category": "Web Development",
            "priority": 2,
            "visible": True,
            "createdAt": datetime.utcnow().isoformat()
        }
    ]
    await db.certificates.insert_many(certificates)
    print(f"✅ {len(certificates)} certificates seeded")
    
    print("\n🎉 Database seeded successfully!")
    print("\n📝 Admin Credentials:")
    print("   Username: SanketKurve")
    print("   Password: sanket2005")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())

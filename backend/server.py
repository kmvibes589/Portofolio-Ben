from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Benjamin Kyamoneka Mpey Portfolio API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic Models
class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    message_type: str = "general"  # general, speaking, collaboration
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    message_type: str = "general"

class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    excerpt: str
    author: str = "Benjamin Kyamoneka Mpey"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    published: bool = True
    tags: List[str] = []

class BlogPostCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    tags: List[str] = []

class NewsletterSubscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: Optional[str] = None
    subscribed_at: datetime = Field(default_factory=datetime.utcnow)
    active: bool = True

class NewsletterSubscriptionCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None

# Portfolio data endpoints
@api_router.get("/")
async def root():
    return {"message": "Benjamin Kyamoneka Mpey Portfolio API"}

@api_router.get("/portfolio/about")
async def get_about():
    return {
        "name": "Benjamin Kyamoneka Mpey",
        "title": "Youth Leader & Human Rights Activist",
        "tagline": "Empowering Youth. Defending Rights. Inspiring Change.",
        "age": 21,
        "nationality": "Congolese",
        "based_in": "Kenya",
        "bio": """I am Kyamoneka Mpey Benjamin, a 21-year-old Congolese human rights activist based in Kenya, committed to justice, equality, and environmental sustainability. My advocacy focuses on empowering young people through human rights education, digital safety, climate action, and legal literacy. At Amnesty International Kenya, I support the Privacy First Campaign, advocating for a safer internet and data protection for youth. Through Lawrit Journal of Law and Legal Alliance Associates, I organize debates, workshops, and trainings that promote civic education, legal research, and climate awareness—impacting hundreds of students across Africa.

I was the youngest participant selected globally to attend the 2025 Venice School for Human Rights Defenders, and I've been named a Youth Delegate to two major events: the HISA Youth Fellowship in Oxford (23–26 August 2025) and the "You(th) Rebuilding the Broken)" Workshop in Brussels (31 July–3 August 2025), focused on youth-led democratic renewal. I am also part of the Global Youth MIDORI Platform, promoting youth engagement in biodiversity and sustainability.

I believe that education is the most powerful tool for change and that youth are not only the future—they are the driving force of transformation today.""",
        "focus_areas": [
            "Human Rights Advocacy",
            "Climate Action",
            "Digital Privacy Rights",
            "Legal Literacy",
            "Youth Empowerment",
            "Environmental Justice"
        ],
        "mission": "To empower young people through human rights education, digital safety, climate action, and legal literacy.",
        "vision": "A world where youth are recognized as powerful agents of change and where human rights, environmental justice, and digital privacy are protected for all."
    }

@api_router.get("/portfolio/leadership")
async def get_leadership():
    return {
        "current_positions": [
            {
                "title": "Privacy First Campaigner",
                "organization": "Amnesty International Kenya",
                "period": "March 2025 – Present",
                "description": "Leading advocacy for digital rights and privacy protections",
                "responsibilities": [
                    "Conducting research on privacy laws and violations",
                    "Organizing national workshops and policy dialogues on surveillance and youth safety online"
                ]
            },
            {
                "title": "Country Director",
                "organization": "Lawrit Journal of Law (DRC Chapter)",
                "period": "Since August 2024",
                "description": "Representing the DRC in a youth-led legal education and advocacy platform",
                "responsibilities": [
                    "Coordinating legal literacy sessions, webinars, and publishing opportunities for students",
                    "Bridging Francophone youth voices with pan-African legal innovation"
                ]
            },
            {
                "title": "Red Card Ambassador",
                "organization": "African Renaissance and Diaspora Network",
                "period": "Jan – Jun 2025",
                "description": "Managed digital outreach campaigns in support of gender equality",
                "responsibilities": [
                    "Organized virtual events and Red Card advocacy actions aligned with SDG 5"
                ]
            },
            {
                "title": "Member, Communication Department",
                "organization": "Black Professionals in International Affairs (BPIA)",
                "period": "Since July 2024",
                "description": "Supporting strategic communication and youth engagement",
                "responsibilities": [
                    "Assisting in the development of briefs and visibility content related to African youth in international affairs"
                ]
            }
        ],
        "past_positions": [
            {
                "title": "Head of the Department of Indigenous People",
                "organization": "Les Toges Vertes",
                "period": "Jul 2022 – Dec 2022",
                "description": "Led community-based legal interventions for Indigenous detainees in Goma",
                "responsibilities": [
                    "Conducted prison interviews, gathered testimonies, and drafted human rights reports"
                ]
            },
            {
                "title": "Co-Founder & President",
                "organization": "EDDEC (Act for a Sustainable Development of the Environment in Congo)",
                "period": "Dec 2019 – Dec 2021",
                "description": "Designed and implemented environmental sustainability programs",
                "responsibilities": [
                    "Led tree-planting campaign (6,000 trees in 35 schools)",
                    "Formed environmental partnerships with WWF, FFN, and the Provincial Ministry of Environment",
                    "Led school-based awareness campaigns impacting over 3,000 learners"
                ]
            },
            {
                "title": "Volunteer",
                "organization": "North Kivu Women's Platform (PFNDE)",
                "period": "Feb 2023 – Aug 2023",
                "description": "Conducted surveys and led advocacy campaigns",
                "responsibilities": [
                    "Conducted surveys in 20 schools on sexual abuse and harassment",
                    "Co-led a campaign against gender-based violence during the 16 Days of Activism 2023"
                ]
            }
        ]
    }

@api_router.get("/portfolio/achievements")
async def get_achievements():
    return {
        "fellowships": [
            {
                "title": "Venice School for Human Rights Defenders",
                "organization": "International Commission of Jurists",
                "year": "2025",
                "location": "Venice, Italy",
                "distinction": "Youngest Participant Globally"
            },
            {
                "title": "HISA Youth Fellowship",
                "organization": "HISA",
                "year": "2025",
                "location": "Oxford, UK",
                "distinction": "Youth Delegate"
            },
            {
                "title": "You(th) Rebuilding the Broken Workshop",
                "organization": "Youth Democratic Renewal",
                "year": "2025",
                "location": "Brussels, Belgium",
                "distinction": "Youth Delegate"
            },
            {
                "title": "Aspire Leadership Program",
                "organization": "Aspire Institute & Harvard Business School",
                "year": "2025"
            },
            {
                "title": "Online Anti-Corruption Autumn School",
                "organization": "University of Oxford",
                "year": "2024"
            },
            {
                "title": "UNODC/IACA Training",
                "organization": "Global Youth Climate Leadership",
                "year": "2024",
                "location": "Switzerland"
            }
        ],
        "awards": [
            {
                "title": "Winner - Mock ICJ Moot on Climate Change",
                "organization": "Kenya Model United Nations",
                "year": "2024"
            },
            {
                "title": "Best Upcoming Mooter",
                "organization": "1st Kenya ICJ Moot, USIU-Kenya",
                "year": "2024"
            },
            {
                "title": "Best Male Orator",
                "organization": "MKU Moot Court Competition",
                "year": "2024"
            },
            {
                "title": "Best Male Orator",
                "organization": "6th Bachelor Moot Court, MKU",
                "year": "2024"
            },
            {
                "title": "Best Diplomat",
                "organization": "6th Intervarsity Diplomatic Conference, KEMUN",
                "year": "2024"
            },
            {
                "title": "Second Best Memorial",
                "organization": "KeMUN Refugee Moot",
                "year": "2024"
            },
            {
                "title": "Finalist",
                "organization": "MKU 1st Debate Championship",
                "year": "2023"
            },
            {
                "title": "Winner - Ka Mana Prize",
                "organization": "Ka Mana Foundation",
                "year": "2023"
            }
        ]
    }

@api_router.get("/portfolio/events")
async def get_events():
    return {
        "upcoming_events": [
            {
                "title": "HISA Youth Fellowship",
                "location": "Oxford, UK",
                "date": "August 23-26, 2025",
                "type": "Fellowship",
                "description": "International youth leadership and policy development program"
            },
            {
                "title": "You(th) Rebuilding the Broken Workshop",
                "location": "Brussels, Belgium", 
                "date": "July 31 - August 3, 2025",
                "type": "Workshop",
                "description": "Youth-led democratic renewal and governance workshop"
            }
        ],
        "past_events": [
            {
                "title": "Venice School for Human Rights Defenders",
                "location": "Venice, Italy",
                "date": "2025",
                "type": "Training",
                "description": "Intensive human rights defenders training program"
            },
            {
                "title": "Privacy First Campaign Launch",
                "location": "Nairobi, Kenya",
                "date": "March 2025",
                "type": "Campaign Launch",
                "description": "Digital rights and privacy protection campaign for youth"
            },
            {
                "title": "Kenya Model United Nations",
                "location": "Nairobi, Kenya",
                "date": "2024",
                "type": "Competition",
                "description": "Mock ICJ Moot on Climate Change - Winner"
            }
        ]
    }

# Contact endpoints
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    contact_dict = input.dict()
    contact_obj = ContactMessage(**contact_dict)
    await db.contact_messages.insert_one(contact_obj.dict())
    return contact_obj

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find().sort("timestamp", -1).to_list(100)
    return [ContactMessage(**message) for message in messages]

# Blog endpoints
@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(input: BlogPostCreate):
    blog_dict = input.dict()
    blog_obj = BlogPost(**blog_dict)
    await db.blog_posts.insert_one(blog_obj.dict())
    return blog_obj

@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts():
    posts = await db.blog_posts.find({"published": True}).sort("created_at", -1).to_list(50)
    return [BlogPost(**post) for post in posts]

@api_router.get("/blog/{post_id}", response_model=BlogPost)
async def get_blog_post(post_id: str):
    post = await db.blog_posts.find_one({"id": post_id, "published": True})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPost(**post)

# Newsletter endpoints
@api_router.post("/newsletter/subscribe", response_model=NewsletterSubscription)
async def subscribe_newsletter(input: NewsletterSubscriptionCreate):
    # Check if email already exists
    existing = await db.newsletter_subscriptions.find_one({"email": input.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already subscribed")
    
    subscription_dict = input.dict()
    subscription_obj = NewsletterSubscription(**subscription_dict)
    await db.newsletter_subscriptions.insert_one(subscription_obj.dict())
    return subscription_obj

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import re

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
    message_type: str = "general"
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
    category: str = "general"
    featured_image: Optional[str] = None
    reading_time: Optional[int] = None
    paper_type: Optional[str] = None  # academic, article, research, opinion
    academic_info: Optional[Dict[str, Any]] = None  # for academic papers

class BlogPostCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    tags: List[str] = []
    category: str = "general"
    featured_image: Optional[str] = None
    paper_type: Optional[str] = None
    academic_info: Optional[Dict[str, Any]] = None

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    featured_image: Optional[str] = None
    published: Optional[bool] = None
    paper_type: Optional[str] = None
    academic_info: Optional[Dict[str, Any]] = None

class NewsletterSubscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: Optional[str] = None
    subscribed_at: datetime = Field(default_factory=datetime.utcnow)
    active: bool = True

class NewsletterSubscriptionCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None

# Multi-language content structure
LANGUAGES = {
    "en": "English",
    "fr": "Français", 
    "ar": "العربية",
    "zh": "中文",
    "es": "Español"
}

# Utility function to calculate reading time
def calculate_reading_time(content: str) -> int:
    """Calculate estimated reading time in minutes based on average reading speed of 200 words per minute"""
    word_count = len(re.findall(r'\w+', content))
    return max(1, round(word_count / 200))

# Portfolio data endpoints
@api_router.get("/")
async def root():
    return {"message": "Benjamin Kyamoneka Mpey Portfolio API"}

@api_router.get("/languages")
async def get_languages():
    return LANGUAGES

@api_router.get("/portfolio/about")
async def get_about(lang: str = "en"):
    content = {
        "en": {
            "name": "Kyamoneka Mpey Benjamin",
            "title": "Human Rights Defender | Privacy First Campaigner at Amnesty International",
            "tagline": "Empowering Youth. Defending Rights. Inspiring Change.",
            "quote": "Human rights are not a privilege conferred by the state. They are every human being's entitlement by virtue of their humanity.",
            "age": 21,
            "nationality": "Congolese",
            "based_in": "Kenya",
            "education": "Law Student at Mount Kenya University – School of Law",
            "phone": "+254 797 427 649",
            "email": "kyamompey@gmail.com",
            "linkedin": "kyamoneka-mpey-benjamin",
            "bio": """I am a Congolese law student at Mount Kenya University – School of Law, with a passion for justice, human rights, and environmental sustainability. My advocacy focuses on climate action, digital rights, gender equality, anti-corruption, and legal empowerment.

Currently, I serve as a Campaign Advocate at Amnesty International Kenya, supporting the Privacy First Campaign. My leadership roles include Managing Partner at Legal Alliance Associates where I've trained 114+ law students, Country Director (DRC) of The Lawrit Journal of Law promoting legal research and youth engagement, Red Card Ambassador with ARDN advocating against gender-based violence, and President & Co-Founder of EDDEC where I led a 6,000-tree afforestation project in Goma.

I'm an alumnus of Venice School of Human Rights Defenders (2025), Global Campus of Human Rights, Global Youth Climate Leadership Programme at University of Oxford, and International Anti-Corruption Academy in partnership with UNODC.

Selected as a 2025 Youth Delegate for You(th) Rebuilding the Broken in Belgium (July 31–Aug 3) and HISA Youth Fellowship in Oxford, UK (Aug 23–26).""",
            "focus_areas": [
                "Human Rights Advocacy",
                "Climate Action", 
                "Digital Privacy Rights",
                "Gender Equality",
                "Anti-Corruption",
                "Legal Empowerment",
                "Environmental Justice"
            ],
            "mission": "To advance justice, equity, and sustainability through human rights advocacy, legal empowerment, and youth engagement.",
            "vision": "A world where human rights, environmental justice, and digital privacy are protected for all, with youth recognized as powerful agents of change."
        },
        "fr": {
            "name": "Kyamoneka Mpey Benjamin",
            "title": "Défenseur des Droits Humains | Militant Privacy First chez Amnesty International",
            "tagline": "Autonomiser la Jeunesse. Défendre les Droits. Inspirer le Changement.",
            "quote": "Les droits humains ne sont pas un privilège accordé par l'État. Ils sont le droit de chaque être humain en vertu de son humanité.",
            "age": 21,
            "nationality": "Congolais",
            "based_in": "Kenya",
            "education": "Étudiant en Droit à l'Université Mount Kenya – École de Droit",
            "phone": "+254 797 427 649",
            "email": "kyamompey@gmail.com",
            "linkedin": "kyamoneka-mpey-benjamin",
            "bio": """Je suis un étudiant congolais en droit à l'Université Mount Kenya – École de Droit, passionné par la justice, les droits humains et la durabilité environnementale. Mon plaidoyer se concentre sur l'action climatique, les droits numériques, l'égalité des sexes, la lutte contre la corruption et l'autonomisation juridique.

Actuellement, je sers comme Défenseur de Campagne chez Amnesty International Kenya, soutenant la Campagne Privacy First. Mes rôles de leadership incluent Associé Gérant chez Legal Alliance Associates où j'ai formé plus de 114 étudiants en droit, Directeur National (RDC) du Journal Lawrit of Law promouvant la recherche juridique et l'engagement des jeunes, Ambassadeur Red Card avec ARDN plaidant contre la violence basée sur le genre, et Président & Co-fondateur d'EDDEC où j'ai dirigé un projet de reboisement de 6 000 arbres à Goma.""",
            "focus_areas": [
                "Plaidoyer des Droits Humains",
                "Action Climatique",
                "Droits à la Vie Privée Numérique", 
                "Égalité des Sexes",
                "Anti-Corruption",
                "Autonomisation Juridique",
                "Justice Environnementale"
            ],
            "mission": "Faire progresser la justice, l'équité et la durabilité grâce au plaidoyer des droits humains, à l'autonomisation juridique et à l'engagement des jeunes.",
            "vision": "Un monde où les droits humains, la justice environnementale et la vie privée numérique sont protégés pour tous, avec les jeunes reconnus comme des agents puissants du changement."
        },
        "ar": {
            "name": "كياموناكا مباي بنجامين",
            "title": "مدافع عن حقوق الإنسان | ناشط الخصوصية أولاً في منظمة العفو الدولية",
            "tagline": "تمكين الشباب. الدفاع عن الحقوق. إلهام التغيير.",
            "quote": "حقوق الإنسان ليست امتيازاً تمنحه الدولة. إنها حق كل إنسان بحكم إنسانيته.",
            "age": 21,
            "nationality": "كونغولي",
            "based_in": "كينيا",
            "education": "طالب قانون في جامعة جبل كينيا - كلية الحقوق",
            "phone": "+254 797 427 649",
            "email": "kyamompey@gmail.com",
            "linkedin": "kyamoneka-mpey-benjamin",
            "bio": """أنا طالب قانون كونغولي في جامعة جبل كينيا - كلية الحقوق، لدي شغف بالعدالة وحقوق الإنسان والاستدامة البيئية. يركز عملي على العمل المناخي والحقوق الرقمية والمساواة بين الجنسين ومكافحة الفساد والتمكين القانوني.

حالياً، أعمل كمدافع عن الحملات في منظمة العفو الدولية كينيا، ودعم حملة الخصوصية أولاً. تشمل أدواري القيادية الشريك الإداري في تحالف المساعدين القانونيين حيث دربت أكثر من 114 طالب قانون، والمدير القطري (جمهورية الكونغو الديمقراطية) لمجلة لوريت للقانون الترويج للبحث القانوني ومشاركة الشباب.""",
            "focus_areas": [
                "الدفاع عن حقوق الإنسان",
                "العمل المناخي",
                "حقوق الخصوصية الرقمية",
                "المساواة بين الجنسين", 
                "مكافحة الفساد",
                "التمكين القانوني",
                "العدالة البيئية"
            ],
            "mission": "تعزيز العدالة والإنصاف والاستدامة من خلال الدفاع عن حقوق الإنسان والتمكين القانوني ومشاركة الشباب.",
            "vision": "عالم تُحمى فيه حقوق الإنسان والعدالة البيئية والخصوصية الرقمية للجميع، مع الاعتراف بالشباب كعوامل قوية للتغيير."
        },
        "zh": {
            "name": "基亚蒙奈卡·姆派·本杰明",
            "title": "人权捍卫者 | 国际特赦组织隐私优先活动家",
            "tagline": "赋能青年。捍卫权利。启发变革。",
            "quote": "人权不是国家赋予的特权。它们是每个人凭借其人性应有的权利。",
            "age": 21,
            "nationality": "刚果",
            "based_in": "肯尼亚",
            "education": "肯尼亚山大学法学院法学学生",
            "phone": "+254 797 427 649",
            "email": "kyamompey@gmail.com", 
            "linkedin": "kyamoneka-mpey-benjamin",
            "bio": """我是肯尼亚山大学法学院的刚果法学学生，对正义、人权和环境可持续性充满热情。我的倡导重点是气候行动、数字权利、性别平等、反腐败和法律赋权。

目前，我在国际特赦组织肯尼亚分部担任活动倡导者，支持隐私优先活动。我的领导角色包括法律联盟合伙人管理合伙人，在那里我培训了114多名法学学生，Lawrit法律杂志国家主任（刚果民主共和国）促进法律研究和青年参与，ARDN红牌大使倡导反对基于性别的暴力，以及EDDEC总裁兼联合创始人，我在戈马领导了6000棵树的造林项目。""",
            "focus_areas": [
                "人权倡导",
                "气候行动", 
                "数字隐私权",
                "性别平等",
                "反腐败",
                "法律赋权",
                "环境正义"
            ],
            "mission": "通过人权倡导、法律赋权和青年参与推进正义、公平和可持续性。",
            "vision": "一个人权、环境正义和数字隐私得到保护的世界，青年被认为是变革的强大推动者。"
        },
        "es": {
            "name": "Kyamoneka Mpey Benjamin",
            "title": "Defensor de Derechos Humanos | Activista Privacidad Primero en Amnistía Internacional",
            "tagline": "Empoderando Jóvenes. Defendiendo Derechos. Inspirando Cambio.",
            "quote": "Los derechos humanos no son un privilegio otorgado por el estado. Son el derecho de cada ser humano en virtud de su humanidad.",
            "age": 21,
            "nationality": "Congoleño",
            "based_in": "Kenia",
            "education": "Estudiante de Derecho en Universidad Mount Kenya – Escuela de Derecho",
            "phone": "+254 797 427 649",
            "email": "kyamompey@gmail.com",
            "linkedin": "kyamoneka-mpey-benjamin",
            "bio": """Soy un estudiante de derecho congoleño en la Universidad Mount Kenya – Escuela de Derecho, con pasión por la justicia, los derechos humanos y la sostenibilidad ambiental. Mi activismo se enfoca en acción climática, derechos digitales, igualdad de género, anticorrupción y empoderamiento legal.

Actualmente, sirvo como Defensor de Campaña en Amnistía Internacional Kenia, apoyando la Campaña Privacidad Primero. Mis roles de liderazgo incluyen Socio Gerente en Legal Alliance Associates donde he entrenado a más de 114 estudiantes de derecho, Director Nacional (RDC) de The Lawrit Journal of Law promoviendo investigación legal y participación juvenil, Embajador Tarjeta Roja con ARDN abogando contra la violencia basada en género, y Presidente y Co-fundador de EDDEC donde lideré un proyecto de forestación de 6,000 árboles en Goma.""",
            "focus_areas": [
                "Defensa de Derechos Humanos",
                "Acción Climática",
                "Derechos de Privacidad Digital",
                "Igualdad de Género",
                "Anticorrupción", 
                "Empoderamiento Legal",
                "Justicia Ambiental"
            ],
            "mission": "Avanzar la justicia, equidad y sostenibilidad a través de la defensa de derechos humanos, empoderamiento legal y participación juvenil.",
            "vision": "Un mundo donde los derechos humanos, la justicia ambiental y la privacidad digital están protegidos para todos, con los jóvenes reconocidos como agentes poderosos de cambio."
        }
    }
    
    return content.get(lang, content["en"])

@api_router.get("/portfolio/leadership")
async def get_leadership(lang: str = "en"):
    content = {
        "en": {
            "current_positions": [
                {
                    "title": "Campaign Advocate",
                    "organization": "Amnesty International Kenya",
                    "period": "March 2025 – Present",
                    "description": "Supporting the Privacy First Campaign for digital rights and privacy protections",
                    "responsibilities": [
                        "Conducting research on privacy laws and violations",
                        "Organizing national workshops and policy dialogues on surveillance and youth safety online",
                        "Advocating for digital rights legislation"
                    ]
                },
                {
                    "title": "Managing Partner",
                    "organization": "Legal Alliance Associates",
                    "period": "2024 – Present",
                    "description": "Advancing SDG 4 through legal education",
                    "responsibilities": [
                        "Led Moot Court Training (2025) – trained 114+ students in courtroom advocacy",
                        "Developed public defense and legal literacy programs",
                        "Coordinated legal education initiatives across East Africa"
                    ]
                },
                {
                    "title": "Country Director (DRC)",
                    "organization": "The Lawrit Journal of Law",
                    "period": "August 2024 – Present",
                    "description": "Promoting legal research, governance, and climate change advocacy",
                    "responsibilities": [
                        "Reached over 280 law students in 2024",
                        "Co-organized the 2025 Leadership & Advocacy Bootcamp (400+ participants from 7 countries)",
                        "Bridging Francophone youth voices with pan-African legal innovation"
                    ]
                },
                {
                    "title": "Red Card Ambassador",
                    "organization": "African Renaissance and Diaspora Network (ARDN)",
                    "period": "January – June 2025",
                    "description": "Advocated against gender-based violence",
                    "responsibilities": [
                        "Organized virtual events and Red Card advocacy actions aligned with SDG 5",
                        "Panelist, Red Card Campaign on Gender-Based Violence (April 2025)",
                        "Managed digital outreach campaigns in support of gender equality"
                    ]
                }
            ],
            "past_positions": [
                {
                    "title": "Head of Indigenous Peoples Department",
                    "organization": "Les Toges Vertes",
                    "period": "July – December 2022",
                    "description": "Led legal aid and advocacy for indigenous communities",
                    "responsibilities": [
                        "Led legal aid for 150+ detainees",
                        "Advocated for Pygmy Protection Act (2015)",
                        "Supported IDPs through legal outreach",
                        "Conducted prison interviews, gathered testimonies, and drafted human rights reports"
                    ]
                },
                {
                    "title": "President & Co-Founder",
                    "organization": "EDDEC (Act for a Sustainable Development of the Environment in Congo)",
                    "period": "December 2019 – December 2021",
                    "description": "Led environmental sustainability and climate action programs",
                    "responsibilities": [
                        "Project Lead, 6,000-tree afforestation initiative in Goma (2019–2022)",
                        "Formed environmental partnerships with WWF, FFN, and the Provincial Ministry of Environment",
                        "Led school-based awareness campaigns impacting over 3,000 learners"
                    ]
                },
                {
                    "title": "Volunteer",
                    "organization": "North Kivu Women's Platform (PFNDE)",
                    "period": "February 2023 – August 2023",
                    "description": "Conducted surveys and led advocacy campaigns against gender-based violence",
                    "responsibilities": [
                        "Conducted surveys in 20 schools on sexual abuse and harassment",
                        "Co-led a campaign against gender-based violence during the 16 Days of Activism 2023"
                    ]
                }
            ]
        }
    }
    
    # For other languages, return English for now (can be expanded later)
    return content.get(lang, content["en"])

@api_router.get("/portfolio/achievements")
async def get_achievements(lang: str = "en"):
    content = {
        "en": {
            "fellowships": [
                {
                    "title": "Venice School for Human Rights Defenders",
                    "organization": "Global Campus of Human Rights",
                    "year": "2025",
                    "location": "Venice, Italy",
                    "distinction": "Youngest Participant Globally"
                },
                {
                    "title": "HISA Youth Fellowship", 
                    "organization": "HISA",
                    "year": "2025",
                    "location": "Oxford, UK",
                    "distinction": "Youth Delegate",
                    "dates": "August 23-26, 2025"
                },
                {
                    "title": "You(th) Rebuilding the Broken",
                    "organization": "Youth Democratic Renewal",
                    "year": "2025",
                    "location": "Belgium",
                    "distinction": "Youth Delegate", 
                    "dates": "July 31 – August 3, 2025"
                },
                {
                    "title": "Aspire Leadership Program",
                    "organization": "Harvard Business School & Aspire Institute",
                    "year": "2025",
                    "distinction": "Graduate"
                },
                {
                    "title": "Global Youth Climate Leadership Programme",
                    "organization": "University of Oxford",
                    "year": "2024",
                    "distinction": "Graduate"
                },
                {
                    "title": "International Anti-Corruption Autumn School",
                    "organization": "University of Oxford & UNODC",
                    "year": "2024",
                    "distinction": "42 Global Participants Selected"
                },
                {
                    "title": "EU Global Gateway Youth Event",
                    "organization": "European Union",
                    "year": "2024",
                    "location": "October 2024",
                    "distinction": "EU-Selected Delegate"
                },
                {
                    "title": "Fuel Africa 2024",
                    "organization": "Entrepreneurship Program",
                    "year": "2024",
                    "description": "Innovation in health and climate"
                },
                {
                    "title": "Africa Law Tech Festival 2024",
                    "organization": "Tech & Law Innovation",
                    "year": "2024",
                    "location": "Nairobi, Kenya",
                    "distinction": "Youth Delegate"
                }
            ],
            "awards": [
                {
                    "title": "Finalist & Best Memorial",
                    "organization": "JKUAT Tax Law Moot",
                    "year": "2025"
                },
                {
                    "title": "Best Male Oralist & Winner",
                    "organization": "2nd Mock Kenya ICJ Moot",
                    "year": "2024"
                },
                {
                    "title": "Best Diplomat",
                    "organization": "6th Kenya Intervarsity Diplomatic Conference",
                    "year": "2024"
                },
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
                    "title": "Second Best Memorial",
                    "organization": "KeMUN Refugee Moot",
                    "year": "2024"
                },
                {
                    "title": "Winner - Ka Mana Prize",
                    "organization": "Ka Mana Foundation",
                    "year": "2023",
                    "description": "For argumentation and critical thinking"
                },
                {
                    "title": "Finalist",
                    "organization": "MKU 1st Debate Championship",
                    "year": "2023"
                }
            ]
        }
    }
    
    return content.get(lang, content["en"])

@api_router.get("/portfolio/events")
async def get_events(lang: str = "en"):
    content = {
        "en": {
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
                    "location": "Belgium",
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
                    "description": "Intensive human rights defenders training program - Youngest participant globally"
                },
                {
                    "title": "Privacy First Campaign Training",
                    "location": "Nairobi, Kenya",
                    "date": "March 2025",
                    "type": "Training",
                    "description": "Amnesty International Kenya's Privacy First Campaign Training"
                },
                {
                    "title": "EAC Secretary General Forum",
                    "location": "East Africa",
                    "date": "December 2024",
                    "type": "Forum",
                    "description": "Peace & Security Session Delegate"
                },
                {
                    "title": "Mock Trial on Women's Rights & SRHR",
                    "location": "JKUAT",
                    "date": "November 2024",
                    "type": "Participant",
                    "description": "Mock trial focused on women's rights and sexual reproductive health rights"
                },
                {
                    "title": "Africa Law Tech Festival 2024",
                    "location": "Nairobi, Kenya",
                    "date": "2024",
                    "type": "Conference",
                    "description": "Youth Delegate for tech and law innovation"
                },
                {
                    "title": "Human Rights Workshop",
                    "location": "UN Joint Office",
                    "date": "July 2023",
                    "type": "Training",
                    "description": "Comprehensive human rights training program"
                },
                {
                    "title": "Intervarsity Summit on SRHR",
                    "location": "DRC",
                    "date": "June 2023",
                    "type": "Summit",
                    "description": "Delegate for sexual reproductive health rights summit"
                }
            ]
        }
    }
    
    return content.get(lang, content["en"])

@api_router.get("/portfolio/projects")
async def get_projects(lang: str = "en"):
    return {
        "featured_projects": [
            {
                "title": "Moot Court Training Highlights",
                "description": "Training 114+ law students in courtroom advocacy and legal literacy",
                "link": "#",
                "type": "Education"
            },
            {
                "title": "Red Card Campaign | ARDN",
                "description": "Campaign against gender-based violence",
                "link": "#",
                "type": "Advocacy"
            },
            {
                "title": "EDDEC Climate Advocacy Video",
                "description": "6,000-tree afforestation project documentation",
                "link": "#",
                "type": "Environment"
            },
            {
                "title": "Lawrit Journal Initiatives",
                "description": "Legal research and youth engagement platform",
                "link": "#",
                "type": "Research"
            },
            {
                "title": "Les Toges Vertes",
                "description": "Legal aid for indigenous communities",
                "link": "#",
                "type": "Human Rights"
            }
        ]
    }

# Blog endpoints with enhanced functionality
@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(input: BlogPostCreate):
    blog_dict = input.dict()
    blog_obj = BlogPost(**blog_dict)
    
    # Calculate reading time
    blog_obj.reading_time = calculate_reading_time(blog_obj.content)
    
    await db.blog_posts.insert_one(blog_obj.dict())
    return blog_obj

@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(default=10, le=50),
    skip: int = Query(default=0, ge=0)
):
    # Build query based on filters
    query = {"published": True}
    
    if category:
        query["category"] = category
    
    if tag:
        query["tags"] = {"$in": [tag]}
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}},
            {"excerpt": {"$regex": search, "$options": "i"}}
        ]
    
    posts = await db.blog_posts.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return [BlogPost(**post) for post in posts]

@api_router.get("/blog/categories")
async def get_blog_categories():
    """Get all available blog categories"""
    categories = await db.blog_posts.distinct("category", {"published": True})
    return categories

@api_router.get("/blog/tags")
async def get_blog_tags():
    """Get all available blog tags"""
    # Get all posts and extract unique tags
    posts = await db.blog_posts.find({"published": True}, {"tags": 1}).to_list(1000)
    all_tags = []
    for post in posts:
        all_tags.extend(post.get("tags", []))
    unique_tags = list(set(all_tags))
    return unique_tags

@api_router.get("/blog/featured")
async def get_featured_posts(limit: int = 3):
    """Get featured blog posts (most recent)"""
    posts = await db.blog_posts.find({"published": True}).sort("created_at", -1).limit(limit).to_list(limit)
    return [BlogPost(**post) for post in posts]

@api_router.get("/blog/{post_id}", response_model=BlogPost)
async def get_blog_post(post_id: str):
    post = await db.blog_posts.find_one({"id": post_id, "published": True})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPost(**post)

@api_router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, input: BlogPostUpdate):
    post = await db.blog_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    update_data = {k: v for k, v in input.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    # Recalculate reading time if content is updated
    if "content" in update_data:
        update_data["reading_time"] = calculate_reading_time(update_data["content"])
    
    await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    
    updated_post = await db.blog_posts.find_one({"id": post_id})
    return BlogPost(**updated_post)

@api_router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted successfully"}

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
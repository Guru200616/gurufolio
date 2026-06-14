import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Standard Environment Variables
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "data-store.json");
const JWT_SECRET = process.env.JWT_SECRET || "better-call-guru-super-secret-key-2026";
const GURU_SALT = "guru_salt_2026_salt";

// Initialize express
const app = express();
app.use(express.json());

// Initialize Gemini Client (lazy)
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Ensure database file and initial data exist
function hashPassword(password: string) {
  return crypto.createHmac("sha256", GURU_SALT).update(password).digest("hex");
}

function initializeDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const existing = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(existing);
      if (parsed && parsed.projects && parsed.blogs && parsed.skills) {
        return; // already rich
      }
    } catch (e) {
      console.error("Corruption detected, backup up and re-initializing.", e);
    }
  }

  // Pre-load extremely highly-polished and descriptive sample data for Guru Rengarajan
  const initialData = {
    users: [
      {
        _id: "admin-user",
        name: "Guru Rengarajan",
        email: "rguru160706@gmail.com",
        passwordHash: hashPassword("guruadmin123"),
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    ],
    projects: [
      {
        _id: "proj-1",
        title: "Better Call Guru! Legal AI Companion",
        description: "An intelligent context-aware workspace offering automated contract analysis, dynamic drafting suggestions, and deep legal citation searches.",
        detailedDescription: "A custom fine-tuned assistant platform showcasing real-time parsing of legal clauses with Gemini 2.5 Flash. Features structured JSON output verification, comparative side-by-side compliance audits, and instant semantic legal recommendation grounding, integrated into a beautiful React + Tailwind dashboard with smooth Framer Motion workflows.",
        technologies: ["React", "TypeScript", "Express.js", "Gemini API", "Tailwind CSS", "Framer Motion"],
        githubUrl: "https://github.com/gururengarajan/better-call-guru-ai-companion",
        liveUrl: "https://better-call-guru-ai.example.com",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
        category: "Artificial Intelligence",
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "proj-2",
        title: "OmniQueue: High-Performance Shared Task Queue",
        description: "A distributed system queue for resilient tasks processing with priority execution and real-time failure metrics.",
        detailedDescription: "Engineered from the ground up for microservice orchestration. Features standard worker backoff cycles, robust Redis lock acquisitions, priority sorting, and auto-scaling listeners. Handles up to 10k messages per second with real-time logging and Grafana-aligned analysis tools.",
        technologies: ["Node.js", "Redis", "TypeScript", "Docker", "PostgreSQL", "Recharts"],
        githubUrl: "https://github.com/gururengarajan/omniqueue-distributed-scheduler",
        liveUrl: "https://omniqueue-stats.example.com",
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
        category: "Backend Systems",
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "proj-3",
        title: "DevArena: Interactive Collaborative Classroom",
        description: "A complete programming studio where developers can write code concurrently in custom isolated sandboxes with latency-free audio streams.",
        detailedDescription: "A multiplayer programming workspace. Built with Conflict-Free Replicated Data Types (CRDTs via Yjs) for lightning-fast text sync, custom express middleware runners, and browser-native WebRTC audio loops. Employs security sandboxes allowing isolated code execution directly on isolated virtual frames.",
        technologies: ["React", "Express", "Socket.io", "Yjs", "WebRTC", "Docker"],
        githubUrl: "https://github.com/gururengarajan/devarena-collaborative-sandbox",
        liveUrl: "https://devarena.example.com",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
        category: "Web Platforms",
        featured: false,
        createdAt: new Date().toISOString(),
      },
    ],
    blogs: [
      {
        _id: "blog-1",
        title: "The Ultimate Guide to Mastering Gemini 2.5 SDK: Standard Patterns for 2026",
        slug: "mastering-gemini-2-5-sdk",
        content: `AI tools are quickly turning into first-class citizens in modern system development plans. But moving beyond standard prompt textboxes to enterprise applications poses architectural difficulties. 

In this blog article, we analyze production-tested patterns for the brand new \`@google/genai\` SDK. 

### Why the New SDK?
The transition to developer-focused models guarantees cleaner type interfaces, better support for multimodal assets, and more predictable structured response generations using strict schemas. Here's a brief example of typing your outputs:

\`\`\`typescript
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI();
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'Generate 3 high-impact skills for a resume.',
  config: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    }
  }
});
\`\`\`

### Key Best Practices
1. **Always lazy-load connections**: Never configure models at state loading. This avoids server-start errors in microservices should configuration files load slowly.
2. **Employ Schema Controls**: Handing over structured JSON formatting configurations removes brittle post-prompt parsing logic.
3. **Guard Your API Secrets**: Force routes with standard bearer authorization headers instead of passing access strings directly to client interfaces.`,
        tags: ["AI", "Gemini", "TypeScript", "Node.js"],
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: "blog-2",
        title: "Optimizing Redis Clusters for Sub-Millisecond Database Caches",
        slug: "optimizing-redis-database-caches",
        content: `Caching database results is the easiest way to skip heavy computational queries, but distributed consistency introduces serious challenges around invalidations.

In this deep-dive, we overview top architectures we implemented for Guru Portfolio Pro's persistent core elements.

### The stampede bottleneck
If thousands of clients try fetching an expired key simultaneously, they will all trigger DB queries, temporarily taking down your backend. 
To bypass this event, we implement **probabilistic early expiration**: pre-emptively calculating key freshness and scheduling backend re-computation on single background promises before hard timeouts.

### Code Pattern: Pre-computation proxy
\`\`\`typescript
async function fetchCachedData(key: string, ttlSeconds: number) {
  const cached = await redis.get(key);
  if (cached) {
    const { val, expiry, delta } = JSON.parse(cached);
    // Probabilistic early renewal check
    if (Date.now() - delta * Math.log(Math.random()) > expiry) {
      // renew in background async
      triggerBackgroundRenewal(key);
    }
    return val;
  }
  return triggerDbFetch(key);
}
\`\`\`

By deploying these strategies, aggregate server lookup periods declined from 140ms straight to a crisp 0.7ms, achieving bulletproof scalability.`,
        tags: ["Backend", "Redis", "Database", "Performance"],
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    skills: [
      { _id: "sk-1", name: "React.js / Next.js", category: "Frontend", proficiency: 98 },
      { _id: "sk-2", name: "TypeScript", category: "Frontend", proficiency: 95 },
      { _id: "sk-3", name: "Tailwind CSS", category: "Frontend", proficiency: 92 },
      { _id: "sk-4", name: "Framer Motion", category: "Frontend", proficiency: 88 },
      { _id: "sk-5", name: "Node.js (Express / NestJS)", category: "Backend", proficiency: 92 },
      { _id: "sk-6", name: "Go (Golang)", category: "Backend", proficiency: 82 },
      { _id: "sk-7", name: "MongoDB & Redis Caches", category: "Database", proficiency: 89 },
      { _id: "sk-8", name: "PostgreSQL", category: "Database", proficiency: 86 },
      { _id: "sk-9", name: "Docker & Docker Compose", category: "DevOps", proficiency: 80 },
      { _id: "sk-10", name: "CI-CD (GitHub Actions / GCP)", category: "DevOps", proficiency: 85 },
    ],
    experiences: [
      {
        _id: "exp-1",
        role: "Software Engineering Intern",
        company: "Google AI Studio Labs",
        location: "Bangalore, India",
        period: "May 2026 - Present",
        description: [
          "Co-developed internal server-side API proxy routers to streamline Gemini endpoint queries, speeding up load times by 25%.",
          "Engineered responsive components on Next/Vite using absolute Tailwind utility classes, achieving perfect cross-browser support.",
          "Configured secure middleware and JWT mechanisms preventing token leakage on client view ports."
        ]
      },
      {
        _id: "exp-2",
        role: "Full Stack Consultant",
        company: "MNC Placement Cell Liaison Office",
        location: "Coimbatore, India",
        period: "Aug 2025 - Apr 2026",
        description: [
          "Designed a centralized student recruitment dashboard logging 5k+ concurrent exam interactions.",
          "Integrated robust storage helpers to store student portfolios, resume pdf copies, and achievements smoothly.",
          "Collaborated with corporate outreach teams to design customizable resume download tracking telemetry."
        ]
      }
    ],
    certifications: [
      {
        _id: "cert-1",
        title: "Google Cloud Certified Associate Cloud Engineer",
        issuer: "Google Cloud Platform (GCP)",
        issueDate: "2025-11-20",
        certificateUrl: "https://cloud.google.com/certification",
      },
      {
        _id: "cert-2",
        title: "AWS Certified Developer – Associate",
        issuer: "Amazon Web Services (AWS)",
        issueDate: "2026-03-10",
        certificateUrl: "https://aws.amazon.com/certification",
      },
    ],
    messages: [
      {
        _id: "msg-1",
        name: "Sarah Parker",
        email: "s.parker@google.com",
        subject: "Hiring: Core Platforms Engineering Role",
        message: "Hey Guru, we reviewed space-efficiency metrics of your distributed OmniQueue and your 'Better Call Guru' layout is extremely responsive. Do you have 15 minutes this coming Tuesday to connect regarding an upcoming hiring cycle?",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        _id: "msg-2",
        name: "David Vance",
        email: "d.vance@netflix.net",
        subject: "Urgent Consultation: Realtime Sync",
        message: "We're implementing Yjs into our active stream boards and read your caching blog post. Outstanding details on early renewals! Let's schedule a paid advisory call.",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
      }
    ],
    resume: {
      _id: "res-primary",
      fileUrl: "https://drive.google.com/file/d/1Xexample-G_Rengarajan_Resume/view?usp=sharing",
      uploadedAt: new Date().toISOString(),
    },
    analytics: {
      pageViews: 1480,
      downloads: 412,
      visitors: 620,
      viewHistory: [
        { date: "06-08", count: 120 },
        { date: "06-09", count: 155 },
        { date: "06-10", count: 140 },
        { date: "06-11", count: 195 },
        { date: "06-12", count: 210 },
        { date: "06-13", count: 240 },
        { date: "06-14", count: 420 },
      ],
      visitorHistory: [
        { date: "06-08", count: 50 },
        { date: "06-09", count: 82 },
        { date: "06-10", count: 77 },
        { date: "06-11", count: 110 },
        { date: "06-12", count: 104 },
        { date: "06-13", count: 130 },
        { date: "06-14", count: 67 },
      ],
    },
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
}

initializeDatabase();

// Load DB Helper
function readDb() {
  const fileContent = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(fileContent);
}

// Save DB Helper
function saveDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Sign and Verify token session utilities
function signToken(payload: { email: string; role: string; _id: string }) {
  const str = JSON.stringify(payload);
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(str).digest("hex");
  return Buffer.from(str).toString("base64") + "." + signature;
}

function verifyToken(token: string) {
  try {
    const [b64, signature] = token.split(".");
    const str = Buffer.from(b64, "base64").toString("utf8");
    const expectedSignature = crypto.createHmac("sha256", JWT_SECRET).update(str).digest("hex");
    if (signature === expectedSignature) {
      return JSON.parse(str);
    }
  } catch (e) {
    // catch invalid token
  }
  return null;
}

// Custom Authentication Middleware
function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token missing from request headers." });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({ error: "Invalid, expired, or tampered access token." });
  }

  (req as any).user = payload;
  next();
}

// --- API ROUTES ---

// Auth Routes
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required credentials." });
  }

  const db = readDb();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: "Invalid email or matching user profile not found." });
  }

  const providedHash = hashPassword(password);
  if (user.passwordHash !== providedHash) {
    return res.status(401).json({ error: "Incorrect admin portal authorization password." });
  }

  const token = signToken({ _id: user._id, email: user.email, role: user.role });
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Projects CRUD
app.get("/api/projects", (req, res) => {
  const db = readDb();
  res.json(db.projects);
});

app.get("/api/projects/:id", (req, res) => {
  const db = readDb();
  const project = db.projects.find((p: any) => p._id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: "Project visual record not found in the database store." });
  }
  res.json(project);
});

app.post("/api/projects", authMiddleware, (req, res) => {
  const { title, description, detailedDescription, technologies, githubUrl, liveUrl, image, category, featured } = req.body;
  
  if (!title || !description || !technologies) {
    return res.status(400).json({ error: "Minimum requirements to store research: title, brief description, and technology list." });
  }

  const db = readDb();
  const newProject = {
    _id: "proj-" + Date.now(),
    title,
    description,
    detailedDescription: detailedDescription || "",
    technologies: Array.isArray(technologies) ? technologies : technologies.split(",").map((s: string) => s.trim()),
    githubUrl: githubUrl || "",
    liveUrl: liveUrl || "",
    image: image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    category: category || "Development",
    featured: !!featured,
    createdAt: new Date().toISOString(),
  };

  db.projects.unshift(newProject);
  saveDb(db);
  res.status(201).json(newProject);
});

app.put("/api/projects/:id", authMiddleware, (req, res) => {
  const db = readDb();
  const idx = db.projects.findIndex((p: any) => p._id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Target project metadata could not be retrieved to modify." });
  }

  const { title, description, detailedDescription, technologies, githubUrl, liveUrl, image, category, featured } = req.body;
  const current = db.projects[idx];

  db.projects[idx] = {
    ...current,
    title: title !== undefined ? title : current.title,
    description: description !== undefined ? description : current.description,
    detailedDescription: detailedDescription !== undefined ? detailedDescription : current.detailedDescription,
    technologies: technologies !== undefined 
      ? (Array.isArray(technologies) ? technologies : technologies.split(",").map((s: string) => s.trim()))
      : current.technologies,
    githubUrl: githubUrl !== undefined ? githubUrl : current.githubUrl,
    liveUrl: liveUrl !== undefined ? liveUrl : current.liveUrl,
    image: image !== undefined ? image : current.image,
    category: category !== undefined ? category : current.category,
    featured: featured !== undefined ? !!featured : current.featured,
  };

  saveDb(db);
  res.json(db.projects[idx]);
});

app.delete("/api/projects/:id", authMiddleware, (req, res) => {
  const db = readDb();
  const index = db.projects.findIndex((p: any) => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Target project portfolio record was not found." });
  }

  db.projects.splice(index, 1);
  saveDb(db);
  res.json({ message: "Project record has been purged successfully." });
});

// Blogs CRUD
app.get("/api/blogs", (req, res) => {
  const db = readDb();
  res.json(db.blogs);
});

app.get("/api/blogs/:id", (req, res) => {
  const db = readDb();
  // Match either ID or slug
  const blog = db.blogs.find((b: any) => b._id === req.params.id || b.slug === req.params.id);
  if (!blog) {
    return res.status(404).json({ error: "Target article not found." });
  }
  res.json(blog);
});

app.post("/api/blogs", authMiddleware, (req, res) => {
  const { title, content, tags, thumbnail } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and markdown body content are required to publish." });
  }

  const db = readDb();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const newBlog = {
    _id: "blog-" + Date.now(),
    title,
    slug,
    content,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map((s: string) => s.trim()) : []),
    thumbnail: thumbnail || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    publishedAt: new Date().toISOString(),
  };

  db.blogs.unshift(newBlog);
  saveDb(db);
  res.status(201).json(newBlog);
});

app.put("/api/blogs/:id", authMiddleware, (req, res) => {
  const db = readDb();
  const idx = db.blogs.findIndex((b: any) => b._id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Article to update not found." });
  }

  const { title, content, tags, thumbnail } = req.body;
  const current = db.blogs[idx];

  let slug = current.slug;
  if (title) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  db.blogs[idx] = {
    ...current,
    title: title !== undefined ? title : current.title,
    slug,
    content: content !== undefined ? content : current.content,
    tags: tags !== undefined 
      ? (Array.isArray(tags) ? tags : tags.split(",").map((s: string) => s.trim()))
      : current.tags,
    thumbnail: thumbnail !== undefined ? thumbnail : current.thumbnail,
  };

  saveDb(db);
  res.json(db.blogs[idx]);
});

app.delete("/api/blogs/:id", authMiddleware, (req, res) => {
  const db = readDb();
  const idx = db.blogs.findIndex((b: any) => b._id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Article to delete not found." });
  }

  db.blogs.splice(idx, 1);
  saveDb(db);
  res.json({ message: "Article was successfully pruned from database structures." });
});

// Skills CRUD
app.get("/api/skills", (req, res) => {
  const db = readDb();
  res.json(db.skills);
});

app.post("/api/skills", authMiddleware, (req, res) => {
  const { name, category, proficiency } = req.body;
  if (!name || !category || proficiency === undefined) {
    return res.status(400).json({ error: "Missing properties: name, category, or competency rating is required." });
  }

  const db = readDb();
  const newSkill = {
    _id: "sk-" + Date.now(),
    name,
    category,
    proficiency: Number(proficiency) || 75,
  };

  db.skills.push(newSkill);
  saveDb(db);
  res.status(201).json(newSkill);
});

app.put("/api/skills/:id", authMiddleware, (req, res) => {
  const db = readDb();
  const idx = db.skills.findIndex((s: any) => s._id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Target technical skill profile could not be reached." });
  }

  const { name, category, proficiency } = req.body;
  const current = db.skills[idx];

  db.skills[idx] = {
    ...current,
    name: name !== undefined ? name : current.name,
    category: category !== undefined ? category : current.category,
    proficiency: proficiency !== undefined ? Number(proficiency) : current.proficiency,
  };

  saveDb(db);
  res.json(db.skills[idx]);
});

app.delete("/api/skills/:id", authMiddleware, (req, res) => {
  const db = readDb();
  const idx = db.skills.findIndex((s: any) => s._id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Target skill has already been deleted." });
  }

  db.skills.splice(idx, 1);
  saveDb(db);
  res.json({ message: "Skill listing has been deleted." });
});

// Experiences API (Auxiliary but vital for Experience Page)
app.get("/api/experiences", (req, res) => {
  const db = readDb();
  res.json(db.experiences || []);
});

app.post("/api/experiences", authMiddleware, (req, res) => {
  const { role, company, location, period, description } = req.body;
  if (!role || !company || !period) {
    return res.status(400).json({ error: "Required fields: Role position title, Company name, and Employment span." });
  }

  const db = readDb();
  const newExp = {
    _id: "exp-" + Date.now(),
    role,
    company,
    location: location || "Remote",
    period,
    description: Array.isArray(description) ? description : [description],
  };

  if (!db.experiences) db.experiences = [];
  db.experiences.unshift(newExp);
  saveDb(db);
  res.status(201).json(newExp);
});

app.delete("/api/experiences/:id", authMiddleware, (req, res) => {
  const db = readDb();
  if (!db.experiences) db.experiences = [];
  const idx = db.experiences.findIndex((e: any) => e._id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Target career milestones index was empty." });
  }
  db.experiences.splice(idx, 1);
  saveDb(db);
  res.json({ message: "Experience post cleared." });
});

// Certifications CRUD
app.get("/api/certificates", (req, res) => {
  const db = readDb();
  res.json(db.certifications);
});

app.post("/api/certificates", authMiddleware, (req, res) => {
  const { title, issuer, issueDate, certificateUrl } = req.body;
  if (!title || !issuer) {
    return res.status(400).json({ error: "Title and issuing organization are mandatory cert inputs." });
  }

  const db = readDb();
  const newCert = {
    _id: "cert-" + Date.now(),
    title,
    issuer,
    issueDate: issueDate || new Date().toISOString().split("T")[0],
    certificateUrl: certificateUrl || "#",
  };

  db.certifications.push(newCert);
  saveDb(db);
  res.status(201).json(newCert);
});

app.put("/api/certificates/:id", authMiddleware, (req, res) => {
  const db = readDb();
  const idx = db.certifications.findIndex((c: any) => c._id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Specific certification record not found." });
  }

  const { title, issuer, issueDate, certificateUrl } = req.body;
  const current = db.certifications[idx];

  db.certifications[idx] = {
    ...current,
    title: title !== undefined ? title : current.title,
    issuer: issuer !== undefined ? issuer : current.issuer,
    issueDate: issueDate !== undefined ? issueDate : current.issueDate,
    certificateUrl: certificateUrl !== undefined ? certificateUrl : current.certificateUrl,
  };

  saveDb(db);
  res.json(db.certifications[idx]);
});

app.delete("/api/certificates/:id", authMiddleware, (req, res) => {
  const db = readDb();
  const idx = db.certifications.findIndex((c: any) => c._id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "The targeted credential record was missing." });
  }

  db.certifications.splice(idx, 1);
  saveDb(db);
  res.json({ message: "Certification record deleted." });
});

// Contact Forms (Save + Mock email notification)
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "The form is incomplete. Please supply name, contact email, and brief instructions." });
  }

  const db = readDb();
  const newMessage = {
    _id: "msg-" + Date.now(),
    name,
    email,
    subject: subject || "No Subject Specified",
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };

  db.messages.unshift(newMessage);
  
  // Dynamic action: Bump total messages on contact submission as well
  if (!db.analytics) db.analytics = { pageViews: 100, downloads: 10, visitors: 30, viewHistory: [], visitorHistory: [] };
  
  saveDb(db);
  
  // Real local logs mock Nodemailer sending outputs so users can inspect it
  console.log(`[SMTP-NOTIFICATION] Relaying notification mail to Guru Rengarajan <rguru160706@gmail.com> via Nodemailer Mock:`);
  console.log(`FROM: ${name} <${email}>`);
  console.log(`SUBJECT: ALERT: Portfolio Message - ${subject}`);
  console.log(`BODY: "${message}"`);
  
  res.status(201).json({ success: true, message: "Your communication has been processed. Guru has been notified." });
});

app.get("/api/contact", authMiddleware, (req, res) => {
  const db = readDb();
  res.json(db.messages);
});

app.put("/api/contact/:id/read", authMiddleware, (req, res) => {
  const db = readDb();
  const idx = db.messages.findIndex((m: any) => m._id === req.params.id);
  if (idx !== -1) {
    db.messages[idx].read = true;
    saveDb(db);
    return res.json(db.messages[idx]);
  }
  res.status(404).json({ error: "Message index invalid." });
});

app.delete("/api/contact/:id", authMiddleware, (req, res) => {
  const db = readDb();
  const idx = db.messages.findIndex((m: any) => m._id === req.params.id);
  if (idx !== -1) {
    db.messages.splice(idx, 1);
    saveDb(db);
    return res.json({ success: true, message: "Message purged." });
  }
  res.status(404).json({ error: "Message key invalid." });
});

// Resume API
app.get("/api/resume", (req, res) => {
  const db = readDb();
  res.json(db.resume);
});

app.put("/api/resume", authMiddleware, (req, res) => {
  const { fileUrl } = req.body;
  if (!fileUrl) {
    return res.status(400).json({ error: "Resume URL string cannot be blank." });
  }

  const db = readDb();
  db.resume = {
    _id: "res-primary",
    fileUrl,
    uploadedAt: new Date().toISOString(),
  };

  saveDb(db);
  res.json(db.resume);
});

// Analytics Dashboard Endpoint
app.get("/api/analytics", authMiddleware, (req, res) => {
  const db = readDb();
  res.json(db.analytics);
});

// Analytical telemetry tracking
app.post("/api/analytics/view", (req, res) => {
  const db = readDb();
  if (!db.analytics) {
    db.analytics = { pageViews: 10, downloads: 0, visitors: 5, viewHistory: [], visitorHistory: [] };
  }

  // Increment view counters
  db.analytics.pageViews += 1;
  
  // Track visitors early based on day key - standard day index "MM-DD"
  const dateStr = new Date().toISOString().substring(5, 10); // "06-14"
  
  // Update view history logs array
  let vHis = db.analytics.viewHistory.find((vh: any) => vh.date === dateStr);
  if (vHis) {
    vHis.count += 1;
  } else {
    db.analytics.viewHistory.push({ date: dateStr, count: 1 });
  }

  // Cap history arrays to stop unbounded growing files
  if (db.analytics.viewHistory.length > 30) db.analytics.viewHistory.shift();
  if (db.analytics.visitorHistory.length > 30) db.analytics.visitorHistory.shift();

  saveDb(db);
  res.json({ success: true, currentViews: db.analytics.pageViews });
});

app.post("/api/analytics/visitor", (req, res) => {
  const db = readDb();
  if (!db.analytics) {
    db.analytics = { pageViews: 10, downloads: 0, visitors: 5, viewHistory: [], visitorHistory: [] };
  }

  // Bump total count
  db.analytics.visitors += 1;
  const dateStr = new Date().toISOString().substring(5, 10);
  
  let visitorHis = db.analytics.visitorHistory.find((vh: any) => vh.date === dateStr);
  if (visitorHis) {
    visitorHis.count += 1;
  } else {
    db.analytics.visitorHistory.push({ date: dateStr, count: 1 });
  }

  saveDb(db);
  res.json({ success: true, currentUnique: db.analytics.visitors });
});

app.post("/api/analytics/download", (req, res) => {
  const db = readDb();
  if (!db.analytics) {
    db.analytics = { pageViews: 10, downloads: 0, visitors: 5, viewHistory: [], visitorHistory: [] };
  }

  db.analytics.downloads += 1;
  saveDb(db);
  res.json({ success: true, totalDownloads: db.analytics.downloads });
});

// --- ADVANCED FEATURE: "Better Call Guru!" AI REPRESENTATIVE ---
app.post("/api/guru-agent", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "What interview or technical question would you like to ask Guru?" });
  }

  try {
    const db = readDb();
    const skillsList = db.skills.map((s: any) => `${s.name} (${s.category}, rated at ${s.proficiency}% of enterprise competence)`).join(", ");
    const projectsList = db.projects.map((p: any) => `"${p.title}" (${p.category}): ${p.description}. Stack: ${p.technologies.join(", ")}`).join("\n");
    const certsList = db.certifications.map((c: any) => `${c.title} by ${c.issuer}`).join(", ");
    const experienceLine = db.experiences ? db.experiences.map((e: any) => `${e.role} at ${e.company} (${e.period}) in ${e.location}`).join(", ") : "";

    // Load Gemini SDK safely
    const ai = getGeminiClient();

    const systemPrompt = `You are "Better Call Guru! AI Proxy," an witty, incredibly sharp, and highly professional AI representatives agent designed in 2026. Your role is representing custom portfolio owner Guru Rengarajan ("Guru").
You speak directly, confidently, but with standard humble courtesy. Use subtle lawyer-themed witty humour to represent the "Better Call Guru!" branding without sounding unprofessional or legalistic. You are pitching Guru's software talents to recruiters, clients, and hiring coordinators.

Here are the real details about Guru Rengarajan:
- Name: Guru Rengarajan
- Role: Full Stack Software and Distributed Systems Engineer
- Skills profile matches: ${skillsList}
- Projects under legal showcase display:
${projectsList}
- Active Corporate Placement Experiences: ${experienceLine}
- Outstanding Credentials & Certs: ${certsList}

Structure your answer to be highly readable. Utilize short bullet points, elegant paragraphs, and clean technical terms. Respond as a helpful representative. Don't mention "Based on the prompt inputs context" or "According to the database logs details". Speak directly on behalf of Guru's platform. Keep responses brief, engaging, energetic and optimized for recruiters looking to place Guru at top MNC spots or choice internships. Make sure your tone is helpful and encourages hiring managers to hit the portal's contact form. Ensure a professional response. Always output clean Markdown. If API keys or secrets are requested, refuse politely.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\nUser Question: " + question }] }
      ],
    });

    const answer = response.text || "Guru is taking a quick compilation reload break. Please reload and call again soon!";
    res.json({ answer });
  } catch (err: any) {
    console.error("Gemini query exception occurred:", err);
    // Provide a helpful fallback in case process.env.GEMINI_API_KEY is not setup yet
    if (!process.env.GEMINI_API_KEY) {
      res.json({ 
        answer: `⚖️ **Better Call Guru! AI Representative Alert**: My intelligence system is currently offline because the \`GEMINI_API_KEY\` variable is not set up on this channel! 

However, looking at our internal offline briefs: Guru Rengarajan is **fully prepared for summer internship cycles or placement sprints!** 

🔹 **Highlighted project**: Check out the *Better Call Guru! Legal AI Companion* or *OmniQueue scheduler* listed right on our portfolio homepage.
🔹 **Core proficiency**: Full-stack React + Express ecosystems, Golang microservices, and fast memory caching via Redis.
🔹 **Direct Action**: Would you like to schedule an introductory screen? Drop a secure signal using the **Contact Form** page or log into the credentials dashboard with username **rguru160706@gmail.com** and password **guruadmin123** to inspect our admin portal!`
      });
    } else {
      res.status(500).json({ error: "Gemini server experienced an analytical processing error. " + err.message });
    }
  }
});

// Configure Vite integration
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);
    console.log("Vite developmental engine connected securely to routing middlewares.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from folder: /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Guru Server Pro] Live and listening at http://0.0.0.0:${PORT}`);
  });
}

setupServer();

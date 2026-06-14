export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  image: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  thumbnail: string;
  publishedAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Others';
  proficiency: number; // 0 to 100
}

export interface Certification {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  certificateUrl: string;
}

export interface Experience {
  _id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Resume {
  _id: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Analytics {
  pageViews: number;
  downloads: number;
  visitors: number;
  viewHistory: { date: string; count: number }[];
  visitorHistory: { date: string; count: number }[];
}

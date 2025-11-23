export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
}

export interface Resume {
  id: number;
  userId: number;
  title: string;
  template: string;
  content: ResumeContent;
  updatedAt: string;
  createdAt: string;
}

export interface ResumeContent {
  contact?: ContactInfo;
  summary?: string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  skills?: string[];
  projects?: ProjectItem[];
}

export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
}

export interface ExperienceItem {
  company: string;
  title: string;
  from: string;
  to: string;
  html: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  from: string;
  to: string;
  html?: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  html?: string;
}

export interface Template {
  name: string;
  label: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

import { SkillCategory, Skill } from '../types/skill';

// Skill Categories with visual configuration
export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    name: 'Programming Languages',
    color: '#3B82F6', // Blue
    side: 'left',
    branchAngle: -35,
    skills: []
  },
  {
    id: 'ai',
    name: 'AI & Machine Learning',
    color: '#67E8F9', // Cyan
    side: 'left',
    branchAngle: -50,
    skills: []
  },
  {
    id: 'cloud',
    name: 'Cloud Platforms',
    color: '#A78BFA', // Purple
    side: 'right',
    branchAngle: 40,
    skills: []
  },
  {
    id: 'devops',
    name: 'DevOps & Automation',
    color: '#F59E0B', // Amber
    side: 'left',
    branchAngle: -20,
    skills: []
  },
  {
    id: 'frontend',
    name: 'Web Development',
    color: '#10B981', // Green
    side: 'right',
    branchAngle: 30,
    skills: []
  },
  {
    id: 'backend',
    name: 'Back-End',
    color: '#EC4899', // Pink
    side: 'right',
    branchAngle: 50,
    skills: []
  }
];

// All skills with metadata
export const allSkills: Skill[] = [
  // Programming Languages
  { id: 'python', name: 'Python', categoryId: 'languages', level: 5, years: 5 },
  { id: 'r', name: 'R', categoryId: 'languages', level: 3, years: 2 },
  { id: 'java', name: 'Java', categoryId: 'languages', level: 3, years: 3 },
  { id: 'javascript', name: 'JavaScript', categoryId: 'languages', level: 4, years: 3 },
  { id: 'typescript', name: 'TypeScript', categoryId: 'languages', level: 4, years: 2 },
  { id: 'powershell', name: 'PowerShell', categoryId: 'languages', level: 4, years: 4 },
  { id: 'bash', name: 'Shell/Bash', categoryId: 'languages', level: 4, years: 4 },

  // AI & Machine Learning
  { id: 'ai-security', name: 'AI Security', categoryId: 'ai', level: 5, years: 2 },
  { id: 'gen-ai', name: 'Generative AI', categoryId: 'ai', level: 5, years: 2 },
  { id: 'nlp', name: 'NLP', categoryId: 'ai', level: 4, years: 3 },
  { id: 'ml', name: 'Machine Learning', categoryId: 'ai', level: 4, years: 3 },
  { id: 'dl', name: 'Deep Learning', categoryId: 'ai', level: 3, years: 2 },
  { id: 'cv', name: 'Computer Vision', categoryId: 'ai', level: 3, years: 2 },
  { id: 'ai-agents', name: 'AI Agents', categoryId: 'ai', level: 5, years: 2 },
  { id: 'function-calling', name: 'Function Calling', categoryId: 'ai', level: 4, years: 2 },
  { id: 'rag', name: 'RAG', categoryId: 'ai', level: 5, years: 2 },
  { id: 'langchain', name: 'LangChain', categoryId: 'ai', level: 4, years: 2 },
  { id: 'langgraph', name: 'LangGraph', categoryId: 'ai', level: 4, years: 1 },

  // Cloud Platforms
  { id: 'aws', name: 'AWS', categoryId: 'cloud', level: 5, years: 5 },
  { id: 'gcp', name: 'GCP', categoryId: 'cloud', level: 4, years: 3 },
  { id: 'azure', name: 'Azure', categoryId: 'cloud', level: 4, years: 4 },
  { id: 'oci', name: 'OCI', categoryId: 'cloud', level: 3, years: 2 },

  // DevOps & Automation
  { id: 'cicd', name: 'CI/CD', categoryId: 'devops', level: 5, years: 4 },
  { id: 'iac', name: 'Infrastructure as Code', categoryId: 'devops', level: 5, years: 4 },
  { id: 'docker', name: 'Docker', categoryId: 'devops', level: 5, years: 4 },
  { id: 'kubernetes', name: 'Kubernetes', categoryId: 'devops', level: 4, years: 3 },
  { id: 'terraform', name: 'Terraform', categoryId: 'devops', level: 5, years: 4 },
  { id: 'ansible', name: 'Ansible', categoryId: 'devops', level: 4, years: 3 },
  { id: 'jenkins', name: 'Jenkins', categoryId: 'devops', level: 4, years: 3 },
  { id: 'azure-devops', name: 'Azure DevOps', categoryId: 'devops', level: 4, years: 3 },
  { id: 'github-actions', name: 'GitHub Actions', categoryId: 'devops', level: 4, years: 2 },
  { id: 'lambda', name: 'AWS Lambda', categoryId: 'devops', level: 5, years: 4 },
  { id: 'boto3', name: 'Boto3', categoryId: 'devops', level: 5, years: 4 },

  // Web Development
  { id: 'html', name: 'HTML', categoryId: 'frontend', level: 5, years: 5 },
  { id: 'css', name: 'CSS', categoryId: 'frontend', level: 5, years: 5 },
  { id: 'js-frontend', name: 'JavaScript', categoryId: 'frontend', level: 4, years: 3 },
  { id: 'react', name: 'React', categoryId: 'frontend', level: 4, years: 2 },
  { id: 'nextjs', name: 'Next.js', categoryId: 'frontend', level: 3, years: 1 },
  { id: 'nodejs', name: 'Node.js', categoryId: 'frontend', level: 4, years: 2 },
  { id: 'express', name: 'Express', categoryId: 'frontend', level: 4, years: 2 },

  // Back-End
  { id: 'nodejs-backend', name: 'Node.js', categoryId: 'backend', level: 4, years: 2 },
  { id: 'mongodb', name: 'MongoDB', categoryId: 'backend', level: 4, years: 3 },
  { id: 'postgresql', name: 'PostgreSQL', categoryId: 'backend', level: 4, years: 3 },
  { id: 'mysql', name: 'MySQL', categoryId: 'backend', level: 4, years: 3 },
  { id: 'redis', name: 'Redis', categoryId: 'backend', level: 3, years: 2 },
  { id: 'django', name: 'Django', categoryId: 'backend', level: 4, years: 3 },
  { id: 'fastapi', name: 'FastAPI', categoryId: 'backend', level: 5, years: 3 },
  { id: 'flask', name: 'Flask', categoryId: 'backend', level: 4, years: 3 },
  { id: 'rest-api', name: 'REST API', categoryId: 'backend', level: 5, years: 5 },
  { id: 'streamlit', name: 'Streamlit', categoryId: 'backend', level: 5, years: 2 }
];

// Helper function to get skills by category
export const getSkillsByCategory = (categoryId: string): Skill[] => {
  return allSkills.filter(skill => skill.categoryId === categoryId);
};

// Helper function to get category by id
export const getCategoryById = (categoryId: string): SkillCategory | undefined => {
  return skillCategories.find(cat => cat.id === categoryId);
};

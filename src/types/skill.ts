export interface Skill {
  id: string;
  name: string;
  categoryId: string;
  level: 1 | 2 | 3 | 4 | 5;
  years?: number;
  icon?: string;
  description?: string;
  projects?: string[];
  certifications?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  color: string;
  side: 'left' | 'right';
  branchAngle: number;
  skills: string[];
}

export interface SkillPosition {
  skillId: string;
  x: number;
  y: number;
  stemLength: number;
}

export interface BranchPath {
  categoryId: string;
  path: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

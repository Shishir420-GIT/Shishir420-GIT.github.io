import { Skill, SkillPosition, BranchPath } from '../types/skill';
import { getPointsAlongBranch } from './branchGenerator';

/**
 * Places skill fruits along branches automatically with proper spacing
 */
export const placeSkillsOnBranch = (
  branch: BranchPath,
  skills: Skill[]
): SkillPosition[] => {
  if (skills.length === 0) return [];

  const positions: SkillPosition[] = [];

  // Limit to 8 skills per branch to avoid overcrowding
  const displaySkills = skills.slice(0, 8);
  const points = getPointsAlongBranch(branch, displaySkills.length);

  displaySkills.forEach((skill, index) => {
    const point = points[index];
    if (!point) return;

    // Stem length varies by skill level (larger skills hang lower)
    const stemLength = 30 + (skill.level * 8);

    // Add slight vertical offset for visual variety
    const verticalOffset = (index % 2) * 15;

    positions.push({
      skillId: skill.id,
      x: point.x,
      y: point.y + stemLength + verticalOffset,
      stemLength: stemLength + verticalOffset
    });
  });

  return positions;
};

/**
 * Gets fruit size based on skill level
 */
export const getFruitSize = (level: 1 | 2 | 3 | 4 | 5): number => {
  const sizeMap = {
    1: 24,
    2: 28,
    3: 34,
    4: 40,
    5: 48
  };

  return sizeMap[level];
};

/**
 * Gets fruit glow intensity based on level
 */
export const getFruitGlow = (level: 1 | 2 | 3 | 4 | 5): number => {
  return level >= 4 ? 8 : 0;
};

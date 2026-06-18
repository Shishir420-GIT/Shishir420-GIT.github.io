import { useState } from 'react';
import { motion } from 'framer-motion';
import TreeTrunk from './trunk/TreeTrunk';
import CategoryBranch from './branches/CategoryBranch';
import SkillFruit from './fruits/SkillFruit';
import { skillCategories, allSkills, getSkillsByCategory } from '../../constants/skillTreeData';
import { generateBranch } from '../../engine/branchGenerator';
import { placeSkillsOnBranch } from '../../engine/fruitPlacement';
import { Skill, BranchPath, SkillPosition } from '../../types/skill';
import './SkillForest.css';

const SkillForest = () => {
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Tree configuration
  const TRUNK_BASE_X = 800;
  const TRUNK_BASE_Y = 920;
  const TRUNK_TOP_X = 800;
  const TRUNK_TOP_Y = 400;

  // Generate branches for each category
  const branches: { [key: string]: BranchPath } = {};
  const skillPositions: { [key: string]: SkillPosition[] } = {};

  // Branch configuration - spread them out properly
  const branchConfig = [
    { categoryId: 'languages', startY: 650, angle: -45, length: 280 },
    { categoryId: 'ai', startY: 550, angle: -60, length: 300 },
    { categoryId: 'cloud', startY: 580, angle: 40, length: 280 },
    { categoryId: 'devops', startY: 720, angle: -30, length: 260 },
    { categoryId: 'frontend', startY: 700, angle: 50, length: 280 },
    { categoryId: 'backend', startY: 620, angle: 60, length: 300 }
  ];

  branchConfig.forEach((config) => {
    const category = skillCategories.find(c => c.id === config.categoryId);
    if (!category) return;

    // Generate main branch
    const branch = generateBranch(
      TRUNK_TOP_X,
      config.startY,
      config.angle,
      config.length,
      category.id
    );
    branches[category.id] = branch;

    // Get skills for this category
    const categorySkills = getSkillsByCategory(category.id);

    // Place skills along branch
    skillPositions[category.id] = placeSkillsOnBranch(branch, categorySkills);
  });

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
    // In future: open side panel with skill details
  };

  const handleSkillHover = (skill: Skill | null) => {
    setHoveredSkill(skill);
  };

  const handleCategoryHover = (categoryId: string, isHovered: boolean) => {
    setHoveredCategory(isHovered ? categoryId : null);
  };

  return (
    <div className="skill-forest-container">
      {/* Forest Background */}
      <div className="forest-background">
        <div className="gradient-overlay" />
      </div>

      {/* Main SVG Canvas */}
      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid meet"
        className="skill-tree-svg"
      >
        {/* Background definitions */}
        <defs>
          {/* Background gradient */}
          <linearGradient id="forestBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Atmospheric glow */}
          <radialGradient id="atmosphericGlow">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background rectangle */}
        <rect width="1600" height="1000" fill="url(#forestBg)" />

        {/* Atmospheric glow behind tree */}
        <circle
          cx={TRUNK_TOP_X}
          cy={TRUNK_TOP_Y - 100}
          r="400"
          fill="url(#atmosphericGlow)"
        />

        {/* Tree Trunk */}
        <TreeTrunk
          baseX={TRUNK_BASE_X}
          baseY={TRUNK_BASE_Y}
          topX={TRUNK_TOP_X}
          topY={TRUNK_TOP_Y}
          animate={true}
        />

        {/* Category Branches */}
        {skillCategories.map((category, index) => {
          const branch = branches[category.id];
          if (!branch) return null;

          return (
            <CategoryBranch
              key={category.id}
              branch={branch}
              color={category.color}
              animate={true}
              delay={index * 0.1}
              onHover={handleCategoryHover}
            />
          );
        })}

        {/* Skill Fruits */}
        {skillCategories.map((category, catIndex) => {
          const positions = skillPositions[category.id];
          if (!positions) return null;

          return positions.map((position, skillIndex) => {
            const skill = allSkills.find(s => s.id === position.skillId);
            if (!skill) return null;

            return (
              <SkillFruit
                key={skill.id}
                skill={skill}
                x={position.x}
                y={position.y}
                stemLength={position.stemLength}
                color={category.color}
                animate={true}
                delay={catIndex * 0.1 + skillIndex * 0.05}
                onClick={handleSkillClick}
                onHover={handleSkillHover}
              />
            );
          });
        })}
      </svg>

      {/* Tooltip */}
      {hoveredSkill && (
        <motion.div
          className="skill-tooltip"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <h3>{hoveredSkill.name}</h3>
          {hoveredSkill.years && (
            <p className="experience">{hoveredSkill.years} years experience</p>
          )}
          <div className="level-indicator">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`level-dot ${i < hoveredSkill.level ? 'active' : ''}`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SkillForest;

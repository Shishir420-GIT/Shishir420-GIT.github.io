import { motion } from 'framer-motion';
import { Skill } from '../../../types/skill';
import { getFruitSize, getFruitGlow } from '../../../engine/fruitPlacement';

interface SkillFruitProps {
  skill: Skill;
  x: number;
  y: number;
  stemLength: number;
  color: string;
  animate?: boolean;
  delay?: number;
  onClick?: (skill: Skill) => void;
  onHover?: (skill: Skill | null) => void;
}

const SkillFruit = ({
  skill,
  x,
  y,
  stemLength,
  color,
  animate = true,
  delay = 0,
  onClick,
  onHover
}: SkillFruitProps) => {
  const size = getFruitSize(skill.level);
  const glow = getFruitGlow(skill.level);
  const rx = size * 0.6;
  const ry = size * 0.5;

  return (
    <motion.g
      className="skill-fruit"
      initial={animate ? { opacity: 0, y: y - 50 } : undefined}
      animate={animate ? { opacity: 1, y } : undefined}
      transition={{
        duration: 0.6,
        delay: delay + 3,
        type: 'spring',
        stiffness: 100
      }}
      onClick={() => onClick?.(skill)}
      onMouseEnter={() => onHover?.(skill)}
      onMouseLeave={() => onHover?.(null)}
      style={{ cursor: 'pointer' }}
    >
      {/* Stem/Twig */}
      <motion.line
        x1={x}
        y1={y - stemLength}
        x2={x}
        y2={y - size / 2}
        stroke="#4E342E"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: delay + 3 }}
      />

      {/* Fruit shadow */}
      <ellipse
        cx={x + 2}
        cy={y + 2}
        rx={rx}
        ry={ry}
        fill="#000000"
        opacity={0.2}
      />

      {/* Fruit glow (for high-level skills) */}
      {glow > 0 && (
        <ellipse
          cx={x}
          cy={y}
          rx={rx + glow}
          ry={ry + glow}
          fill={color}
          opacity={0.3}
          filter="url(#fruitGlow)"
        >
          <animate
            attributeName="opacity"
            values="0.2;0.4;0.2"
            dur="2s"
            repeatCount="indefinite"
          />
        </ellipse>
      )}

      {/* Main fruit */}
      <motion.ellipse
        cx={x}
        cy={y}
        rx={rx}
        ry={ry}
        fill={`url(#fruitGradient-${skill.id})`}
        stroke={color}
        strokeWidth="2"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Fruit highlight */}
      <ellipse
        cx={x - rx * 0.3}
        cy={y - ry * 0.3}
        rx={rx * 0.3}
        ry={ry * 0.2}
        fill="#FFFFFF"
        opacity={0.4}
      />

      {/* Skill name label */}
      <motion.text
        x={x}
        y={y + size + 10}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="9"
        fontWeight="500"
        fontFamily="var(--font-sans)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 3.3 }}
        whileHover={{ scale: 1.1, fontWeight: 600 }}
      >
        {skill.name}
      </motion.text>

      {/* SVG Definitions */}
      <defs>
        {/* Fruit gradient */}
        <radialGradient id={`fruitGradient-${skill.id}`}>
          <stop offset="0%" stopColor={lightenColor(color, 30)} />
          <stop offset="70%" stopColor={color} />
          <stop offset="100%" stopColor={darkenColor(color, 20)} />
        </radialGradient>

        {/* Glow filter */}
        <filter id="fruitGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </motion.g>
  );
};

// Helper functions for color manipulation
const lightenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(R << 16 | G << 8 | B).toString(16).padStart(6, '0')}`;
};

const darkenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `#${(R << 16 | G << 8 | B).toString(16).padStart(6, '0')}`;
};

export default SkillFruit;

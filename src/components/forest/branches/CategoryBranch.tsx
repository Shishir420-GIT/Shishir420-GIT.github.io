import { motion } from 'framer-motion';
import { BranchPath } from '../../../types/skill';

interface CategoryBranchProps {
  branch: BranchPath;
  color: string;
  animate?: boolean;
  delay?: number;
  onHover?: (categoryId: string, isHovered: boolean) => void;
}

const CategoryBranch = ({
  branch,
  color,
  animate = true,
  delay = 0,
  onHover
}: CategoryBranchProps) => {
  return (
    <g className="category-branch">
      {/* Branch shadow */}
      <motion.path
        d={branch.path}
        stroke="#1A1A1A"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        opacity={0.3}
        transform="translate(2, 2)"
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animate ? { pathLength: 1, opacity: 0.3 } : undefined}
        transition={{ duration: 0.8, delay: delay + 1, ease: 'easeOut' }}
      />

      {/* Main branch */}
      <motion.path
        d={branch.path}
        stroke="url(#branchGradient)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0 } : undefined}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.8, delay: delay + 1, ease: 'easeOut' }}
        onMouseEnter={() => onHover?.(branch.categoryId, true)}
        onMouseLeave={() => onHover?.(branch.categoryId, false)}
        style={{ cursor: 'pointer' }}
      />

      {/* Highlight on hover */}
      <motion.path
        d={branch.path}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity={0}
        whileHover={{ opacity: 0.6 }}
        transition={{ duration: 0.2 }}
      />

      {/* SVG Definitions */}
      <defs>
        <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4E342E" />
          <stop offset="50%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#4E342E" />
        </linearGradient>
      </defs>
    </g>
  );
};

export default CategoryBranch;

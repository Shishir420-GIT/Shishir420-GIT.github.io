import { motion } from 'framer-motion';

interface TreeTrunkProps {
  baseX: number;
  baseY: number;
  topX: number;
  topY: number;
  animate?: boolean;
}

const TreeTrunk = ({ baseX, baseY, topX, topY, animate = true }: TreeTrunkProps) => {
  // Create organic trunk shape using path
  const trunkWidth = 40;
  const leftBase = baseX - trunkWidth / 2;
  const rightBase = baseX + trunkWidth / 2;
  const leftTop = topX - trunkWidth / 3;
  const rightTop = topX + trunkWidth / 3;

  const trunkPath = `
    M ${leftBase} ${baseY}
    C ${leftBase - 5} ${baseY - 100}, ${leftTop - 8} ${topY + 100}, ${leftTop} ${topY}
    L ${rightTop} ${topY}
    C ${rightTop + 8} ${topY + 100}, ${rightBase + 5} ${baseY - 100}, ${rightBase} ${baseY}
    Z
  `;

  return (
    <g className="tree-trunk">
      {/* Trunk shadow */}
      <motion.path
        d={trunkPath}
        fill="url(#trunkGradient)"
        filter="url(#trunkShadow)"
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* Trunk texture overlay */}
      <motion.path
        d={trunkPath}
        fill="url(#barkTexture)"
        opacity={0.3}
        initial={animate ? { opacity: 0 } : undefined}
        animate={animate ? { opacity: 0.3 } : undefined}
        transition={{ delay: 0.5, duration: 0.5 }}
      />

      {/* SVG Definitions */}
      <defs>
        {/* Trunk gradient */}
        <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3E2723" />
          <stop offset="50%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>

        {/* Bark texture pattern */}
        <pattern id="barkTexture" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="transparent" />
          <line x1="0" y1="5" x2="20" y2="8" stroke="#2C1810" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="15" x2="20" y2="12" stroke="#2C1810" strokeWidth="1" opacity="0.5" />
        </pattern>

        {/* Trunk shadow */}
        <filter id="trunkShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </g>
  );
};

export default TreeTrunk;

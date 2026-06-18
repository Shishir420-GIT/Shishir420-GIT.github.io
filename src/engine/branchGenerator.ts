import { BranchPath } from '../types/skill';

/**
 * Generates organic branch paths using Bezier curves
 */
export const generateBranch = (
  startX: number,
  startY: number,
  angle: number,
  length: number,
  categoryId: string
): BranchPath => {
  // Convert angle to radians
  const angleRad = (angle * Math.PI) / 180;

  // Calculate end point
  const endX = startX + length * Math.cos(angleRad);
  const endY = startY + length * Math.sin(angleRad);

  // Generate control points for Bezier curve
  const controlOffset = length * 0.4;
  const cp1X = startX + (controlOffset * Math.cos(angleRad - 0.3));
  const cp1Y = startY + (controlOffset * Math.sin(angleRad - 0.3));

  const cp2X = startX + (length * 0.6 * Math.cos(angleRad + 0.2));
  const cp2Y = startY + (length * 0.6 * Math.sin(angleRad + 0.2));

  // Create SVG path using Cubic Bezier curve
  const path = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

  return {
    categoryId,
    path,
    startX,
    startY,
    endX,
    endY
  };
};

/**
 * Generates multiple sub-branches from a main branch
 */
export const generateSubBranches = (
  mainBranch: BranchPath,
  count: number
): BranchPath[] => {
  const subBranches: BranchPath[] = [];
  const segmentLength = 80;

  for (let i = 0; i < count; i++) {
    // Calculate position along main branch (evenly distributed)
    const t = (i + 1) / (count + 1);

    // Interpolate along the branch path
    const pointX = mainBranch.startX + (mainBranch.endX - mainBranch.startX) * t;
    const pointY = mainBranch.startY + (mainBranch.endY - mainBranch.startY) * t;

    // Alternate angles for sub-branches
    const baseAngle = Math.atan2(
      mainBranch.endY - mainBranch.startY,
      mainBranch.endX - mainBranch.startX
    ) * (180 / Math.PI);

    const subAngle = baseAngle + (i % 2 === 0 ? 20 : -20);

    const subBranch = generateBranch(
      pointX,
      pointY,
      subAngle,
      segmentLength,
      `${mainBranch.categoryId}-sub-${i}`
    );

    subBranches.push(subBranch);
  }

  return subBranches;
};

/**
 * Calculates points along a Bezier curve for fruit placement
 */
export const getPointsAlongBranch = (
  branch: BranchPath,
  count: number
): Array<{ x: number; y: number; angle: number }> => {
  const points: Array<{ x: number; y: number; angle: number }> = [];

  // Parse the path to extract control points
  const pathMatch = branch.path.match(/M ([\d.]+) ([\d.]+) C ([\d.]+) ([\d.]+), ([\d.]+) ([\d.]+), ([\d.]+) ([\d.]+)/);

  if (!pathMatch) return points;

  const [, x0, y0, cp1x, cp1y, cp2x, cp2y, x1, y1] = pathMatch.map(Number);

  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1); // Evenly distribute along curve

    // Cubic Bezier curve formula: B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    const x = mt3 * x0 + 3 * mt2 * t * cp1x + 3 * mt * t2 * cp2x + t3 * x1;
    const y = mt3 * y0 + 3 * mt2 * t * cp1y + 3 * mt * t2 * cp2y + t3 * y1;

    // Calculate tangent angle for proper fruit orientation
    const dx = 3 * mt2 * (cp1x - x0) + 6 * mt * t * (cp2x - cp1x) + 3 * t2 * (x1 - cp2x);
    const dy = 3 * mt2 * (cp1y - y0) + 6 * mt * t * (cp2y - cp1y) + 3 * t2 * (y1 - cp2y);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    points.push({ x, y, angle });
  }

  return points;
};

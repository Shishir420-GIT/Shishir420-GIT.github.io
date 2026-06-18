import { motion } from 'framer-motion';

/**
 * SlideIn Animation Wrapper
 * Slides content in from specified direction
 */
const SlideIn = ({
  children,
  direction = 'left', // 'left', 'right', 'up', 'down'
  delay = 0,
  duration = 0.5,
  distance = 100,
  className = ''
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left':
        return { x: -distance, y: 0 };
      case 'right':
        return { x: distance, y: 0 };
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      default:
        return { x: -distance, y: 0 };
    }
  };

  const variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition()
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] // Custom ease-out curve
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;

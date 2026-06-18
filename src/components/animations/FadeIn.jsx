import { motion } from 'framer-motion';

/**
 * FadeIn Animation Wrapper
 * Fades content in with optional slide up
 */
const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  slideUp = 30,
  className = ''
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: slideUp
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;

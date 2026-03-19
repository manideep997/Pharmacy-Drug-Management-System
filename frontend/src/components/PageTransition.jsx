import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    z: -800,
    rotateX: -15,
    rotateY: 10,
    scale: 0.7,
  },
  in: {
    opacity: 1,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      restDelta: 0.001
    },
  },
  out: {
    opacity: 0,
    z: 800,
    rotateX: 15,
    rotateY: -10,
    scale: 1.3,
    transition: {
      type: "spring",
      stiffness: 250,
      damping: 20,
      mass: 0.8
    },
  },
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;

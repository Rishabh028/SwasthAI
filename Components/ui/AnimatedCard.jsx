import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AnimatedCard({ 
  children, 
  className, 
  delay = 0,
  hover = true,
  onClick,
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={hover ? { 
        y: -4, 
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1)'
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl shadow-sm border border-gray-100/50',
        'transition-colors duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
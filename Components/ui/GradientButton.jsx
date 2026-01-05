import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function GradientButton({ 
  children, 
  className, 
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  ...props 
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-500/25',
    secondary: 'bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-800 hover:to-slate-900',
    coral: 'bg-gradient-to-r from-coral-400 to-rose-400 text-white hover:from-coral-500 hover:to-rose-500 shadow-lg shadow-rose-400/25',
    outline: 'bg-white border-2 border-teal-500 text-teal-600 hover:bg-teal-50',
    ghost: 'bg-transparent text-teal-600 hover:bg-teal-50',
    glass: 'bg-white/80 backdrop-blur-sm border border-white/50 text-gray-800 hover:bg-white/90'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center gap-2',
        'font-semibold rounded-xl',
        'transition-all duration-300 ease-out',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      {children}
    </motion.button>
  );
}
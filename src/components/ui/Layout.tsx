import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-black border border-border rounded-2xl overflow-hidden transition-colors duration-200",
        hover && "hover:bg-zinc-900/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function FrostedButton({ children, className, variant = 'primary', ...props }: any) {
  const variants = {
    primary: "bg-primary text-white border-transparent hover:bg-primary/90 active:scale-95",
    glass: "bg-transparent border border-border text-white hover:bg-white/10 active:scale-95",
    outline: "bg-transparent border border-border text-white hover:bg-zinc-900/50 active:scale-95",
  };

  return (
    <button 
      className={cn(
        "px-8 py-3 rounded-full font-bold transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
        variants[variant as keyof typeof variants],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GlowText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-primary drop-shadow-[0_0_10px_rgba(29,155,240,0.2)]", className)}>
      {children}
    </span>
  );
}

export function FloatingElement({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -4, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={cn("mb-8 sm:mb-12", className)}>
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
        {title}
      </h2>
      {subtitle && <p className="text-muted-foreground text-sm sm:text-base font-medium">{subtitle}</p>}
    </div>
  );
}

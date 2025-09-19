import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus-visible:ring-primary-500",
    outline: "border-2 border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus-visible:ring-primary-500",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-slate-500",
    destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus-visible:ring-red-500"
  };
  
  const sizes = {
    default: "px-6 py-2.5 text-sm",
    sm: "px-4 py-2 text-xs",
    lg: "px-8 py-3 text-base",
    icon: "p-2.5"
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
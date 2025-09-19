import { cn } from "@/utils/cn";

const CategoryPill = ({ category, isActive, onClick, className, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105",
        isActive 
          ? "bg-primary-500 text-white shadow-md" 
          : "bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:bg-primary-50",
        className
      )}
      {...props}
    >
      {category.name}
      <span className={cn(
        "ml-2 px-1.5 py-0.5 rounded-full text-xs",
        isActive ? "bg-primary-600" : "bg-slate-100 text-slate-500"
      )}>
        {category.taskCount}
      </span>
    </button>
  );
};

export default CategoryPill;
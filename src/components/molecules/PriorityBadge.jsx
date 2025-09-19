import { cn } from "@/utils/cn";

const PriorityBadge = ({ priority, className, ...props }) => {
  const priorityStyles = {
    High: "bg-red-50 text-red-700 border-red-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-slate-50 text-slate-600 border-slate-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        priorityStyles[priority] || priorityStyles.Medium,
        className
      )}
      {...props}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default", ...props }) => {
  if (variant === "skeleton") {
    return (
      <div className={cn("animate-pulse space-y-4", className)} {...props}>
        <div className="space-y-3">
          <div className="h-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg"></div>
          <div className="h-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg"></div>
          <div className="h-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg"></div>
          <div className="h-16 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)} {...props}>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        <span className="text-slate-600 font-medium">Loading tasks...</span>
      </div>
    </div>
  );
};

export default Loading;
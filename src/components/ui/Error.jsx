import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  className, 
  message = "Something went wrong", 
  onRetry,
  showRetry = true,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)} {...props}>
      <div className="w-16 h-16 mb-4 rounded-full bg-red-50 flex items-center justify-center">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Oops! Something went wrong</h3>
      <p className="text-slate-600 mb-6 max-w-sm">{message}</p>
      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;
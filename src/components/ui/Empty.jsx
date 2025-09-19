import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className, 
  title = "No tasks yet", 
  description = "Get started by creating your first task", 
  actionText = "Add Task",
  onAction,
  icon = "CheckSquare",
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)} {...props}>
      <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 mb-8 max-w-sm">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default Empty;
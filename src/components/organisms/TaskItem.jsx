import { useState } from "react";
import { format, isPast, isToday } from "date-fns";
import Button from "@/components/atoms/Button";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      await onToggleComplete(task.Id, !task.completed);
    } finally {
      setIsCompleting(false);
    }
  };

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    const dueDate = new Date(task.dueDate);
    if (isPast(dueDate) && !isToday(dueDate)) return "overdue";
    if (isToday(dueDate)) return "today";
    return "future";
  };

  const getDueDateBadge = () => {
    if (!task.dueDate) return null;
    const status = getDueDateStatus();
    const dueDate = new Date(task.dueDate);
    
    const statusStyles = {
      overdue: "bg-red-50 text-red-700 border-red-200",
      today: "bg-amber-50 text-amber-700 border-amber-200",
      future: "bg-slate-50 text-slate-600 border-slate-200"
    };

    return (
      <span className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border",
        statusStyles[status]
      )}>
        <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
        {format(dueDate, "MMM dd")}
      </span>
    );
  };

  const getPriorityBorderColor = () => {
    switch (task.priority) {
      case "High": return "border-l-red-500";
      case "Medium": return "border-l-amber-500";
      case "Low": return "border-l-slate-400";
      default: return "border-l-slate-400";
    }
  };

  return (
    <div className={cn(
      "bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 p-4 group",
      getPriorityBorderColor(),
      task.completed && "opacity-75"
    )}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
            className="task-checkbox"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={cn(
              "font-semibold text-slate-800 transition-all duration-300",
              task.completed && "text-slate-500 task-completed"
            )}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
                className="w-8 h-8"
              >
                <ApperIcon name="Edit2" className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task.Id)}
                className="w-8 h-8 hover:bg-red-50 hover:text-red-600"
              >
                <ApperIcon name="Trash2" className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {task.description && (
            <p className={cn(
              "text-slate-600 text-sm mb-3 leading-relaxed",
              task.completed && "text-slate-400"
            )}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-3 flex-wrap">
            <PriorityBadge priority={task.priority} />
            {getDueDateBadge()}
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              {task.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;